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
package com.andia.mixin.sleman.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SObject;

public class XObject extends XStructure implements SObject {

	public static String XCLASSNAME = Sleman.getEClassName("XObject");

	public static EReference FEATURE_FIELDS = new EReference("fields", XAssignment.class);

	private EList<XAssignment> fields = new BasicEList<>(this, FEATURE_FIELDS);

	public XObject() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_FIELDS
		});
	}

	public EList<XAssignment> getFields() {
		return this.fields;
	}

	@Override
	public int fieldSize() {
		return this.fields.size();
	}

	@Override
	public Collection<String> fieldNames() {
		List<String> names = new ArrayList<>();
		for (XAssignment assignment : fields) {
			XIdentifier identifier = assignment.getName();
			String name = identifier.getName();
			names.add(name);
		}
		return names;
	}

	@Override
	public XExpression getField(String name) {
		for (XAssignment assignment : fields) {
			XIdentifier identifier = assignment.getName();
			if (name.equals(identifier.getName())) {
				return assignment.getExpression();
			}
		}
		return null;
	}

	@Override
	public String toLiteral() {
		String literal = "{";
		for (int i = 0; i < this.fields.size(); i++) {
			XAssignment field = this.fields.get(i);
			XIdentifier identifier = field.getName();
			String name = identifier.getName();
			XExpression expression = field.getExpression();
			literal += name + ": " + expression.toLiteral();
			if (i < this.fields.size() - 1) {
				literal += ", ";
			}
		}
		literal += '}';
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}
}
