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

import java.sql.Timestamp;
import java.util.UUID;

import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;

public class JdbcRepositoryItem implements RepositoryItem, Comparable<JdbcRepositoryItem> {

	private UUID id;
	private String name;
	private UUID parentId;
	private boolean file;
	private boolean directory;
	private long lastModified;
	private long lastEditing;

	public JdbcRepositoryItem(RepositoryRecord record) {
		id = record.getId();
		name = record.getName();
		parentId = record.getParentId();
		readLastModified(record);
		readLastEditing(record);
		readFile(record);
		readDirectory(record);
	}

	private void readLastModified(RepositoryRecord record) {
		Timestamp modified = record.getLastModified();
		lastModified = modified == null ? Repository.UNDEFINED_TIME : modified.getTime();
	}

	private void readLastEditing(RepositoryRecord record) {
		Timestamp modified = record.getLastEditing();
		lastEditing = modified == null ? Repository.UNDEFINED_TIME : modified.getTime();
	}

	private void readFile(RepositoryRecord record) {
		String flag = record.getFlag();
		file = flag.equals(FLAG_REGULAR_FILE) || flag.equals(FLAG_ROOT_FILE);
	}

	private void readDirectory(RepositoryRecord record) {
		String flag = record.getFlag();
		directory = flag.equals(FLAG_REGULAR_FOLDER) || flag.equals(FLAG_ROOT_FOLDER);
	}

	@Override
	public UUID getId() {
		return id;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public UUID getParentId() {
		return parentId;
	}

	@Override
	public boolean isFile() {
		return file;
	}

	@Override
	public boolean isFolder() {
		return directory;
	}

	@Override
	public long getLastModified() {
		return lastModified;
	}

	@Override
	public long getLastEditing() {
		return lastEditing;
	}

	@Override
	public int compareTo(JdbcRepositoryItem o) {
		if (file) {
			if (!o.file) {
				return 1;
			}
		} else {
			if (o.file) {
				return -1;
			}
		}
		String nameOnly = getNameOnly(name);
		String oNameOnly = getNameOnly(o.name);
		return nameOnly.compareTo(oNameOnly);
	}

	private String getNameOnly(String name) {
		int dot = name.lastIndexOf('.');
		if (dot > 0) {
			return name.substring(0, dot);
		} else {
			return name;
		}
	}

}
