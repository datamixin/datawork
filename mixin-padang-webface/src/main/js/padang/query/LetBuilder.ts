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
import * as util from "webface/model/util";

import XLet from "sleman/model/XLet";
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XObject from "sleman/model/XObject";
import XMember from "sleman/model/XMember";
import XNumber from "sleman/model/XNumber";
import XLogical from "sleman/model/XLogical";
import XForeach from "sleman/model/XForeach";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import XAssignment from "sleman/model/XAssignment";
import SlemanFactory from "sleman/model/SlemanFactory";
import BinaryBuilder from "sleman/BinaryBuilder";

export default class LetBuilder {

	private factory = SlemanFactory.eINSTANCE;
	private xLet = this.factory.createXLet();

	public setLet(xLet: XLet): void {
		this.xLet = xLet;
	}

	public createCall(pointer: string, args: XExpression[]): XCall {
		let call = this.factory.createXCall(pointer);
		for (let arg of args) {
			this.addExpressionArgument(call, arg);
		}
		return call;
	}

	public addVariable(name: string, expression: XExpression, index?: number): void {
		let variable = this.factory.createXAssignment(name, expression);
		let variables = this.xLet.getVariables();
		variables.add(variable, index);
	}

	public addArgument(call: XCall, expressions: XExpression[]): void {
		for (let expression of expressions) {
			this.addExpressionArgument(call, expression);
		}
	}

	public addExpressionArgument(call: XCall, expression: XExpression): void {
		let args = call.getArguments();
		let arg = this.factory.createXArgument(expression);
		args.add(arg);
	}

	public addAliasArgument(call: XCall, name: string): void {
		let alias = this.factory.createXAlias(name);
		this.addArgument(call, [alias]);
	}

	public addPointerArgument(call: XCall, name: string): void {
		let pointer = this.factory.createXPointer(name);
		this.addArgument(call, [pointer]);
	}

	public addNumberArgument(call: XCall, value: number): void {
		let expression = this.factory.createXNumber(value);
		this.addArgument(call, [expression]);
	}

	public addTextArgument(call: XCall, value: string): void {
		let expression = this.factory.createXText(value);
		this.addArgument(call, [expression]);
	}

	public addLogicalArgument(call: XCall, value: boolean): void {
		let expression = this.factory.createXLogical(value);
		this.addArgument(call, [expression]);
	}

	public getCallArgument(call: XCall, index: number): XCall {
		let args = call.getArguments();
		let arg = args.get(index);
		return <XCall>arg.getExpression();
	}

	public getLogicalArgument(call: XCall, index: number): XLogical {
		let args = call.getArguments();
		let arg = args.get(index);
		return <XLogical>arg.getExpression();
	}

	public addElement(list: XList, expressions: XExpression[]): void {
		let elements = list.getElements();
		for (let expression of expressions) {
			elements.add(expression);
		}
	}

	public addTextElement(list: XList, value: string): void {
		let text = this.factory.createXText(value);
		this.addElement(list, [text]);
	}

	public addPointerElement(list: XList, value: string): void {
		let pointer = this.factory.createXPointer(value);
		this.addElement(list, [pointer]);
	}

	public addObjectElement(list: XList, fields: XAssignment[]): void {
		let object = this.factory.createXObject();
		let elements = object.getFields();
		for (let field of fields) {
			elements.add(field);
		}
		this.addElement(list, [object]);
	}

	public addListArgument(call: XCall): XList {
		let list = this.factory.createXList();
		this.addArgument(call, [list]);
		return list;
	}

	public addObjectArgument(call: XCall): XObject {
		let object = this.factory.createXObject();
		this.addArgument(call, [object]);
		return object;
	}

	public addForeachArgument(call: XCall): XForeach {
		let foreach = this.factory.createXForeach();
		this.addArgument(call, [foreach]);
		return foreach;
	}

	public addCallVariable(variable: string, callee: string, index?: number): XCall {
		let call = this.factory.createXCall(callee);
		this.addVariable(variable, call, index);
		return call;
	}

