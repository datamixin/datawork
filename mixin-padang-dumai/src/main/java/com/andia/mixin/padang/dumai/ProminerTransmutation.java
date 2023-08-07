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
package com.andia.mixin.padang.dumai;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import com.andia.mixin.sleman.api.SExpression;

public class ProminerTransmutation implements Transformation {

	private final String name;
	private final Map<String, SExpression> options = new LinkedHashMap<>();

	public ProminerTransmutation(String name) {
		this.name = name;
	}

	public ProminerTransmutation(String operation, Map<String, SExpression> arguments) {
		this.name = operation;
		Set<String> keySet = arguments.keySet();
		for (String name : keySet) {
			SExpression object = arguments.get(name);
			setOption(name, object);
		}
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public Collection<String> getOptionNames() {
		return options.keySet();
	}

	@Override
	public SExpression getOptionValue(String name) {
		return options.get(name);
	}

	public void setOption(String name, SExpression value) {
		options.put(name, value);
	}

	@Override
	public String toString() {
		return name + " " + options;
	}

}
