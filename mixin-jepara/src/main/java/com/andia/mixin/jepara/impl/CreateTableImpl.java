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
package com.andia.mixin.jepara.impl;

import static com.andia.mixin.jepara.impl.DSL.name;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.Constraint;
import com.andia.mixin.jepara.CreateTable;
import com.andia.mixin.jepara.DataType;
import com.andia.mixin.jepara.Name;

public class CreateTableImpl extends QueryImpl implements CreateTable {

	private final Name name;
	private Map<Name, DataType<?>> columns = new LinkedHashMap<>();
	private List<Constraint> constraints = new ArrayList<>();

	public CreateTableImpl(Configuration configuration, Name name) {
		super(configuration);
		this.name = name;
	}

	@Override
	public CreateTable column(String name, DataType<?> type) {
		this.columns.put(name(name), type);
		return this;
	}

	@Override
	public CreateTable constraints(Constraint... constraints) {
		for (Constraint constraint : constraints) {
			this.constraints.add(constraint);
		}
		return this;
	}

	@Override
	public String getLiteral() {
		return newBuilder("CREATE TABLE")
				.space()
				.add(name)
				.space()
				.openClose(columns, constraints)
				.build();
	}

}
