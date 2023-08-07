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
package com.andia.mixin.padang.reconciles;

import java.util.UUID;

import com.andia.mixin.bekasi.reconciles.FileReconcile;

public abstract class DatasetReconcile extends FileReconcile {

	protected String dataset;

	public DatasetReconcile(Class<?> reconcileClass) {
		super(reconcileClass);
	}

	public DatasetReconcile(Class<?> reconcileClass, UUID fileId, String dataset) {
		super(reconcileClass, fileId);
		this.dataset = dataset;
	}

	public void setDataset(String dataset) {
		this.dataset = dataset;
	}

	public String getDataset() {
		return dataset;
	}

}
