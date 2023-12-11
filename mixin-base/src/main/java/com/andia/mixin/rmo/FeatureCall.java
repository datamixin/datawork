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
package com.andia.mixin.rmo;

import java.util.Arrays;

public final class FeatureCall extends FeatureMark {

	private Object[] arguments = new Object[0];

	public FeatureCall() {
		super(FeatureCall.class);
	}

	public FeatureCall(FeaturePath path, String name, Object... arguments) {
		super(FeatureCall.class, path, name);
		this.arguments = arguments;
	}

	public void setArguments(Object[] arguments) {
		this.arguments = arguments;
	}

	public Object[] getArguments() {
		return arguments;
	}

	@Override
	public String toString() {
		String mark = super.toString();
		return mark + "(" + Arrays.toString(arguments) + ")";
	}

}
