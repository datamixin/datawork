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
import EObject from "webface/model/EObject";

import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageTable from "bekasi/visage/VisageTable";

import * as padang from "padang/padang";

import GraphicPremise from "padang/ui/GraphicPremise";

import * as vegazoo from "vegazoo/vegazoo";

import XUnitSpec from "vegazoo/model/XUnitSpec";
import XNamedData from "vegazoo/model/XNamedData";
import XObjectDef from "vegazoo/model/XObjectDef";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import ResultMapping from "vegazoo/directors/converters/ResultMapping";
import TableConverter from "vegazoo/directors/converters/TableConverter";

export default class ReadoutResultMapping extends ResultMapping {

	private datumResultMap = new Map<string, any>();
	private viewDatasetMap = new Map<any, any>();
	private cautions: VisageValue[] = [];

	constructor(premise: GraphicPremise, model: XTopLevelSpec) {
		super(premise, model);
		this.prepareMap();
	}

	private prepareMap(): void {
		let formulaKeys = this.mapping.getFormulaKeys();
		for (let formulaKey of formulaKeys) {

			let clientField = padang.CLIENT + vegazoo.FIELD;
			let serverDatum = padang.SERVER + vegazoo.DATUM;
			let serverDataset = padang.SERVER + vegazoo.DATASET;

			if (formulaKey.startsWith(serverDataset)) {

				// Unit dataset
				let value = this.mapping.getValue(formulaKey);
				if (value instanceof VisageTable) {
					let dataset = this.convertDataToJsonspec(value);
					let view = this.getView(this.model, formulaKey);
					if (view !== null) {
						this.viewDatasetMap.set(view, dataset);
					}
				} else {
					this.cautions.push(value);
				}

			} else if (formulaKey.startsWith(clientField)) {

				// Field mapping
				let value = this.mapping.getValue(formulaKey);
				if (value instanceof VisageText) {
					let path = formulaKey.split(ResultMapping.DELIMITER);
					let dataset = path[1];
					let column = path[2];
					let field = path[3];
					if (!this.datasetColumnFieldMap.has(dataset)) {
						this.datasetColumnFieldMap.set(dataset, new Map<string, string>());
					}
					let columnFieldMap = this.datasetColumnFieldMap.get(dataset);
					columnFieldMap.set(column, field);
				}

			} else if (formulaKey.startsWith(serverDatum)) {

				// Datum result
				let datum = formulaKey.substring(serverDatum.length);
				let value = this.mapping.getValue(formulaKey);
				this.datumResultMap.set(datum, value);

			}
		}
	}

	private getView(spec: XTopLevelSpec, name: string): XObjectDef {

		if (spec instanceof XTopLevelUnitSpec) {

			let data = <XNamedData>spec.getData();
			if (data.getName() === name) {
				return spec;
			}

		} else if (spec instanceof XTopLevelLayerSpec) {

			let items = spec.getLayer();
			return this.getItemsView(items, name);

		} else if (spec instanceof XTopLevelFacetSpec) {

			let data = <XNamedData>spec.getData();
			if (data.getName() === name) {
				return spec;
			}

		} else if (spec instanceof XTopLevelHConcatSpec) {

			let items = spec.getHconcat();
			return this.getItemsView(items, name);

		} else if (spec instanceof XTopLevelVConcatSpec) {

			let items = spec.getVconcat();
			return this.getItemsView(items, name);

		}
		return null;
	}

	private getItemsView(items: EList<EObject>, name: string): XObjectDef {
		for (let view of items) {
			if (view instanceof XUnitSpec) {
				let data = <XNamedData>view.getData();
				if (data.getName() === name) {
					return view;
				}
			}
		}
		return null;
	}

	private convertDataToJsonspec(table: VisageTable): any {
		let converter = new TableConverter();
		return converter.convertToJsonspec(table);
	}

	public setModelSpec(model: EObject, spec: any): void {
		this.modelSpecMap.set(model, spec);
	}

	public getViews(): IterableIterator<XObjectDef> {
		return this.viewFieldListMap.keys();
	}

	public getDataset(view: XObjectDef): any {
		return this.viewDatasetMap.get(view);
	}

	public getModelSpec(unit: XObjectDef): any {
		return this.modelSpecMap.get(unit);
	}

	public getDatumResult(datum: string): any {
		return this.datumResultMap.get(datum);
	}

	public getViewCount(): number {
		return this.viewDatasetMap.size;
	}

	public getCautions(): VisageValue[] {
		return this.cautions;
	}

}