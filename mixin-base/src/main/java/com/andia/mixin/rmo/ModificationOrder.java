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
package com.andia.mixin.rmo;

import java.util.Arrays;

import com.andia.mixin.Lean;

public final class ModificationOrder extends Lean {

	private Modification[] modifications;

	public ModificationOrder() {
		super(ModificationOrder.class);
	}

	public ModificationOrder(Modification... modifications) {
		this();
		this.modifications = modifications;
	}

	public Modification[] getModifications() {
		return modifications;
	}

	public void setModifications(Modification[] modifications) {
		this.modifications = modifications;
	}

	@Override
	public String toString() {
		return Arrays.toString(modifications);
	}
}
