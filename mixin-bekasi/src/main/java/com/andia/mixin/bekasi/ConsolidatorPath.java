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
package com.andia.mixin.bekasi;

import java.util.Arrays;
import java.util.UUID;

import com.andia.mixin.rmo.Supervisor;

public abstract class ConsolidatorPath {

	private UUID fileId;

	public ConsolidatorPath(Supervisor supervisor) {
		Lifestage lifestage = supervisor.getCapability(Lifestage.class);
		fileId = lifestage.getFileId();
	}

	public ConsolidatorPath(UUID fileId) {
		this.fileId = fileId;
	}

	public UUID getFileId() {
		return fileId;
	}

	public abstract String[] getPath();

	public boolean isIncluded(UUID fileId) {
		return true;
	}

	public boolean isMatches(String... other) {
		String[] path = this.getPath();
		return Arrays.equals(path, other);
	}

	public abstract String getNewName(String oldName);

}
