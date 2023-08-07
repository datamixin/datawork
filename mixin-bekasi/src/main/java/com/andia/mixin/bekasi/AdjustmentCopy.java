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

import com.andia.mixin.model.EObject;

public interface AdjustmentCopy {

	/**
	 * Lakukan proses perubahan feature yang harus dibedakan antara asli dan
	 * copy-nya.
	 * 
	 * @param editedModelCopy
	 */
	public void reassignFeatures(EObject editedModelCopy);

}
