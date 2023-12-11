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
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XMember from "sleman/model/XMember";
import XExpression from "sleman/model/XExpression";
import SlemanCreator from "sleman/model/SlemanCreator";

import HStack from "padang/functions/list/HStack";
import Reshape from "padang/functions/list/Reshape";

import Learning from "padang/functions/model/Learning";

import CreateDataset from "padang/functions/source/CreateDataset";

import ObjectToTable from "padang/functions/object/ObjectToTable";

import XModeler from "malang/model/XModeler";

import Executor from "malang/directors/executors/Executor";

import InputFeatureReader from "malang/directors/InputFeatureReader";

export default class ModelExpressionMaker {

	private creator: SlemanCreator = null;

	constructor() {
		this.creator = SlemanCreator.eINSTANCE;
	}

	public createModelProperty(property: string): XMember {
		let model = this.creator.createMember(Executor.RESULT, Learning.MODEL);
		return this.creator.createMember(model, property);
	}

	public getInputFeatureNames(model: XModeler): string[] {
		let reader = new InputFeatureReader(model);
		return reader.getInputFeatureNames(Learning.FEATURES);
	}

	public getInputFeatureNameList(model: XModeler): XList {
		let list = this.creator.createList();
		let names = this.getInputFeatureNames(model);
		for (let name of names) {
			this.creator.addTextElement(list, name);
		}
		return list;
	}

	public createReshapeCall(expression: XExpression, ...shape: number[]): XCall {
		let call = this.creator.createCall(Reshape.FUNCTION_NAME, expression);
		let list = this.creator.createList();
		for (let value of shape) {
			this.creator.addNumberElement(list, value);
		}
		this.creator.addArgument(call, list);
		return call;
	}

	public createTextList(...texts: string[]): XList {
		let list = this.creator.createList();
		for (let value of texts) {
			this.creator.addTextElement(list, value);
		}
		return list;
	}

	public addModelPropertyElement(list: XList, property: string): void {
		let element = this.createModelProperty(property);
		this.creator.addElement(list, element);
	}

	public createHStackCall(...expressions: XExpression[]): XCall {
		let list = this.creator.createList();
		for (let expression of expressions) {
			this.creator.addElement(list, expression);
		}
		return this.creator.createCall(HStack.FUNCTION_NAME, list);
	}

	public createDataset(dataset: XExpression): XCall {
		let call = this.creator.createCall(CreateDataset.FUNCTION_NAME, dataset);
		return call;
	}

	public createObjectToTable(object: XExpression): XCall {
		let call = this.creator.createCall(ObjectToTable.FUNCTION_NAME, object);
		return call;
	}

	public createDatasetWithColumnList(dataset: XExpression, columns: XList): XCall {
		let call = this.createDataset(dataset);
		this.creator.addNamedArgument(call, CreateDataset.COLUMNS, columns);
		return call;
	}

	public createDatasetWithColumnNames(dataset: XExpression, columns: string[]): XCall {
		let call = this.createDataset(dataset);
		let list = this.creator.createList();
		for (let column of columns) {
			this.creator.addTextElement(list, column);
		}
		this.creator.addNamedArgument(call, CreateDataset.COLUMNS, list);
		return call;
	}

	public addModelPropertyTextElement(list: XList, property: string): void {
		let elements = list.getElements();
		let member = this.createModelProperty(property);
		elements.add(member);
	}

	public addModelPropertyIndexElement(list: XList, property: string, index: number): void {
		let elements = list.getElements();
		let attribute = this.createModelProperty(property);
		let member = this.creator.createMember(attribute, index);
		elements.add(member);
	}

	public createModelPropertyReshapeCall(attr: string): XCall {
		let classes = this.createModelProperty(attr);
		let reshape = this.createReshapeCall(classes, -1, 1);
		return reshape;
	}
}