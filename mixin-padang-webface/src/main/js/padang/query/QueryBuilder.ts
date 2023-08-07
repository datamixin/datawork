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
import XLet from "sleman/model/XLet";
import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XObject from "sleman/model/XObject";
import XMember from "sleman/model/XMember";
import XLogical from "sleman/model/XLogical";
import XForeach from "sleman/model/XForeach";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import BinaryBuilder from "sleman/BinaryBuilder";

import LetBuilder from "padang/query/LetBuilder";
import ForeachAnd from "padang/query/ForeachAnd";

import SelectRows from "padang/functions/dataset/SelectRows";
import FromDataset from "padang/functions/source/FromDataset";
import SelectColumns from "padang/functions/dataset/SelectColumns";

export default class QueryBuilder {

	public static DATASET = "dataset";
	public static ROWS = "rows";
	public static COLUMNS = "columns";
	public static COLUMN_EXPRESSION = "expression";
	public static COLUMN_ALIAS = "alias";

	private builder = new LetBuilder();
	private foreachAnd = new ForeachAnd();

	// ================================================================================
	// Let
	// ================================================================================

	public createCall(pointer: string, args: XExpression[]): XCall {
		return this.builder.createCall(pointer, args);
	}

	public createBinaryBuilder(): BinaryBuilder {
		return this.builder.createBinaryBuilder();
	}

	public createObject(fields: XAssignment[]): XObject {
		return this.builder.createObject(fields);
	}

	public createMember(object: string, property: string): XMember {
		return this.builder.createMember(object, property);
	}

	public setLet(expression: XLet): void {
		this.builder.setLet(expression);
	}

	public addCallVariable(variable: string, callee: string, index?: number): XCall {
		return this.builder.addCallVariable(variable, callee, index);
	}

	public getVariableCall(name: string): XCall {
		return this.builder.getVariableCall(name);
	}

	public getVariableCallArgument(variable: string, index: number): XExpression {
		return this.builder.getVariableCallArgument(variable, index);
	}

	public getCallArgument(call: XCall, index: number): XCall {
		return this.builder.getCallArgument(call, index);
	}

	public getLogicalArgument(call: XCall, index: number): XLogical {
		return this.builder.getLogicalArgument(call, index);
	}

	public setFirstReferenceArgument(call: XCall, value: string): void {
		this.builder.setFirstReferenceArgument(call, value);
	}

	public setFirstNumberArgument(call: XCall, value: number): void {
		this.builder.setFirstNumberArgument(call, value);
	}

	public setCallee(call: XCall, pointer: string): void {
		this.builder.setCallee(call, pointer);
	}

	public addArgument(call: XCall, expressions: XExpression[]): void {
		this.builder.addArgument(call, expressions);
	}

	public addListArgument(call: XCall): XList {
		return this.builder.addListArgument(call);
	}

	public addObjectArgument(call: XCall): XObject {
		return this.builder.addObjectArgument(call);
	}

	public addForeachArgument(call: XCall): XForeach {
		return this.builder.addForeachArgument(call);
	}

	public addAliasArgument(call: XCall, name: string): void {
		this.builder.addAliasArgument(call, name);
	}

	public addTextArgument(call: XCall, value: string): void {
		this.builder.addTextArgument(call, value);
	}

	public addNumberArgument(call: XCall, value: number): void {
		this.builder.addNumberArgument(call, value);
	}

	public addPointerArgument(call: XCall, name: string): void {
		this.builder.addPointerArgument(call, name);
	}

	public addLogicalArgument(call: XCall, value: boolean): void {
		this.builder.addLogicalArgument(call, value);
	}

	public addTextElement(list: XList, value: string): void {
		this.builder.addTextElement(list, value);
	}

	public addPointerElement(list: XList, value: string): void {
		this.builder.addPointerElement(list, value);
	}

	public addObjectElement(list: XList, fields: XAssignment[]): void {
		this.builder.addObjectElement(list, fields);
	}

	public addElement(list: XList, expressions: XExpression[]): void {
		this.builder.addElement(list, expressions);
	}

	public addListField(object: XObject, name: string): XList {
		return this.builder.addListField(object, name);
	}

	public createTextAssignment(name: string, value: string): XAssignment {
		return this.builder.createTextAssignment(name, value);
	}

	public createListAssignment(name: string): XAssignment {
		return this.builder.createListAssignment(name);
	}

	public createForeachAssignment(name: string, expression: XExpression): XAssignment {
		return this.builder.createForeachAssignment(name, expression);
	}

	public createLogicalAssignment(name: string, value: boolean): XAssignment {
		return this.builder.createLogicalAssignment(name, value);
	}

	public setResult(name: string): void {
		this.builder.setResult(name);
	}

	// ================================================================================
	// Query
	// ================================================================================

	public prepareFromRowsColumns(): void {
		this.prepareFromDataset();
		this.prepareSelectRows();
		this.prepareSelectColumns();
		this.setResult(QueryBuilder.COLUMNS);
	}

	private prepareFromDataset(): void {
		this.builder.addCallVariable(QueryBuilder.DATASET, FromDataset.FUNCTION_NAME);
	}

	private prepareSelectRows(): void {
		let call = this.builder.addCallVariable(QueryBuilder.ROWS, SelectRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, QueryBuilder.DATASET);
		let foreach = this.foreachAnd.getForeach();
		this.builder.addArgument(call, [foreach]);
	}

	private prepareSelectColumns(): void {
		let call = this.builder.addCallVariable(QueryBuilder.COLUMNS, SelectColumns.FUNCTION_NAME);
		this.builder.addPointerArgument(call, QueryBuilder.ROWS);
		this.builder.addListArgument(call);
	}

	public fromDataset(name: string): void {
		let call = this.builder.getVariableCall(QueryBuilder.DATASET);
		this.builder.setFirstReferenceArgument(call, name);
	}

	public selectColumn(column: string): void {
		this.addColumn(QueryBuilder.COLUMNS, column)
	}

	public addColumn(variable: string, column: string): void {
		let list = <XList>this.builder.getVariableCallArgument(variable, 1);
		this.builder.addTextElement(list, column);
	}

	public selectColumnValue(value: XExpression, alias: string): void {
		let list = <XList>this.builder.getVariableCallArgument(QueryBuilder.COLUMNS, 1);
		let expression = this.builder.createForeachAssignment(QueryBuilder.COLUMN_EXPRESSION, value);
		let name = this.builder.createTextAssignment(QueryBuilder.COLUMN_ALIAS, alias);
		this.builder.addObjectElement(list, [expression, name]);
	}

	public selectRows(condition: XExpression): void {
		this.foreachAnd.addCondition(condition);
	}

	public confirmEliminateRows(replacement: string): boolean {
		let elements = this.foreachAnd.getElements();
		if (elements.size === 0) {
			let prevName = this.builder.getVariableCallArgumentName(QueryBuilder.ROWS, 0);
			this.builder.removeVariable(QueryBuilder.ROWS);
			this.builder.setVariableCallArgumentReferenceName(replacement, 0, prevName);
			return true;
		}
		return false;
	}

	public build(): XLet {
		return this.builder.build();
	}

}
