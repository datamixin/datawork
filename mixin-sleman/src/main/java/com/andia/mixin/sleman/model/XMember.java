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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SMember;
import com.andia.mixin.sleman.api.SPointer;

public class XMember extends XPointer implements SMember {

	public static String XCLASSNAME = Sleman.getEClassName("XMember");

	public static EReference FEATURE_OBJECT = new EReference("object", XPointer.class);
	public static EReference FEATURE_PROPERTY = new EReference("property", XReference.class);

	private XPointer object = null;
	private XExpression property = null;

	public XMember() {
		super(Sleman.createEClass(XMember.XCLASSNAME), new EFeature[] {
				XMember.FEATURE_OBJECT,
				XMember.FEATURE_PROPERTY,
		});
	}

	@Override
	public XPointer getObject() {
		return this.object;
	}

	public void setObject(XPointer newObject) {
		SPointer oldObject = this.object;
		this.object = newObject;
		this.eSetNotify(FEATURE_OBJECT, oldObject, newObject);
	}

	@Override
	public XExpression getProperty() {
		return this.property;
	}

	public void setProperty(XExpression newProperty) {
		XExpression oldProperty = this.property;
		this.property = newProperty;
		this.eSetNotify(FEATURE_PROPERTY, oldProperty, newProperty);
	}

	@Override
	public String toLiteral() {
		String literal = "";
		literal += this.object.toString();
		if (this.property instanceof XConstant) {
			literal += "[";
			literal += String.valueOf(this.property);
			literal += "]";
		} else {
			literal += ".";
			literal += String.valueOf(this.property);
		}
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
