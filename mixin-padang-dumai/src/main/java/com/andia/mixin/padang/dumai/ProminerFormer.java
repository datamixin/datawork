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
package com.andia.mixin.padang.dumai;

import java.util.Set;
import java.util.UUID;

import com.andia.mixin.bekasi.ConsolidatorFormer;
import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.util.ArrayUtils;

public class ProminerFormer implements ConsolidatorFormer {

	private UUID fileId;
	private String fileName;
	private String[] path;
	private String[] origin;
	private String newName;

	public ProminerFormer(Supervisor supervisor, OriginAnchor anchor) {
		Lifestage lifestage = supervisor.getCapability(Lifestage.class);
		fileId = lifestage.getFileId();
		fileName = lifestage.getFileName();
		origin = anchor.getPath();
	}

	public UUID getFileId() {
		return fileId;
	}

	public void setName(String newName) {
		this.newName = newName;
		if (this.path == null) {
			this.path = ArrayUtils.push(origin, newName);
		}
	}

	@Override
	public ConsolidatorPath[] createPaths(Set<UUID> siblingFiles) {
		String[] modified = ArrayUtils.splice(path, 0, 1, fileName);
		ConsolidatorPath fullPath = new FullPathProminerPath(fileId, path, newName);
		ConsolidatorPath nameOnly = new FullPathProminerPath(fileId, modified, newName);
		return new ConsolidatorPath[] { fullPath, nameOnly };
	}

	public void updatePath() {
		this.path[this.path.length - 1] = newName;
	}

	class FullPathProminerPath extends ConsolidatorPath {

		private String[] path;
		private String newName;

		public FullPathProminerPath(UUID fileId, String[] path, String newName) {
			super(fileId);
			this.path = path;
			this.newName = newName;
		}

		@Override
		public String[] getPath() {
			return this.path;
		}

		@Override
		public String getNewName(String oldName) {
			return newName;
		}

	}

}
