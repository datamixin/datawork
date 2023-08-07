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
import EList from "webface/model/EList";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";

import SObject from "sleman/SObject";

import XValue from "sleman/model/XValue";
import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XStructure from "sleman/model/XStructure";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";

export default class XObject extends XStructure implements SObject {

	public static XCLASSNAME: string = model.getEClassName("XObject");

	public static FEATURE_FIELDS = new EReference("fields", XAssignment);

	private fields: EList<XAssignment> = new BasicEList<XAssignment>(this, XObject.FEATURE_FIELDS);

	constructor() {
		super(model.createEClass(XObject.XCLASSNAME), [
			XObject.FEATURE_FIELDS
		]);
	}

	public getFields(): EList<XAssignment> {
		return this.fields;
	}

	public fieldCount(): number {
		return this.fields.size;
	}

	public addField(field: XAssignment): void {
		this.fields.add(field);
	}

	public getField(name: string): XExpression {
		for (let i = 0; i < this.fields.size; i++) {
			let field = this.fields.get(i);
			let identifier = field.getName();
			if (name === identifier.getName()) {
				let expression = field.getExpression();
				return expression;
			}
		}
		return null;
	}

	public print(printer: Printer): void {
		printer.open("{");
		for (let i = 0; i < this.fields.size; i++) {
			let field = this.fields.get(i);
			let identifier = field.getName();
			let name = identifier.getName();
			let expression = field.getExpression();
			printer.entry(this.fields.size - i, name, ":", expression);
		}
		printer.close("}");
	}

	public toValue(): any {
		let object: any = {};
		for (let i = 0; i < this.fields.size; i++) {
			let field = this.fields.get(i);
			let identifier = field.getName();
			let name = identifier.getName();
			let expression = field.getExpression();
			if (expression instanceof XValue) {
				let value = expression.toValue();
				object[name] = value;
			}
		}
		return object;
	}

	public toString(): string {
		return this.toLiteral();
	}
}
