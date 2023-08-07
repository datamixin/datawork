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
import XObject from "sleman/model/XObject";
import XNumber from "sleman/model/XNumber";
import XExpression from "sleman/model/XExpression";

import * as padang from "padang/padang";

import QueryBuilder from "padang/query/QueryBuilder";

import If from "padang/functions/logical/If";
import IsNull from "padang/functions/logical/IsNull";

import SortRows from "padang/functions/dataset/SortRows";
import RowCount from "padang/functions/dataset/RowCount";
import FirstRows from "padang/functions/dataset/FirstRows";
import GroupRows from "padang/functions/dataset/GroupRows";
import UnionRows from "padang/functions/dataset/UnionRows";
import SelectColumns from "padang/functions/dataset/SelectColumns";

import CreateDataset from "padang/functions/source/CreateDataset";

export default class SummaryBuilder {

	public static GROUP = "group";
	public static SORT = "sort";
	public static FIRST = "first";
	public static NULLS_VALUE = "nullsValue";
	public static NULLS_GROUP = "nullsGroup";
	public static DISTINCT_COUNT = "distinctCount";
	public static DISTINCT_DATASET = "distinctDataset";
	public static UNION = "union";

	public static COLUMN = "column";
	public static CONTAINS = "Contains";
	public static COUNT_ALL = "CountAll";

	public static AGGREGATE_SUM = "Sum";
	public static AGGREGATE_MIN = "Min";
	public static AGGREGATE_MAX = "Max";
	public static AGGREGATE_AVERAGE = "Average";

	private static GROUP_ALIAS = "alias";
	private static GROUP_AGGREGATE = "aggregate";

	private static ORDER_COLUMN = "column";
	private static ORDER_ASCENDING = "ascending";

	private builder: QueryBuilder = null;

	constructor(builder?: QueryBuilder) {
		if (builder === undefined) {
			this.builder = new QueryBuilder();
			this.builder.prepareFromRowsColumns();
		} else {
			this.builder = builder;
		}
	}

