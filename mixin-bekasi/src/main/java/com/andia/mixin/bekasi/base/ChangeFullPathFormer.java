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
import com.andia.mixin.bekasi.Runspace;

public class ChangeFullPathFormer implements ConsolidatorFormer {

	private UUID folderId;
	private String oldPath;
	private String newPath;

	public ChangeFullPathFormer(UUID folderId, String oldPath, String newPath) {
		this.folderId = folderId;
		this.oldPath = oldPath;
		this.newPath = newPath;
	}

	@Override
	public UUID getFileId() {
		return folderId;
	}

	@Override
	public ConsolidatorPath[] createPaths(Set<UUID> siblingFiles) {
		ConsolidatorPath fullPath = new FullPathChangePath(folderId, oldPath, newPath);
		return new ConsolidatorPath[] { fullPath };
	}

	public static String getFullPath(String path, String name) {
		if (path.equals(Runspace.PATH_DELIMITER)) {
			return path + name;
		} else {
			return path + Runspace.PATH_DELIMITER + name;
		}
	}

	static class FullPathChangePath extends ConsolidatorPath {

		private String[] path;
		private String oldPath;
		private String newPath;

		public FullPathChangePath(UUID fileId, String oldPath, String newPath) {
			super(fileId);
			this.path = new String[] { oldPath };
			this.oldPath = oldPath;
			this.newPath = newPath;
		}

		@Override
		public String[] getPath() {
			return path;
		}

		@Override
		public boolean isMatches(String... other) {
			if (other.length == 1) {
				return other[0].startsWith(oldPath);
			}
			return false;
		}

		@Override
		public String getNewName(String oldName) {
			if (oldName.equals(oldPath)) {
				return newPath;
			} else {
				int oldLength = oldPath.length();
				int start = oldLength == 1 ? 0 : oldLength;
				String pointer = oldName.substring(start + 1);
				return getFullPath(newPath, pointer);
			}
		}

	}
}
