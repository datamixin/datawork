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

import VisageValue from "bekasi/visage/VisageValue";

import ValueMapping from "padang/util/ValueMapping";

import GraphicPremise from "padang/ui/GraphicPremise";

import XViewSpec from "vegazoo/model/XViewSpec";
import XEncoding from "vegazoo/model/XEncoding";
import XFieldDef from "vegazoo/model/XFieldDef";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XObjectDef from "vegazoo/model/XObjectDef";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XNamedData from "vegazoo/model/XNamedData";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";

export abstract class ResultMapping {

	public static DELIMITER = ":";

	protected model: XTopLevelSpec = null;
	protected premise: GraphicPremise = null;
	protected mapping: ValueMapping = null;
	protected datasetColumnFieldMap = new Map<string, Map<string, string>>();
	protected viewFieldListMap = new Map<XObjectDef, XFieldDef[]>();
	protected viewDataNameMap = new Map<XObjectDef, string>();
	protected datumList: XPositionDatumDef[] = [];
	protected modelSpecMap = new Map<EObject, any>();

	constructor(premise: GraphicPremise, model: XTopLevelSpec) {
		this.model = model;
		this.premise = premise;
		this.mapping = premise.getMapping();
		this.prepareViewFieldListMap();
	}

	private prepareViewFieldListMap(): void {

		// Kumpulkan daftar fields per unit/layer
		this.viewFieldListMap = new Map<XObjectDef, XFieldDef[]>();

		if (this.model instanceof XTopLevelUnitSpec) {

			let encoding = this.model.getEncoding();
			this.collectFieldListMap(this.model, encoding);

		} else if (this.model instanceof XTopLevelLayerSpec) {

			let encoding = this.model.getEncoding();
			this.collectFieldListMap(this.model, encoding);

			let items = this.model.getLayer();
			this.collectItemsFieldListMap(items);

		} else if (this.model instanceof XTopLevelFacetSpec) {

			let spec = this.model.getSpec();
			if (spec instanceof XLayerSpec) {

				let items = spec.getLayer();
				this.collectItemsFieldListMap(items);

			} else if (spec instanceof XUnitSpec) {

				let encoding = spec.getEncoding();
				this.collectFieldListMap(this.model, encoding);

			}

			let fieldList = this.getViewFieldList(this.model);
			let facet = this.model.getFacet();
			if (facet instanceof XFacetFieldDef) {
				let field = facet.getField();
				if (field !== null) {
					fieldList.push(facet);
				}
			}

		} else if (this.model instanceof XTopLevelHConcatSpec) {

			let items = this.model.getHconcat();
			this.collectItemsFieldListMap(items);

		} else if (this.model instanceof XTopLevelVConcatSpec) {

			let items = this.model.getVconcat();
			this.collectItemsFieldListMap(items);

		}

		for (let view of this.viewFieldListMap.keys()) {
			this.collectDataNameMap(view);
		}
	}

	private getViewFieldList(view: XObjectDef): XFieldDef[] {

		// Looping ke atas sampai root
		let parent: EObject = view;
		while (parent !== null) {
			let features = parent.eFeatures();
			for (let feature of features) {
				if (feature.getName() === XViewSpec.FEATURE_DATA.getName()) {
					if (parent.eGet(feature) !== null) {

						// Hanya ambil view yang punya data saja
						view = <XObjectDef>parent;
						if (!this.viewFieldListMap.has(view)) {
							this.viewFieldListMap.set(view, []);
						}
						return this.viewFieldListMap.get(view);
					}
				}
			}
			parent = parent.eContainer();
		}
		return null;
	}

	private collectItemsFieldListMap(items: EList<EObject>): void {

		for (let view of items) {
			if (view instanceof XUnitSpec) {

				let encoding = view.getEncoding();
				this.collectFieldListMap(view, encoding);

			} else if (view instanceof XLayerSpec) {

				let encoding = view.getEncoding();
				this.collectFieldListMap(view, encoding);

				let items = view.getLayer();
				this.collectItemsFieldListMap(items);

			} else if (view instanceof XVConcatSpec) {

				let items = view.getVconcat();
				this.collectItemsFieldListMap(items);

			} else if (view instanceof XHConcatSpec) {

				let items = view.getHconcat();
				this.collectItemsFieldListMap(items);

			}
		}
	}

	private collectDataNameMap(view: XObjectDef): void {

		let features = view.eFeatures();
		for (let feature of features) {

			// Ambil data value
			let data = view.eGet(feature);

			// Hanya jika feature adalah named data
			if (data instanceof XNamedData) {

				// Datum
				let name = data.getName();
				if (name !== null) {
					this.viewDataNameMap.set(view, name);
				}

			}

		}
	}

	private collectFieldListMap(view: XObjectDef, encoding: XEncoding): void {

		let fieldList = this.getViewFieldList(view);
		let features = encoding.eFeatures();
		for (let feature of features) {

			// Ambil feature value
			let channel = encoding.eGet(feature);

			// Hanya jika feature adalah field
			if (channel instanceof XPositionDatumDef) {

				// Datum
				let datum = channel.getDatum();
				if (datum !== null) {
					this.datumList.push(channel);
				}

			} else if (channel instanceof XFieldDef) {

				// Field
				let field = channel.getField();
				if (field !== null) {
					fieldList.push(channel);
				}

			}

		}
	}

	public getDatasetColumn(dataset: string, name: string): string {
		if (this.datasetColumnFieldMap.has(dataset)) {
			let columnFieldMap = this.datasetColumnFieldMap.get(dataset);
			for (let column of columnFieldMap.keys()) {
				let field = columnFieldMap.get(column);
				if (field === name) {
					return column;
				}
			}
		}
		return null;
	}

	public abstract getViews(): IterableIterator<XObjectDef>;

	public abstract setModelSpec(model: EObject, spec: any): void;

	public abstract getDataset(unit: XObjectDef): any;

	public abstract getModelSpec(unit: XObjectDef): any;

	public abstract getDatumResult(datum: string): VisageValue;

}

export default ResultMapping;