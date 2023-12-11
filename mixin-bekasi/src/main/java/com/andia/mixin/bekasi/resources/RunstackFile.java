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
package com.andia.mixin.bekasi.resources;

import java.util.UUID;

import com.andia.mixin.Lean;
import com.andia.mixin.raung.Repository;

public class RunstackFile extends Lean {

	private UUID fileId;
	private String name;
	private String nameOnly;
	private String extension;
	private UUID parentId;
	private boolean untitled;
	private boolean committed;

	public RunstackFile(UUID fileId, String name, UUID parentId, boolean untitled,
			long lastModified, long lastEditing) {
		super(RunstackFile.class);
		this.fileId = fileId;
		this.name = name;
		int dotIndex = name.indexOf('.');
		this.nameOnly = name.substring(0, dotIndex);
		this.extension = name.substring(dotIndex + 1);
		this.parentId = parentId;
		this.untitled = untitled;
		this.committed = lastModified == lastEditing || lastEditing == Repository.UNDEFINED_TIME;
	}

	public UUID getFileId() {
		return fileId;
	}

	public String getName() {
		return name;
	}

	public String getNameOnly() {
		return nameOnly;
	}

	public String getExtension() {
		return extension;
	}

	public UUID getParentId() {
		return parentId;
	}

	public boolean isUntitled() {
		return untitled;
	}

	public boolean isCommitted() {
		return committed;
	}

}
