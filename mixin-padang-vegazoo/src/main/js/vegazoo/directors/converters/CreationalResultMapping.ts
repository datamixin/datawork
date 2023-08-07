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
import EObject from "webface/model/EObject";

import MessageDialog from "webface/dialogs/MessageDialog";

import XText from "sleman/model/XText";
import XCall from "sleman/model/XCall";
import XMember from "sleman/model/XMember";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageType from "bekasi/visage/VisageType";
import VisageBrief from "bekasi/visage/VisageBrief";
import VisageTable from "bekasi/visage/VisageTable";
import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import * as padang from "padang/padang";

import SummaryBuilder from "padang/query/SummaryBuilder";

import * as vegazoo from "vegazoo/vegazoo";

import XFieldDef from "vegazoo/model/XFieldDef";
import XObjectDef from "vegazoo/model/XObjectDef";

import TableConverter from "vegazoo/directors/converters/TableConverter";
import ResultMapping from "vegazoo/directors/converters/ResultMapping";
import ModelConverter from "vegazoo/directors/converters/ModelConverter";

export default class CreationalResultMapping extends ResultMapping {

	private datumResultMap = new Map<string, any>();
	private viewDatasetMap = new Map<any, any>();

	public buildDatasets(fieldBriefMap: Map<XObjectDef, VisageBrief>, callback: (spec: any) => void): void {

		// Build dataset to formula map
		let viewDatasetFormulaMap = new Map<XObjectDef, string>();
		this.datasetColumnFieldMap = new Map<string, Map<string, string>>();
		for (let view of this.viewFieldListMap.keys()) {

			// Ambil daftar dataset per view
			let datasetList: string[] = [];
			let fieldList = this.viewFieldListMap.get(view);
			for (let field of fieldList) {

				let encoded = field.getField();
				let decoded = atob(encoded);
				let expression = this.premise.parse(decoded);
				let addDataset = (member: XMember) => {
					let dataset = member.getObject();
					let datasetName = dataset.toLiteral();
					if (datasetList.indexOf(datasetName) === -1) {
						datasetList.push(datasetName);
					}
				}

				if (fieldBriefMap.has(field)) {

					let brief = fieldBriefMap.get(field);
					let propose = brief.getPropose();
					if (propose === VisageType.COLUMN) {

						let name = vegazoo.getContainingFeatureName(field);
						if (expression instanceof XMember) {

							// Dataset from simple column pointer
							addDataset(expression);
							let columnFieldMap = this.prepareColumnFieldMap(view);
							columnFieldMap.set(name, encoded);

						} else if (expression instanceof XCall) {

							// Dataset from call column pointer
							let args = expression.getArguments();
							let first = args.get(0);
							let argument = first.getExpression();
							if (argument instanceof XMember) {
								addDataset(argument);
								let columnFieldMap = this.prepareColumnFieldMap(view);
								columnFieldMap.set(name, encoded);
							}
						} else {

							throw new Error("Expected expression to be Member or Call");
						}
					}
				}

			}

			if (datasetList.length === 0) {

				// Data sudah siap di setiap view

			} else if (datasetList.length === 1) {

				// Buat summary dataset
				let dataset = datasetList[0];
				let builder = new SummaryBuilder();
				builder.fromDataset(dataset);

				// Column list
				let columns: string[] = [];
				for (let field of fieldList) {

					let factory = SlemanFactory.eINSTANCE;
					if (field instanceof XFieldDef) {

						let name = vegazoo.getContainingFeatureName(field);
						let literal = this.getDecodedField(field);
						let expression = this.premise.parse(literal);
						if (expression instanceof XMember) {

							// Simple select column
							let text = <XText>expression.getProperty();
							let column = text.getValue();
							let alias = factory.createXAlias(column);
							this.selectColumnAlias(builder, columns, alias, name);

							// Set title jika null
							if (field.getTitle() === null) {
								field.setTitle(column);
							}

						} else if (expression instanceof XCall) {

							let args = expression.getArguments();
							let first = args.get(0);
							let argument = first.getExpression();
							if (argument instanceof XMember) {

								// Select call($column) as column
								args.clear();
								let text = <XText>argument.getProperty();
								let column = text.getValue();
								let alias = factory.createXAlias(column);
								let arg = factory.createXArgument(alias);
								args.add(arg);
								this.selectColumnAlias(builder, columns, expression, name);

							}
						}
					}

				}

				// Create formula for each view
				let expression = builder.buildLet();
				let literal = expression.toLiteral();
				viewDatasetFormulaMap.set(view, "=" + literal);

			} else {

				// Hanya support single dataset per view
				throw new Error("Only support single dataset per view");

			}
		}

		// Build spec
		let viewCounter = 0;
		this.viewDatasetMap = new Map<any, any>();
		if (viewDatasetFormulaMap.size === 0) {

			// Tanpa custom user dataset
			this.buildFinalSpec(viewDatasetFormulaMap, callback);

		} else {

			// For each view dataset
			for (let view of viewDatasetFormulaMap.keys()) {

				// Evaluate dataset formula
				let literal = viewDatasetFormulaMap.get(view);
				let expression = this.premise.parse(literal);
				this.premise.evaluate(expression, (data: VisageValue) => {

					if (data instanceof VisageTable) {

						// Convert data
						let converter = new TableConverter();
						let dataset = converter.convertToJsonspec(data);
						this.viewDatasetMap.set(view, dataset);

					} else {
						this.viewDatasetMap.set(view, data);
					}

					// Unit complete
					viewCounter++;
					if (viewCounter === viewDatasetFormulaMap.size) {
						this.buildFinalSpec(viewDatasetFormulaMap, callback);
					}

				});
			}
		}

	}

