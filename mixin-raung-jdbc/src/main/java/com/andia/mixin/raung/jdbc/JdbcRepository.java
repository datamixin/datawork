/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.andia.mixin.raung.jdbc;

import static com.andia.mixin.raung.jdbc.RepositoryRecord.FLAG_REGULAR_FILE;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.FLAG_REGULAR_FOLDER;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.FLAG_ROOT_FILE;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.FLAG_ROOT_FOLDER;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.sql.DataSource;

import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;

@ApplicationScoped
public class JdbcRepository implements Repository {

	private final static String root = JdbcRepository.class.getSimpleName();
	private final static UUID rootId = UUID.nameUUIDFromBytes(root.getBytes());;
	private RepositoryTable table;

	@Inject
	public void setDataSource(@Named("repository") DataSource dataSource) throws SQLException {
		if (dataSource == null) {
			throw new IllegalArgumentException("Repository data source must not be null");
		}
		prepareTable(dataSource);
	}

	private void prepareTable(DataSource dataSource) throws SQLException {
		Connection connection = dataSource.getConnection();
		table = new RepositoryTable(connection);
	}

	private UUID createItem(UUID parentId, String name, String flag) {
		return table.insertRecord(parentId, name, flag);
	}

	@Override
	public RepositoryItemList loadRootItemList() {
		return new JdbcRepositoryItemList(table, rootId);
	}

	@Override
	public boolean isRootItemExists(String name) {
		return table.selectExistsByParentIdName(rootId, name);
	}

	@Override
	public UUID createRootFolder(String name) {
		return createItem(rootId, name, FLAG_ROOT_FOLDER);
	}

	@Override
	public UUID createRootFile(String name) {
		return createItem(rootId, name, FLAG_ROOT_FILE);
	}

	@Override
	public RepositoryItem loadRootItem(String name) {
		return loadItem(rootId, name);
	}
	
	@Override
	public UUID getRootItemId(String name) {
		return getItemId(rootId, name);
	}

	@Override
	public UUID createFolder(UUID folderId, String name) {
		return createItem(folderId, name, FLAG_REGULAR_FOLDER);
	}

	@Override
	public UUID createFile(UUID folderId, String name) {
		return createItem(folderId, name, FLAG_REGULAR_FILE);
	}

	@Override
	public RepositoryItemList loadItemList(UUID folderId) {
		return new JdbcRepositoryItemList(table, folderId);
	}

	@Override
	public RepositoryItem loadItem(UUID itemId) {
		RepositoryRecord record = table.selectRecord(itemId);
		if (record != null) {
			return new JdbcRepositoryItem(record);
		} else {
			return null;
		}
	}

	@Override
	public RepositoryItem loadItem(UUID folderId, String name) {
		RepositoryRecord record = table.selectRecordByParentIdName(folderId, name);
		if (record == null) {
			return null;
		} else {
			return new JdbcRepositoryItem(record);
		}
	}

	@Override
	public UUID getItemId(UUID folderId, String name) {
		RepositoryRecord record = table.selectRecordByParentIdName(folderId, name);
		if (record != null) {
			return record.getId();
		} else {
			return null;
		}
	}

	@Override
	public boolean isItemExists(UUID itemId) {
		return table.selectExistsById(itemId);
	}

	@Override
	public boolean isItemExists(UUID folderId, String name) {
		return table.selectExistsByParentIdName(folderId, name);
	}

	@Override
	public boolean moveItem(UUID itemId, UUID folderId) {
		return table.updateParentId(itemId, folderId);
	}

	@Override
	public UUID copyFile(UUID fileId, UUID folderId, String newName) throws RepositoryException {
		UUID newItemId = table.insertRecord(folderId, newName, FLAG_REGULAR_FILE);
		String content = table.selectContent(fileId);
		long timestamp = System.currentTimeMillis();
		table.updateContent(newItemId, timestamp, content);
		return newItemId;
	}

	@Override
	public boolean renameItem(UUID itemId, String newName) {
		return table.updateName(itemId, newName);
	}

	@Override
	public boolean deleteFile(UUID itemId) {
		return table.deleteRecord(itemId);
	}

	@Override
	public boolean saveContent(UUID fileId, String content) throws RepositoryException {
		long timestamp = System.currentTimeMillis();
		return table.updateContent(fileId, timestamp, content);
	}

	@Override
	public String loadContent(UUID fileId) throws RepositoryException {
		return table.selectContent(fileId);
	}

	@Override
	public String readEditing(UUID fileId) throws RepositoryException {
		return table.selectEditing(fileId);
	}

	@Override
	public boolean keepEditing(UUID fileId, String content) throws RepositoryException {
		long timestamp = System.currentTimeMillis();
		return table.updateEditing(fileId, timestamp, content);
	}

	@Override
	public boolean discardEditing(UUID fileId) throws RepositoryException {
		return table.updateEditing(fileId, Repository.UNDEFINED_TIME, null);
	}

	@Override
	public boolean placeEditing(UUID fileId) {
		return table.updateEditingSelectContent(fileId);
	}

	@Override
	public boolean flushEditing(UUID fileId) {
		return table.selectEditingUpdateContent(fileId);
	}

}
