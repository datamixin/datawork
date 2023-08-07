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
package com.andia.mixin.bekasi.base;

import java.util.Set;
import java.util.UUID;

import com.andia.mixin.bekasi.ConsolidatorFormer;
import com.andia.mixin.bekasi.ConsolidatorPath;

public class DependentFilesFormer implements ConsolidatorFormer {

	private UUID fileId;
	private String filePath;
	private String fileName;

	public DependentFilesFormer(UUID fileId, String filePath, String fileName) {
		this.fileId = fileId;
		this.filePath = filePath;
		this.fileName = fileName;
	}

	@Override
	public UUID getFileId() {
		return fileId;
	}

	@Override
	public ConsolidatorPath[] createPaths(Set<UUID> siblingFiles) {
		ConsolidatorPath fullPath = new FullPathFileFolderDependentPath(fileId, filePath);
		ConsolidatorPath namePath = new NameOnlyDependentPath(fileId, fileName, siblingFiles);
		return new ConsolidatorPath[] { fullPath, namePath };
	}

	class FullPathFileFolderDependentPath extends ConsolidatorPath {

		protected String[] path;

		public FullPathFileFolderDependentPath(UUID fileId, String filePath) {
			super(fileId);
			this.path = new String[] { filePath };
		}

		@Override
		public String[] getPath() {
			return path;
		}

		@Override
		public String getNewName(String name) {
			return name;
		}

	}

	class NameOnlyDependentPath extends ConsolidatorPath {

		protected String[] path;
		private Set<UUID> files;

		public NameOnlyDependentPath(UUID fileId, String fileName, Set<UUID> files) {
			super(fileId);
			this.files = files;
			this.path = new String[] { fileName };
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
		public String getNewName(String name) {
			return name;
		}

	}

}