	private selectColumnAlias(builder: SummaryBuilder, columns: string[], value: XExpression, alias: string): void {
		if (columns.indexOf(alias) === -1) {
			builder.selectColumnValue(value, alias);
			columns.push(alias);
		}
	}

	private prepareColumnFieldMap(view: XObjectDef): Map<string, string> {
		let dataset = this.viewDataNameMap.get(view);
		if (!this.datasetColumnFieldMap.has(dataset)) {
			this.datasetColumnFieldMap.set(dataset, new Map<string, string>());
		}
		return this.datasetColumnFieldMap.get(dataset);
	}

	private buildFinalSpec(viewDatasetFormulaMap: Map<XObjectDef, string>, callback: (spec: any) => void): void {
		if (this.datumList.length === 0) {
			this.buildSpec(viewDatasetFormulaMap, callback);
		} else {
			this.buildDatums(viewDatasetFormulaMap, callback);
		}
	}

	private buildDatums(viewDatasetFormulaMap: Map<XObjectDef, string>, callback: (spec: any) => void): void {

		// Mapping dari datum ke result
		let datumCounter = 0;
		this.datumResultMap = new Map<string, VisageValue>();
		for (let datum of this.datumList) {

			// Baca hasil datum
			let formula = datum.getDatum();
			let decoded = atob(formula);
			let expression = this.premise.parse(decoded);
			this.premise.evaluate(expression, (data: VisageValue) => {

				this.datumResultMap.set(formula, data);

				// Datum complete
				datumCounter++;
				if (datumCounter === this.datumList.length) {
					this.buildSpec(viewDatasetFormulaMap, callback);
				}
			});

		}
	}

	private buildSpec(viewDatasetFormulaMap: Map<XObjectDef, string>, callback: (spec: any) => void): void {

		// Tampilkan error jika ada
		for (let dataset of this.viewDatasetMap.values()) {
			if (dataset instanceof VisageError) {
				let message = dataset.getMessage();
				MessageDialog.openError("Formula Calculation Error", message);
			}
		}

		// Convert model
		this.modelSpecMap = new Map<any, any>();
		let converter = new ModelConverter();
		let spec = converter.convertModelToSpec(this.model, this);

		// Simpan dataset formula
		for (let view of viewDatasetFormulaMap.keys()) {
			let viewSpec = this.modelSpecMap.get(view);
			if (viewSpec[ModelConverter.DATA] !== undefined) {
				let name = viewSpec[ModelConverter.DATA][ModelConverter.NAME]
				if (name === undefined) {
					debugger;
				} else {
					let formula = viewDatasetFormulaMap.get(view);
					this.mapping.setFormula(name, formula);
				}
			}
		}

		// Simpan field sebagai mapping formula baru
		let clientField = padang.CLIENT + vegazoo.FIELD;
		let oldFields = this.getMappingKeys(clientField);
		for (let dataset of this.datasetColumnFieldMap.keys()) {
			let columnFieldMap = this.datasetColumnFieldMap.get(dataset);
			for (let column of columnFieldMap.keys()) {
				let field = columnFieldMap.get(column);
				let path = [clientField, dataset, column, field];
				let name = path.join(ResultMapping.DELIMITER);
				this.mapping.setFormula(name, column);
				let index = oldFields.indexOf(name);
				if (index !== -1) {
					oldFields.splice(index, 1);
				}
			}
		}
		this.deleteMappingKeys(oldFields);

		// Simpang datum sebagai outcome
		for (let datum of this.datumResultMap.keys()) {
			let decoded = atob(datum);
			let name = padang.SERVER + vegazoo.DATUM + datum;
			this.mapping.setFormula(name, decoded);
		}

		callback(spec);
	}

	private getMappingKeys(prefix: string): string[] {
		let keys: string[] = [];
		for (let key of this.mapping.getFormulaKeys()) {
			if (key.startsWith(prefix)) {
				keys.push(key);
			}
		}
		return keys;
	}

	private deleteMappingKeys(keys: string[]): void {
		for (let key of keys) {
			this.mapping.delete(key);
		}
	}

	private getDecodedField(field: XFieldDef): string {
		let encoded = field.getField();
		return atob(encoded);
	}

	public getViews(): IterableIterator<XObjectDef> {
		return this.viewFieldListMap.keys();
	}

	public getFieldList(view: XObjectDef): XFieldDef[] {
		return this.viewFieldListMap.get(view);
	}

	public setModelSpec(model: EObject, spec: any): void {
		this.modelSpecMap.set(model, spec);
	}

	public getDataset(view: XObjectDef): any {
		return this.viewDatasetMap.get(view);
	}

	public getModelSpec(view: XObjectDef): any {
		return this.modelSpecMap.get(view);
	}

	public getDatumResult(datum: string): VisageValue {
		return this.datumResultMap.get(datum);
	}

}