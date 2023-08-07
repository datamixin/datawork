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
import XText from "sleman/model/XText";
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XObject from "sleman/model/XObject";
import XMember from "sleman/model/XMember";
import XNumber from "sleman/model/XNumber";
import XArgument from "sleman/model/XArgument";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import XAssignment from "sleman/model/XAssignment";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class SlemanCreator {

	public static eINSTANCE: SlemanCreator = null;

	public createObject(): XObject {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXObject();
	}

	public createText(value: string): XText {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXText(value);
	}

	public createNumber(value: number): XNumber {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXNumber(value);
	}

	public createReference(name: string): XReference {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXReference(name);
	}

	public createMember(object: string | XExpression, property: string | number): XMember {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXMember(object, property);
	}

	public createList(...expressions: XExpression[]): XList {
		let factory = SlemanFactory.eINSTANCE;
		let list = factory.createXList();
		for (let expression of expressions) {
			list.addElement(expression);
		}
		return list;
	}

	public addTextElement(list: XList, label: string, index?: number): void {
		let text = this.createText(label);
		this.addElement(list, text, index);
	}

	public addNumberElement(list: XList, value: number, index?: number): void {
		let text = this.createNumber(value);
		this.addElement(list, text, index);
	}

	public addElement(list: XList, expression: XExpression, index?: number): void {
		let elements = list.getElements();
		elements.add(expression, index);
	}

	public createCall(name: string, ...args: (XExpression | XArgument)[]): XCall {
		let factory = SlemanFactory.eINSTANCE;
		let call = factory.createXCall(name);
		for (let arg of args) {
			this.addArgument(call, arg);
		}
		return call;
	}

	public addArgument(call: XCall, arg: XArgument | XExpression) {
		let factory = SlemanFactory.eINSTANCE;
		let args = call.getArguments();
		if (arg instanceof XArgument) {
			args.add(arg);
		} else {
			let argument = factory.createXArgument(arg);
			args.add(argument);
		}
	}

	public addNamedArgument(call: XCall, name: string, expression: XExpression) {
		let factory = SlemanFactory.eINSTANCE;
		let args = call.getArguments();
		let argument = factory.createXAssignment(name, expression);
		args.add(argument);
	}

	public addLogicalArgument(call: XCall, arg: boolean) {
		let factory = SlemanFactory.eINSTANCE;
		let logical = factory.createXLogical(arg);
		this.addArgument(call, logical);
	}

	public createAssignment(name: string, expression: XExpression): XAssignment {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXAssignment(name, expression);
	}

	public addField(object: XObject, name: string, expression: XExpression): void {
		let fields = object.getFields();
		let field = this.createAssignment(name, expression);
		fields.add(field);
	}

}

SlemanCreator.eINSTANCE = new SlemanCreator();
