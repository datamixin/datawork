/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
package com.andia.mixin.raung.jdbc;

import static com.andia.mixin.jepara.impl.DSL.column;
import static com.andia.mixin.jepara.impl.DSL.field;
import static com.andia.mixin.jepara.impl.DSL.param;
import static com.andia.mixin.jepara.impl.DSL.primaryKey;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.CONTENT;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.EDITING;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.FLAG;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.ID;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.LAST_EDITING;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.LAST_MODIFIED;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.NAME;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.PARENT_ID;
import static com.andia.mixin.raung.jdbc.RepositoryRecord.REPOSITORY;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.UUID;

import javax.sql.rowset.serial.SerialClob;

import com.andia.mixin.jepara.DSLContext;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.Query;
import com.andia.mixin.jepara.QueryException;
import com.andia.mixin.jepara.SQLDialect;
import com.andia.mixin.jepara.Select;
import com.andia.mixin.jepara.Settings;
import com.andia.mixin.jepara.datatype.SQLDataType;
import com.andia.mixin.jepara.impl.DSL;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;

public class RepositoryTable {

	private DSLContext context;
	private PreparedQuery insertRecord;
	private PreparedQuery selectRecord;
	private PreparedQuery selectRecordsByParentId;
	private PreparedQuery selectId;
	private PreparedQuery selectIdByParentIdName;
	private PreparedQuery selectRecordByParentIdName;
	private PreparedQuery updateParentId;
	private PreparedQuery updateName;
	private PreparedQuery deleteRecord;
	private PreparedQuery selectContent;
	private PreparedQuery selectEditing;
	private PreparedQuery updateContent;
	private PreparedQuery updateEditing;
	private PreparedQuery updateEditingSelectContent;
	private PreparedQuery updateContentSelectEditing;

	public RepositoryTable(Connection connection) {

		// DSL Context
		prepareContext(connection);

		// Table and Index
		if (!isTableExists(connection)) {
			prepareTable();
			prepareParentIdIndex();
		}

		// Prepared statements
		prepareInsertRecord();
		prepareSelectRecord();
		prepareSelectRecordsByParentId();
		prepareSelectId();
		prepareSelectIdByParentIdName();
		prepareSelectRecordByParentIdName();
		prepareUpdateParentId();
		prepareUpdateName();
		prepareDeleteRecord();
		prepareSelectContent();
		prepareSelectEditing();
		prepareUpdateContent();
		prepareUpdateEditing();
		prepareUpdateEditingSelectContent();
		prepareUpdateContentSelectEditing();
	}

	// ========================================================================
	// PRIVATE METHOD
	// ========================================================================

	private void prepareContext(Connection connection) {
		Settings settings = new Settings();
		context = DSL.using(connection, SQLDialect.SQL92, settings);
	}

	private boolean isTableExists(Connection connection) {
		try {
			DatabaseMetaData dbmeta = connection.getMetaData();
			ResultSet resultSet = dbmeta.getTables(null, null, REPOSITORY.toUpperCase(), null);
			while (resultSet.next()) {
				return true;
			}
			return false;
		} catch (SQLException e) {
			throw new QueryException("Fail check table exists");
		}
	}

	private void prepareTable() {
		Query query = context
				.createTable(REPOSITORY)
				.column(ID, SQLDataType.VARCHAR(36))
				.column(PARENT_ID, SQLDataType.VARCHAR(36))
				.column(FLAG, SQLDataType.VARCHAR(2))
				.column(NAME, SQLDataType.VARCHAR(128))
				.column(CONTENT, SQLDataType.CLOB)
				.column(EDITING, SQLDataType.CLOB)
				.column(LAST_MODIFIED, SQLDataType.TIMESTAMP)
				.column(LAST_EDITING, SQLDataType.TIMESTAMP)
				.constraints(primaryKey(ID));
		query.execute();
	}

	private void prepareParentIdIndex() {
		Query query = context
				.createIndex("NAME_" + REPOSITORY)
				.on(REPOSITORY, PARENT_ID);
		query.execute();
	}

