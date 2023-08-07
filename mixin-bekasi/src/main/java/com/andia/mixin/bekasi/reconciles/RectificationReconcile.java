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
package com.andia.mixin.bekasi.reconciles;

import java.util.UUID;

import com.andia.mixin.rmo.Modification;

public class RectificationReconcile extends FileReconcile {

	private Modification rectification;

	public RectificationReconcile() {
		super(RectificationReconcile.class);
	}

	public RectificationReconcile(UUID fileId, Modification rectification) {
		super(RectificationReconcile.class, fileId);
		this.rectification = rectification;
	}

	public void setRectification(Modification rectification) {
		this.rectification = rectification;
	}

	public Modification getRectification() {
		return rectification;
	}

	@Override
	public String info() {
		return "{type: 'RectificationReconcile', fileId: '" + fileId + "', rectification: '" + rectification + "'}";
	}

}