	public prepareGroupRows(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.GROUP, GroupRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, QueryBuilder.COLUMNS);
		this.builder.addListArgument(call);
		this.builder.addListArgument(call);
	}

	public prepareSortRows(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.SORT, SortRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, SummaryBuilder.GROUP);
		this.builder.addListArgument(call);
	}

	public prepareFirstRows(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.FIRST, FirstRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, SummaryBuilder.SORT);
		this.builder.addNumberArgument(call, -1);
	}

	public prepareNullsValue(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.NULLS_VALUE, SelectColumns.FUNCTION_NAME);
		this.builder.addPointerArgument(call, QueryBuilder.DATASET);
		this.builder.addListArgument(call);
	}

	public prepareNullsGroup(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.NULLS_GROUP, GroupRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, SummaryBuilder.NULLS_VALUE);
		this.builder.addListArgument(call);
		let list = this.builder.addListArgument(call);
		let value = this.createGroupValue(
			SummaryBuilder.COUNT_ALL,
			SummaryBuilder.COUNT_ALL
		);
		this.builder.addElement(list, [value]);
	}

	public prepareDistinctCount(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.DISTINCT_COUNT, RowCount.FUNCTION_NAME);
		this.builder.addPointerArgument(call, SummaryBuilder.SORT);
	}

	public prepareDistinctDataset(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.DISTINCT_DATASET, CreateDataset.FUNCTION_NAME);
		let object = this.builder.addObjectArgument(call);
		let itemList = this.builder.addListField(object, SummaryBuilder.COLUMN);
		this.builder.addTextElement(itemList, padang.DISTINCTS_FLAG);
		let valueList = this.builder.addListField(object, SummaryBuilder.COUNT_ALL);
		this.builder.addPointerElement(valueList, SummaryBuilder.DISTINCT_COUNT);
	}

	public prepareUnionRows(): void {
		let call = this.builder.addCallVariable(SummaryBuilder.UNION, UnionRows.FUNCTION_NAME);
		this.builder.addPointerArgument(call, SummaryBuilder.NULLS_GROUP);
		let others = <XList>this.builder.addListArgument(call);
		this.builder.addPointerElement(others, SummaryBuilder.DISTINCT_DATASET);
		this.builder.addPointerElement(others, SummaryBuilder.FIRST);
	}

	public fromDataset(name: string): void {
		this.builder.fromDataset(name);
	}

	public selectRows(condition: XExpression): void {
		this.builder.selectRows(condition);
	}

	public selectColumn(column: string): void {
		return this.builder.selectColumn(column);
	}

	public selectColumnValue(value: XExpression, alias: string): void {
		return this.builder.selectColumnValue(value, alias);
	}

	public groupKeys(keys: string[]): void {
		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.GROUP, 1);
		for (let key of keys) {
			this.builder.addTextElement(list, key)
		}
	}

	public groupValue(column: any, aggregate: string): void {
		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.GROUP, 2);
		let elements = list.getElements();
		let value = this.createGroupValue(column, aggregate, column);
		elements.add(value);
	}

	public groupValueCountAll(): void {
		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.GROUP, 2);
		let value = this.createGroupValue(
			SummaryBuilder.COUNT_ALL,
			SummaryBuilder.COUNT_ALL
		);
		this.builder.addElement(list, [value]);
	}

	private createGroupValue(column: string, aggregate: string, arg?: string): XObject {
		let call = this.builder.createCall(aggregate, []);
		if (arg !== undefined) {
			this.builder.addAliasArgument(call, arg);
		}
		return this.builder.createObject([
			this.builder.createTextAssignment(SummaryBuilder.GROUP_ALIAS, column),
			this.builder.createForeachAssignment(SummaryBuilder.GROUP_AGGREGATE, call)
		]);
	}

	public sortRows(column: string, ascending?: boolean): void {

		ascending = ascending === undefined ? true : ascending;
		let order = this.builder.createObject([
			this.builder.createTextAssignment(SummaryBuilder.ORDER_COLUMN, column),
			this.builder.createLogicalAssignment(SummaryBuilder.ORDER_ASCENDING, ascending)
		]);

		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.SORT, 1);
		this.builder.addElement(list, [order]);
	}

	public firstRows(count: number): void {
		let value = <XNumber>this.builder.getVariableCallArgument(SummaryBuilder.FIRST, 1);
		value.setValue(count);
	}

	public selectNullsValue(column: string): void {

		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.NULLS_VALUE, 1);

		let ifCall = this.builder.createCall(If.FUNCTION_NAME, []);
		let isNull = this.builder.createCall(IsNull.FUNCTION_NAME, []);
		this.builder.addAliasArgument(isNull, column);
		this.builder.addArgument(ifCall, [isNull]);
		this.builder.addTextArgument(ifCall, padang.NULL_FLAG);
		this.builder.addTextArgument(ifCall, padang.EXISTS_FLAG);
		let foreach = this.builder.createForeachAssignment(QueryBuilder.COLUMN_EXPRESSION, ifCall);

		let name = this.builder.createTextAssignment(QueryBuilder.COLUMN_ALIAS, column);
		this.builder.addObjectElement(list, [foreach, name]);

	}

	public selectNullsGroup(column: string): void {
		let list = <XList>this.builder.getVariableCallArgument(SummaryBuilder.NULLS_GROUP, 1);
		this.builder.addTextElement(list, column);
	}

	public createDistinctDataset(column: string): void {
		let object = <XObject>this.builder.getVariableCallArgument(SummaryBuilder.DISTINCT_DATASET, 0);
		for (let field of object.getFields()) {
			let identifier = field.getName();
			if (identifier.getName() === SummaryBuilder.COLUMN) {
				identifier.setName(column);
				break;
			}
		}
	}

	public setResult(name: string): void {
		this.builder.setResult(name);
	}

	public toLiteral(): string {
		let expression = this.buildLet();
		return expression.toLiteral();
	}

	public buildLet(): XLet {
		this.builder.confirmEliminateRows(QueryBuilder.COLUMNS);
		return this.builder.build();
	}

}