	public addListField(object: XObject, name: string): XList {
		let assignment = this.createListAssignment(name);
		this.addField(object, [assignment]);
		let list = <XList>assignment.getExpression();
		return list;
	}

	public addField(object: XObject, list: XAssignment[]): void {
		let fields = object.getFields();
		for (let field of list) {
			fields.add(field);
		}
	}

	public getVariable(name: string): XAssignment {
		let variables = this.xLet.getVariables();
		for (let variable of variables) {
			let identifier = variable.getName();
			if (identifier.getName() === name) {
				return variable;
			}
		}
		return null;
	}

	public getVariableCall(name: string): XCall {
		let variable = this.getVariable(name);
		if (variable !== null) {
			return <XCall>variable.getExpression();
		}
		return null;
	}

	public getVariableCallArgument(variable: string, index: number): XExpression {
		let call = <XCall>this.getVariableCall(variable);
		let args = call.getArguments();
		let arg = args.get(index);
		return arg.getExpression();
	}

	public getVariableCallArgumentName(variable: string, index: number): string {
		let expression = this.getVariableCallArgument(variable, index);
		let reference = <XReference>expression;
		return reference.getName();
	}

	public setVariableCallArgumentReferenceName(variable: string, index: number, newName: string): void {
		let reference = <XReference>this.getVariableCallArgument(variable, index);
		reference.setName(newName);
	}

	public setFirstReferenceArgument(call: XCall, value: string): void {
		let args = call.getArguments();
		if (args.size === 0) {
			let dataset = this.factory.createXReference();
			this.addExpressionArgument(call, dataset);
		}
		let arg = args.get(0);
		let reference = <XReference>arg.getExpression();
		reference.setName(value);
	}

	public setFirstNumberArgument(call: XCall, value: number): void {
		let args = call.getArguments();
		let newValue = this.factory.createXNumber(value);
		if (args.size === 0) {
			this.addExpressionArgument(call, newValue);
		} else {
			let arg = args.get(0);
			let expression = arg.getExpression();
			if (expression instanceof XNumber) {
				expression.setValue(value);
			} else {
				util.replace(expression, newValue);
			}
		}
	}

	public createForeach(expression: XExpression): XForeach {
		return this.factory.createXForeach(expression);
	}

	public createObject(fields: XAssignment[]): XObject {
		let object = this.factory.createXObject();
		let elements = object.getFields();
		for (let field of fields) {
			elements.add(field);
		}
		return object;
	}

	public createAssignment(name: string, expression: XExpression): XAssignment {
		return this.factory.createXAssignment(name, expression);
	}

	public createListAssignment(name: string): XAssignment {
		let list = this.factory.createXList();
		return this.factory.createXAssignment(name, list);
	}

	public createTextAssignment(name: string, value: string): XAssignment {
		let text = this.factory.createXText(value);
		return this.factory.createXAssignment(name, text);
	}

	public createLogicalAssignment(name: string, value: boolean): XAssignment {
		let logical = this.factory.createXLogical(value);
		return this.factory.createXAssignment(name, logical);
	}

	public createForeachAssignment(name: string, expression: XExpression): XAssignment {
		let foreach = this.createForeach(expression);
		return this.factory.createXAssignment(name, foreach);
	}

	public createMember(object: string, property: string): XMember {
		return this.factory.createXMember(object, property);
	}

	public createBinaryBuilder(): BinaryBuilder {
		return this.factory.createBinaryBuilder();
	}

	public setCallee(call: XCall, pointer: string): void {
		let callee = this.factory.createXPointer(pointer);
		call.setCallee(callee);
	}

	public setResult(name: string): void {
		let result = this.factory.createXReference(name);
		this.xLet.setResult(result);
	}

	public removeVariable(name: string): void {
		let variable = this.getVariable(name);
		if (variable !== null) {
			let variables = this.xLet.getVariables();
			variables.remove(variable);
		}
	}

	public build(): XLet {
		return this.xLet;
	}

}