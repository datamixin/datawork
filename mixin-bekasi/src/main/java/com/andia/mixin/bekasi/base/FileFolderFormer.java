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
import com.andia.mixin.bekasi.Runspace;

public class FileFolderFormer implements ConsolidatorFormer {

	private UUID fileId;
	private UUID oldFolderId;
	private String oldFolder;
	private String newFolder;
	private String fileName;

	public FileFolderFormer(UUID fileId, UUID oldFolderId, String oldFolder, String newFolder, String fileName) {
		this.fileId = fileId;
		this.oldFolderId = oldFolderId;
		this.oldFolder = oldFolder;
		this.newFolder = newFolder;
		this.fileName = fileName;
	}

	@Override
	public UUID getFileId() {
		return fileId;
	}

	@Override
	public ConsolidatorPath[] createPaths(Set<UUID> siblingFiles) {
		String oldPath = ChangeFullPathFormer.getFullPath(oldFolder, fileName);
		String newPath = ChangeFullPathFormer.getFullPath(newFolder, fileName);
		ConsolidatorPath fullPath = new ChangeFullPathFormer.FullPathChangePath(oldFolderId, oldPath, newPath);
		ConsolidatorPath nameOnly = new NameOnlyFileFolderChangePath(fileId, fileName, newFolder, siblingFiles);
		return new ConsolidatorPath[] { fullPath, nameOnly };
	}

	class NameOnlyFileFolderChangePath extends ConsolidatorPath {

		private String[] path;
		private String newFolder;
		private Set<UUID> files;

		public NameOnlyFileFolderChangePath(UUID fileId, String fileName, String newFolder, Set<UUID> files) {
			super(fileId);
			this.path = new String[] { fileName };
			this.newFolder = newFolder;
			this.files = files;
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
			if (newFolder.equals(Runspace.PATH_DELIMITER)) {
				return newFolder + oldName;
			} else {
				return newFolder + Runspace.PATH_DELIMITER + oldName;
			}
		}

	}
}
