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

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.DeleteFrom;
import com.andia.mixin.jepara.Name;

public class DeleteFromImpl extends DMLQueryImpl implements DeleteFrom {

	private Name table;

	public DeleteFromImpl(Configuration configuration, Name table) {
		super(configuration);
		this.table = table;
	}

	@Override
	public String getLiteral() {
		return newBuilder("DELETE FROM")
				.space()
				.add(table)
				.space()
				.add(where())
				.build();
	}

}
