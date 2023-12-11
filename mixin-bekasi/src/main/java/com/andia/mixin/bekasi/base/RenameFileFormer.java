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
package com.andia.mixin.bekasi.base;

import java.util.Set;
import java.util.UUID;

import com.andia.mixin.bekasi.ConsolidatorFormer;
import com.andia.mixin.bekasi.ConsolidatorPath;

public class RenameFileFormer implements ConsolidatorFormer {

	private UUID fileId;
	private String parentPath;
	private String oldName;
	private String newName;

	public RenameFileFormer(UUID fileId, String parentPath, String oldName, String newName) {
		this.fileId = fileId;
		this.parentPath = parentPath;
		this.oldName = oldName;
		this.newName = newName;
	}

	@Override
	public UUID getFileId() {
		return fileId;
	}

	@Override
	public ConsolidatorPath[] createPaths(Set<UUID> siblingFileId) {
		String oldFullPath = ChangeFullPathFormer.getFullPath(parentPath, oldName);
		String newFullPath = ChangeFullPathFormer.getFullPath(parentPath, newName);
		ConsolidatorPath fullPath = new FullPathFileRenamePath(fileId, oldFullPath, newFullPath);
		ConsolidatorPath nameOnly = new NameOnlyFileRenamePath(fileId, oldName, newName, siblingFileId);
		return new ConsolidatorPath[] { fullPath, nameOnly };
	}

	class FullPathFileRenamePath extends ConsolidatorPath {

		private String[] path;
		private String newPath;

		public FullPathFileRenamePath(UUID fileId, String oldPath, String newPath) {
			super(fileId);
			this.path = new String[] { oldPath };
			this.newPath = newPath;
		}

		@Override
		public String[] getPath() {
			return path;
		}

		@Override
		public String getNewName(String oldName) {
			return newPath;
		}

	}

	class NameOnlyFileRenamePath extends ConsolidatorPath {

		private String[] path;
		private String newName;
		private Set<UUID> files;

		public NameOnlyFileRenamePath(UUID fileId, String oldName, String newName, Set<UUID> files) {
			super(fileId);
			this.files = files;
			this.path = new String[] { oldName };
			this.newName = newName;
		}

		@Override
		public String[] getPath() {
			return path;
		}

		@Override
		public boolean isIncluded(UUID fileId) {
			return files.contains(fileId);
		}

		@Override
		public String getNewName(String oldName) {
			return newName;
		}

	}

}
