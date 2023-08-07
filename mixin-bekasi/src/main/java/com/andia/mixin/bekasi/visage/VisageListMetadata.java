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
package com.andia.mixin.bekasi.visage;

import com.andia.mixin.value.MixinListMetadata;

public class VisageListMetadata extends VisageValue implements MixinListMetadata {

	private int elementCount = UNDETERMINED;
	private int partElementCount = UNDETERMINED;

	public VisageListMetadata() {
		super(VisageListMetadata.class);
	}

	public VisageListMetadata(MixinListMetadata metadata) {
		this();
		elementCount = metadata.getElementCount();
		partElementCount = metadata.getPartElementCount();
	}

	@Override
	public int getElementCount() {
		return elementCount;
	}

	public void setElementCount(int elementCount) {
		this.elementCount = elementCount;
	}

	@Override
	public int getPartElementCount() {
		return partElementCount;
	}

	public void setPartElementCount(int partElementCount) {
		this.partElementCount = partElementCount;
	}

	@Override
	public String info() {
		return "{@class:ListMetadata, elementCount:" + elementCount + "}";
	}

}
