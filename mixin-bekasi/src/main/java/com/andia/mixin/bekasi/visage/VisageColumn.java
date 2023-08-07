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

import com.andia.mixin.Lean;
import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinColumnMetadata;
import com.andia.mixin.value.MixinType;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VisageColumn extends Lean implements MixinColumn {

	@JsonProperty
	private Object key;
	private String type = MixinType.STRING.name();
	private VisageColumnMetadata metadata = new VisageColumnMetadata();

	public VisageColumn() {
		super(VisageColumn.class);
	}

	public VisageColumn(String key, String type) {
		this();
		this.key = key;
		this.type = type;
	}

	public VisageColumn(String key) {
		this(key, MixinType.STRING.name());
	}

	public VisageColumn(MixinColumn column) {
		this();
		this.key = column.getKey();
		this.type = column.getType();
		MixinColumnMetadata metadata = column.getMetadata();
		this.metadata = new VisageColumnMetadata(metadata);
	}

	@Override
	public Object getKey() {
		return key;
	}

	@Override
	public String getType() {
		return type;
	}

	@Override
	public MixinColumnMetadata getMetadata() {
		return metadata;
	}

}