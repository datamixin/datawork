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

import java.util.UUID;

import com.andia.mixin.model.EObject;

public interface Adjustment {

	/**
	 * Hapus dan batalkan semua model yang telah dibuat untuk untitled.
	 */
	public void cutoff();

	public void save(EObject storedModel);

	public AdjustmentSet revert(EObject storedModel);

	public void recompute(AdjustmentSet original);

	public void commitCutoff();

	public AdjustmentCopy saveAs(UUID newFileId) throws RunstateException;

	public AdjustmentCopy copyTo(EObject storedModel, UUID targetFileId) throws RunstateException;

	public void resettle(AdjustmentCopy copiedVariables);

	public void delete() throws RunstateException;

	public void rename();

}
