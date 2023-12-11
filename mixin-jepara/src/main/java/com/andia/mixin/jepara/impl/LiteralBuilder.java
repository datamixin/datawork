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
package com.andia.mixin.jepara.impl;

import java.util.List;
import java.util.Map;

import com.andia.mixin.jepara.ChainClause;
import com.andia.mixin.jepara.Clause;
import com.andia.mixin.jepara.DMLQuery;
import com.andia.mixin.jepara.Name;

public class LiteralBuilder {

	private StringBuffer buffer = new StringBuffer();

	public LiteralBuilder add(String string) {
		buffer.append(string);
		return this;
	}

	public LiteralBuilder add(Clause clause) {
		String literal = clause.getLiteral();
		if (clause instanceof DMLQuery) {
			open();
		}
		buffer.append(literal);
		if (clause instanceof DMLQuery) {
			close();
		}
		return this;
	}

	public LiteralBuilder add(int number) {
		buffer.append(number);
		return this;
	}

	public LiteralBuilder check(boolean check, String string) {
		if (check) {
			add(string);
			space();
		}
		return this;
	}

	public LiteralBuilder open() {
		buffer.append('(');
		return this;
	}

	public LiteralBuilder close() {
		buffer.append(')');
		return this;
	}

	public LiteralBuilder space() {
		buffer.append(' ');
		return this;
	}

	public LiteralBuilder comma() {
		buffer.append(',');
		return this;
	}

	public LiteralBuilder openClose(Clause[] clauses) {
		open();
		for (int i = 0; i < clauses.length; i++) {
			Clause clause = clauses[i];
			add(clause);
			if (i < clauses.length - 1) {
				comma();
				space();
			}
		}
		close();
		return this;
	}

	public LiteralBuilder openClose(Map<Name, ? extends Clause> namedClauses, List<? extends Clause> otherClauses) {

		open();

		// Name Clauses...
		Name[] names = namedClauses.keySet().toArray(new Name[0]);
		int countraintsCount = otherClauses.size();
		for (int i = 0; i < names.length; i++) {

			Name name = names[i];
			Clause clause = namedClauses.get(name);

			add(name);
			space();
			add(clause);

			if (i < names.length - 1) {
				comma();
				space();
			} else {
				if (countraintsCount > 0) {
					comma();
					space();
				}
			}
		}

		// Clauses..
		for (int i = 0; i < countraintsCount; i++) {
			Clause clause = otherClauses.get(i);
			add(clause);
			if (i < countraintsCount - 1) {
				comma();
				space();
			}
		}

		close();

		return this;
	}

	public LiteralBuilder comma(Clause[] clauses) {
		for (int i = 0; i < clauses.length; i++) {
			Clause clause = clauses[i];
			add(clause);
			if (i < clauses.length - 1) {
				comma();
				space();
			}
		}

		return this;
	}

	public LiteralBuilder comma(Map<Name, Clause> namedClauses, String delimiter) {

		// Name Clauses...
		Name[] names = namedClauses.keySet().toArray(new Name[0]);
		for (int i = 0; i < names.length; i++) {

			Name name = names[i];
			Clause clause = namedClauses.get(name);

			add(name);
			space();
			add(delimiter);
			space();
			add(clause);

			if (i < names.length - 1) {
				comma();
				space();
			}
		}

		return this;
	}

	public LiteralBuilder series(List<ChainClause> clauses) {

		int size = clauses.size();
		for (int i = 0; i < size; i++) {

			ChainClause chainClause = clauses.get(i);
			String name = chainClause.getName();
			Clause clause = chainClause.getClause();

			space();
			add(name);
			space();
			add(clause);

			if (i < size - 1) {
				space();
			}
		}

		return this;
	}

	public String build() {
		return buffer.toString();
	}

	@Override
	public String toString() {
		return buffer.toString();
	}

}
