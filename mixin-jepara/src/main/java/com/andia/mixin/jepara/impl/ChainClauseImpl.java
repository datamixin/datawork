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

import com.andia.mixin.jepara.ChainClause;
import com.andia.mixin.jepara.Clause;

public class ChainClauseImpl implements ChainClause {

	private String name;
	private Clause clause;

	public ChainClauseImpl(String name, Clause clause) {
		this.name = name;
		this.clause = clause;
		assert clause != null;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public Clause getClause() {
		return clause;
	}

}
