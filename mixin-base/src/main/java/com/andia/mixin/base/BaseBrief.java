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
package com.andia.mixin.base;

import com.andia.mixin.value.MixinBrief;
import com.andia.mixin.value.MixinType;

public abstract class BaseBrief implements MixinBrief {

	private String type;
	private boolean simple;
	private int children;
	private String propose;
	private String digest;
	private Object value;
	private String key;

	public BaseBrief() {

	}

	public BaseBrief(Class<?> type, boolean simple, String source, String digest, String key, Object value) {
		this(MixinType.getType(type).name(), simple, source, digest, key, value);
	}

	public BaseBrief(String type, boolean simple, String source, String digest, String key, Object value) {
		this.type = type;
		this.simple = simple;
		this.propose = source;
		this.digest = digest;
		this.key = key;
		this.value = value;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String getType() {
		return type;
	}

	public void setSimple(boolean simple) {
		this.simple = simple;
	}

	@Override
	public int getChildren() {
		return children;
	}

	public void setChildren(int children) {
		this.children = children;
	}

	@Override
	public boolean isSimple() {
		return simple;
	}

	public void setDigest(String digest) {
		this.digest = digest;
	}

	@Override
	public String getPropose() {
		return propose;
	}

	public void setPropose(String propose) {
		this.propose = propose;
	}

	@Override
	public String getDigest() {
		return digest;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Override
	public String getKey() {
		return key;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	@Override
	public Object getValue() {
		return value;
	}

}
