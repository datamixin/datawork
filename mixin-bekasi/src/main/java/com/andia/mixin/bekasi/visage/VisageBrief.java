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
package com.andia.mixin.bekasi.visage;

import com.andia.mixin.value.MixinBrief;

public class VisageBrief extends VisageValue {

	private String type;
	private boolean simple;
	private int children;
	private String propose;
	private String digest;
	private String key;
	private Object value;

	public VisageBrief() {
		super(VisageBrief.class);
	}

	@Override
	public void init(Object source) {
		this.init((MixinBrief) source);
	}

	public void init(MixinBrief brief) {
		type = brief.getType();
		simple = brief.isSimple();
		children = brief.getChildren();
		propose = brief.getPropose();
		digest = brief.getDigest();
		key = brief.getKey();
		value = brief.getValue();
	}

	public String getType() {
		return type;
	}

	public boolean isSimple() {
		return simple;
	}

	public int getChildren() {
		return children;
	}

	public String getPropose() {
		return propose;
	}

	public String getDigest() {
		return digest;
	}

	public String getKey() {
		return key;
	}

	public Object getValue() {
		return value;
	}

	@Override
	public String info() {
		return "{@Brief, type:'" + type + "'}";
	}

}
