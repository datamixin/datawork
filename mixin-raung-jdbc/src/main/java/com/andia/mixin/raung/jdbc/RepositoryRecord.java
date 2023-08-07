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

import java.sql.Clob;
import java.sql.Timestamp;
import java.util.UUID;

import com.andia.mixin.jepara.Column;
import com.andia.mixin.jepara.Record;

public class RepositoryRecord implements Record {

	public static final String FLAG_ROOT_FOLDER = "D";
	public static final String FLAG_ROOT_FILE = "F";
	public static final String FLAG_REGULAR_FOLDER = "d";
	public static final String FLAG_REGULAR_FILE = "f";

	public static final String REPOSITORY = "repository";
	public static final String ID = "id";
	public static final String PARENT_ID = "parent_id";
	public static final String FLAG = "flag";
	public static final String NAME = "name";
	public static final String CONTENT = "content";
	public static final String EDITING = "editing";
	public static final String LAST_MODIFIED = "last_modified";
	public static final String LAST_EDITING = "last_editing";

	private String id;

	@Column(name = PARENT_ID)
	private String parentId;

	private String flag;

	private String name;

	private Clob contents;

	private Clob editing;

	@Column(name = LAST_MODIFIED)
	private Timestamp lastModified;

	@Column(name = LAST_EDITING)
	private Timestamp lastEditing;

	public UUID getId() {
		return UUID.fromString(id);
	}

	public UUID getParentId() {
		return UUID.fromString(parentId);
	}

	public String getFlag() {
		return flag;
	}

	public String getName() {
		return name;
	}

	public Clob getContent() {
		return contents;
	}

	public Clob getEditing() {
		return editing;
	}

	public Timestamp getLastModified() {
		return lastModified;
	}

	public Timestamp getLastEditing() {
		return lastEditing;
	}
}
