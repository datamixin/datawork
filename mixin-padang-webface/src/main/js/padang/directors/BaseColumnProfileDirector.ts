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
import Controller from "webface/wef/Controller";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XForeach from "sleman/model/XForeach";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import FormulaParser from "bekasi/FormulaParser";

import VisageType from "bekasi/visage/VisageType";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XTabular from "padang/model/XTabular";

import IsNull from "padang/functions/logical/IsNull";

import TypeName from "padang/functions/system/TypeName";

import ForeachAnd from "padang/query/ForeachAnd";
import QuerySource from "padang/query/QuerySource";
import DatasetQuery from "padang/query/DatasetQuery";
import HistogramQuery from "padang/query/HistogramQuery";
import SummaryBuilder from "padang/query/SummaryBuilder";

import EObject from "webface/model/EObject";

import VisageValue from "bekasi/visage/VisageValue";

import DateTime from "padang/functions/datetime/DateTime";

import ColumnProfileDirector from "padang/directors/ColumnProfileDirector";

import FrequencyDisplayBuilder from "padang/query/FrequencyDisplayBuilder";
import HistogramDisplayBuilder from "padang/query/HistogramDisplayBuilder";
import InspectHistogramDisplayBuilder from "padang/query/InspectHistogramDisplayBuilder";

import FrequencyPropane from "padang/view/present/propane/FrequencyPropane";

export default class BaseColumnProfileDirector implements ColumnProfileDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	public loadProfile(controller: Controller, column: string, type: string,
		display: boolean, label: boolean, ascending: boolean, callback: (result: any) => void): void {

		let source = <QuerySource><any>controller;
		let model = source.getInspectModel();
		if (VisageType.isMetric(type) || VisageType.isTemporal(type)) {

			let query = this.createHistogramQuery(display);
			source.applyFrom(query);
			query.selectColumn(column);
			this.getResult(model, query, callback);


		} else {

			let factory = SlemanFactory.eINSTANCE;
			let itemExpr: XExpression = factory.createXAlias(column);
			if (!VisageType.isCategory(type)) {
				let aliasForIsTypeName = factory.createXAlias(column);
				itemExpr = factory.createXCall(TypeName.FUNCTION_NAME, aliasForIsTypeName);
			}

			let aliasForIsNull = factory.createXAlias(column);
			let isNullCall = factory.createXCall(IsNull.FUNCTION_NAME, aliasForIsNull);
			let builder = factory.createBinaryBuilder();
			builder.setExpression(isNullCall);
			builder.equalsFalse();
			let condition = <XExpression>builder.getExpression();

			let query = this.createFrequencyQuery(display);
			source.applyFrom(query);
			query.selectRows(condition);
			query.selectColumnValue(itemExpr, column);
			query.groupKeys([column]);
			query.groupValueCountAll();
			query.sortRows(label ? column : SummaryBuilder.COUNT_ALL, ascending);
			query.firstRows(FrequencyPropane.LIMIT + 1);
			query.selectNullsValue(column);
			query.selectNullsGroup(column);
			query.createDistinctDataset(column);
			this.getResult(model, query, callback);

		}

	}

	public createConditionFormula(column: string, type: string, values: Map<string, any>): string {

		let foreachAnd = new ForeachAnd();
		let factory = SlemanFactory.eINSTANCE;

		if (values.has(IsNull.FUNCTION_NAME)) {

			let alias = factory.createXAlias(column);
			let call = factory.createXCall(IsNull.FUNCTION_NAME, alias);
			foreachAnd.addCondition(call);

		} else {

			let builder = factory.createBinaryBuilder();
			if (VisageType.isMetric(type) || VisageType.isTemporal(type)) {

				let counter = 0;
				for (let operator of values.keys()) {

					let alias = factory.createXAlias(column);
					let value = values.get(operator);
					let expression: XExpression = factory.createXNumber(value);
					if (VisageType.isTemporal(type)) {
						expression = factory.createXCall(DateTime.FUNCTION_NAME, expression);
					}

					if (counter === 0) {
						builder.setExpression(alias);
						builder.operator(operator, expression);
					} else if (counter === 1) {
						builder.andOperator(alias, operator, expression);
					}

					counter++;
				}

			} else if (VisageType.isCategory(type)) {

				let alias = factory.createXAlias(column);
				builder.setExpression(alias);

				for (let operator of values.keys()) {
					let value = values.get(operator);
					let text = factory.createXText(value);
					builder.operator(operator, text);
				}

			}

			let condition = builder.getExpression();
			foreachAnd.addCondition(condition);

		}

		return foreachAnd.getFormula();
	}

	public readInspectSelections(controller: Controller): Map<string, Map<string, any>> {
		let model = <XTabular>controller.getModel();
		let mutations = model.getMutations();
		if (mutations.size > 0) {
			let mutation = mutations.get(0);
			let parameters = mutation.getOptions();
			if (parameters.size > 0) {
				let parameter = parameters.get(0);
				let formula = parameter.getFormula();
				let parser = new FormulaParser();
				let foreach = <XForeach>parser.parse(formula);
				let foreachAnd = new ForeachAnd(foreach);
				return foreachAnd.getColumnOperatorValues();
			}
		}
		return new Map<string, Map<string, any>>();
	}

	public createFrequencyQuery(display: boolean): FrequencyDisplayBuilder {
		return new FrequencyDisplayBuilder(display);
	}

	public createHistogramQuery(display: boolean): HistogramQuery {
		if (display === true) {
			return new InspectHistogramDisplayBuilder(display);
		} else {
			return new HistogramDisplayBuilder(display);
		}
	}

	public getResult(model: EObject, query: DatasetQuery, callback: (result: any) => void): void {
		let expression = query.buildLet();
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(model, padang.INSPECT_EVALUATE, [expression], (value: VisageValue) => {
			callback(value);
		});
	}

}

