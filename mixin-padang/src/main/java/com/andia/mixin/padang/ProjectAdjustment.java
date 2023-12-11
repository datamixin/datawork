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
package com.andia.mixin.padang;

import java.util.UUID;

import com.andia.mixin.bekasi.Adjustment;
import com.andia.mixin.bekasi.AdjustmentCopy;
import com.andia.mixin.bekasi.AdjustmentSet;
import com.andia.mixin.bekasi.RunstateException;
import com.andia.mixin.model.EObject;
import com.andia.mixin.padang.outset.ProjectOutset;
import com.andia.mixin.rmo.Regulator;

public class ProjectAdjustment implements Adjustment {

	private UUID fileId;
	private ProjectOutset outset;

	public ProjectAdjustment(UUID fileId, Regulator regulator) {
		this.fileId = fileId;
		outset = (ProjectOutset) regulator.getOutset();
	}

	@Override
	public void cutoff() {
		try {
			outset.delete();
		} catch (ProjectException e) {
			throw new RunstateException("Fail cutoff project " + fileId, e);
		}
	}

	@Override
	public void save(EObject storedModel) {

	}

	@Override
	public AdjustmentSet revert(EObject storedModel) {
		return new ProjectAdjustmentSet();
	}

	@Override
	public void recompute(AdjustmentSet original) {

	}

	@Override
	public void commitCutoff() {

	}

	@Override
	public AdjustmentCopy saveAs(UUID newFileId) {
		return new ProjectAdjustmentCopy();
	}

	@Override
	public AdjustmentCopy copyTo(EObject storedModel, UUID targetFileId) throws RunstateException {
		try {
			outset.copyTo(targetFileId);
			return new ProjectAdjustmentCopy();
		} catch (ProjectException e) {
			throw new RunstateException("Fail copy project", e);
		}
	}

	@Override
	public void resettle(AdjustmentCopy newCopy) {

	}

	@Override
	public void delete() throws RunstateException {
		try {
			outset.delete();
		} catch (ProjectException e) {
			throw new RunstateException("Fail delete project " + fileId, e);
		}
	}

	@Override
	public void rename() {

	}

}
