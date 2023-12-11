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
import EList from "webface/model/EList";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import SList from "sleman/SList";

import XValue from "sleman/model/XValue";
import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XStructure from "sleman/model/XStructure";
import XExpression from "sleman/model/XExpression";

export default class XList extends XStructure implements SList {

	public static XCLASSNAME: string = model.getEClassName("XList");

	public static FEATURE_ELEMENTS = new EReference("elements", XExpression);

	private elements: EList<XExpression> = new BasicEList<XExpression>(this, XList.FEATURE_ELEMENTS);

	constructor() {
		super(model.createEClass(XList.XCLASSNAME), [
			XList.FEATURE_ELEMENTS
		]);
	}

	public getElements(): EList<XExpression> {
		return this.elements;
	}

	public getElementCount(): number {
		return this.elements.size;
	}

	public getElementAt(index: number): XExpression {
		return this.elements.get(index);
	}

	public addElement(expression: XExpression): void {
		this.elements.add(expression);
	}

	public removeElement(expression: XExpression): void {
		this.elements.remove(expression);
	}

	public print(printer: Printer): void {
		printer.open("[");
		for (let i = 0; i < this.elements.size; i++) {
			let element = this.elements.get(i);
			printer.element(i, this.elements.size - i, element);
		}
		printer.close("]");
	}

	public toValue(): any[] {
		let list: any[] = [];
		for (let i = 0; i < this.elements.size; i++) {
			let element = this.elements.get(i);
			if (element instanceof XValue) {
				let object = element.toValue();
				list.push(object);
			}
		}
		return list;
	}

	public toString(): string {
		return this.toLiteral();
	}

}
