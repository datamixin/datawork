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
import EReference from "webface/model/EReference";

import SMember from "sleman/SMember";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XPointer from "sleman/model/XPointer";
import XConstant from "sleman/model/XConstant";
import XExpression from "sleman/model/XExpression";

export default class XMember extends XPointer implements SMember {

	public static XCLASSNAME: string = model.getEClassName("XMember");

	public static FEATURE_OBJECT = new EReference("object", XPointer);
	public static FEATURE_PROPERTY = new EReference("property", XExpression);

	private object: XPointer = null;
	private property: XExpression = null;

	constructor() {
		super(model.createEClass(XMember.XCLASSNAME), [
			XMember.FEATURE_OBJECT,
			XMember.FEATURE_PROPERTY,
		]);
	}

	public getObject(): XPointer {
		return this.object;
	}

	public setObject(newObject: XPointer): void {
		let oldObject = this.object;
		this.object = newObject;
		this.eSetNotify(XMember.FEATURE_OBJECT, oldObject, newObject);
	}

	public getProperty(): XExpression {
		return this.property;
	}

	public setProperty(newProperty: XExpression): void {
		let oldProperty = this.property;
		this.property = newProperty;
		this.eSetNotify(XMember.FEATURE_PROPERTY, oldProperty, newProperty);
	}

	public print(printer: Printer): void {
		printer.part(this.object);
		if (this.property instanceof XConstant) {
			printer.term('[');
			printer.part(this.property);
			printer.term(']');
		} else {
			printer.term('.');
			printer.part(this.property);
		}
	}

	public toString(): string {
		return this.toLiteral();
	}

}