	private void prepareInsertRecord() {
		insertRecord = context
				.insertInto(REPOSITORY)
				.columns(ID, PARENT_ID, NAME, FLAG, LAST_MODIFIED, LAST_EDITING)
				.values(
						param(ID, SQLDataType.VARCHAR),
						param(PARENT_ID, SQLDataType.UUID),
						param(NAME, SQLDataType.VARCHAR),
						param(FLAG, SQLDataType.VARCHAR),
						param(LAST_MODIFIED, SQLDataType.TIMESTAMP),
						param(LAST_EDITING, SQLDataType.TIMESTAMP))
				.prepare();
	}

	private Select selectRecordFrom() {
		return context.select(
				column(ID),
				column(PARENT_ID),
				column(NAME),
				column(FLAG),
				column(LAST_MODIFIED),
				column(LAST_EDITING))
				.from(REPOSITORY);
	}

	private void prepareSelectRecordsByParentId() {
		selectRecordsByParentId = selectRecordFrom()
				.where(field(PARENT_ID).equal(param(PARENT_ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareSelectRecord() {
		selectRecord = selectRecordFrom()
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareSelectId() {
		selectId = context
				.select(column(ID))
				.from(REPOSITORY)
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareSelectIdByParentIdName() {
		selectIdByParentIdName = context
				.select(column(ID))
				.from(REPOSITORY)
				.where(field(PARENT_ID).equal(param(PARENT_ID, SQLDataType.UUID))
						.and(field(NAME).equal(param(NAME, SQLDataType.VARCHAR))))
				.prepare();
	}

	private void prepareSelectRecordByParentIdName() {
		selectRecordByParentIdName = selectRecordFrom()
				.where(field(PARENT_ID).equal(param(PARENT_ID, SQLDataType.UUID))
						.and(field(NAME).equal(param(NAME, SQLDataType.VARCHAR))))
				.prepare();
	}

	private void prepareUpdateParentId() {
		updateParentId = context
				.update(REPOSITORY)
				.set(PARENT_ID, param(PARENT_ID, SQLDataType.UUID))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareUpdateName() {
		updateName = context
				.update(REPOSITORY)
				.set(NAME, param(NAME, SQLDataType.VARCHAR))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareDeleteRecord() {
		deleteRecord = context
				.deleteFrom(REPOSITORY)
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareSelectContent() {
		selectContent = context
				.select(column(CONTENT))
				.from(REPOSITORY)
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareUpdateContent() {
		updateContent = context
				.update(REPOSITORY)
				.set(LAST_MODIFIED, param(LAST_MODIFIED, SQLDataType.TIMESTAMP))
				.set(CONTENT, param(CONTENT, SQLDataType.CLOB))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareSelectEditing() {
		selectEditing = context
				.select(column(EDITING))
				.from(REPOSITORY)
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareUpdateEditing() {
		updateEditing = context
				.update(REPOSITORY)
				.set(LAST_EDITING, param(LAST_EDITING, SQLDataType.TIMESTAMP))
				.set(EDITING, param(EDITING, SQLDataType.CLOB))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareUpdateEditingSelectContent() {
		updateEditingSelectContent = context
				.update(REPOSITORY)
				.set(LAST_EDITING, field(LAST_MODIFIED))
				.set(EDITING, field(CONTENT))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	private void prepareUpdateContentSelectEditing() {
		updateContentSelectEditing = context
				.update(REPOSITORY)
				.set(LAST_MODIFIED, field(LAST_EDITING))
				.set(CONTENT, field(EDITING))
				.where(field(ID).equal(param(ID, SQLDataType.UUID)))
				.prepare();
	}

	// ========================================================================
	// PUBLIC METHOD
	// ========================================================================

	public synchronized UUID insertRecord(UUID parentId, String name, String flag) {
		UUID id = UUID.randomUUID();
		insertRecord
				.bind(ID, id.toString())
				.bind(PARENT_ID, parentId.toString())
				.bind(NAME, name)
				.bind(FLAG, flag)
				.bind(LAST_MODIFIED, System.currentTimeMillis())
				.bind(LAST_EDITING, Repository.UNDEFINED_TIME)
				.executeUpdate();
		return id;
	}

	public synchronized RepositoryRecord selectRecord(UUID itemId) {
		return selectRecord.bind(ID, itemId.toString())
				.fetchOne(RepositoryRecord.class);
	}

	public synchronized Collection<RepositoryRecord> selectRecordsByParentId(UUID parentId) {
		return selectRecordsByParentId.bind(PARENT_ID, parentId.toString())
				.fetch(RepositoryRecord.class);
	}

	public synchronized boolean updateParentId(UUID itemId, UUID parentId) {
		int update = updateParentId.bind(PARENT_ID, parentId.toString())
				.bind(ID, itemId.toString())
				.executeUpdate();
		return update == 1;
	}

	public synchronized boolean selectExistsById(UUID itemId) {
		return selectId.bind(ID, itemId.toString())
				.fetch(UUID.class)
				.size() == 1;
	}

	public synchronized boolean selectExistsByParentIdName(UUID parentId, String name) {
		return selectIdByParentIdName.bind(PARENT_ID, parentId.toString())
				.bind(NAME, name)
				.fetch(UUID.class)
				.size() == 1;
	}

	public synchronized RepositoryRecord selectRecordByParentIdName(UUID parentId, String name) {
		return selectRecordByParentIdName.bind(PARENT_ID, parentId.toString())
				.bind(NAME, name)
				.fetchOne(RepositoryRecord.class);
	}

	private String selectClob(PreparedQuery query, UUID fileId) throws RepositoryException {
		try {

			// Ambil content dalam bentuk clob
			Clob clob = query.bind(ID, fileId.toString())
					.fetchOne(Clob.class);

			if (clob == null) {
				return null;
			}

			// Convert clob menjadi string
			long length = clob.length();
			return clob.getSubString(1L, (int) length);

		} catch (Exception e) {
			throw new RepositoryException("Fail select clob " + fileId, e);
		}
	}

	private boolean updateClob(UUID fileId, PreparedQuery query,
			String timeColumn, long timeValue,
			String clobColumn, String clobValue) throws RepositoryException {
		try {

			Clob clob = null;

			if (clobValue != null) {

				// Convert string menjadi clob
				char[] array = clobValue.toCharArray();
				clob = new SerialClob(array);

			}

			// Execute update
			return query.bind(ID, fileId.toString())
					.bind(clobColumn, clob)
					.bind(timeColumn, timeValue)
					.executeUpdate() == 1;

		} catch (Exception e) {
			throw new RepositoryException("Fail update content " + fileId, e);
		}
	}

	public synchronized String selectContent(UUID fileId) throws RepositoryException {
		return selectClob(selectContent, fileId);
	}

	public synchronized boolean updateContent(UUID fileId, long timestamp, String content) throws RepositoryException {
		return updateClob(fileId, updateContent, LAST_MODIFIED, timestamp, CONTENT, content);
	}

	public synchronized String selectEditing(UUID fileId) throws RepositoryException {
		return selectClob(selectEditing, fileId);
	}

	public synchronized boolean updateEditing(UUID fileId, long timestamp, String editing) throws RepositoryException {
		return updateClob(fileId, updateEditing, LAST_EDITING, timestamp, EDITING, editing);
	}

	public synchronized boolean updateName(UUID itemId, String newName) {
		return updateName.bind(ID, itemId.toString())
				.bind(NAME, newName)
				.executeUpdate() == 1;
	}

	public synchronized boolean deleteRecord(UUID itemId) {
		return deleteRecord.bind(ID, itemId.toString())
				.executeUpdate() == 1;
	}

	public synchronized boolean updateEditingSelectContent(UUID fileId) {
		return updateEditingSelectContent.bind(ID, fileId.toString())
				.executeUpdate() == 1;
	}

	public synchronized boolean selectEditingUpdateContent(UUID fileId) {
		return updateContentSelectEditing.bind(ID, fileId.toString())
				.executeUpdate() == 1;
	}

}
