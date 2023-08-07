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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SList;

public class XList extends XStructure implements SList {

	public static String XCLASSNAME = Sleman.getEClassName("XList");

	public static EReference FEATURE_ELEMENTS = new EReference("elements", XExpression.class);

	private EList<XExpression> elements = new BasicEList<>(this, FEATURE_ELEMENTS);

	public XList() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_ELEMENTS
		});
	}

	public EList<XExpression> getElements() {
		return this.elements;
	}

	@Override
	public int size() {
		return this.elements.size();
	}

	@Override
	public SExpression get(int index) {
		return this.elements.get(index);
	}

	@Override
	public String toLiteral() {
		String literal = "";
		literal += "[";
		for (int i = 0; i < this.elements.size(); i++) {
			XExpression expression = this.elements.get(i);
			literal += expression.toLiteral();
			if (i < this.elements.size() - 1) {
				literal += ", ";
			}
		}
		literal += "]";
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
