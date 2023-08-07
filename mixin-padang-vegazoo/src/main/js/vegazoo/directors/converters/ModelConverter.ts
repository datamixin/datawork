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
import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EReference from "webface/model/EReference";

import * as functions from "webface/functions";

import VisageList from "bekasi/visage/VisageList";
import VisageText from "bekasi/visage/VisageText";
import VisageObject from "bekasi/visage/VisageObject";
import VisageConstant from "bekasi/visage/VisageConstant";

import XData from "vegazoo/model/XData";
import XEncoding from "vegazoo/model/XEncoding";
import XValueDef from "vegazoo/model/XValueDef";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XFieldDef from "vegazoo/model/XFieldDef";
import XViewSpec from "vegazoo/model/XViewSpec";
import XNamedData from "vegazoo/model/XNamedData";
import XObjectDef from "vegazoo/model/XObjectDef";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XInlineData from "vegazoo/model/XInlineData";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XFacetMapping from "vegazoo/model/XFacetMapping";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import VegazooPackage from "vegazoo/model/VegazooPackage";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XSequenceGenerator from "vegazoo/model/XSequenceGenerator";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import * as constants from "vegazoo/constants";

import RuleTemplate from "vegazoo/directors/templates/RuleTemplate";
import TextTemplate from "vegazoo/directors/templates/TextTemplate";

import ResultMapping from "vegazoo/directors/converters/ResultMapping";

import ViewporterRegistry from "vegazoo/directors/viewporters/ViewporterRegistry";

export default class ModelConverter {

	public static USERMETA = "usermeta";
	public static VIEWPORT = "viewport";
	public static SCHEMA = "https://vega.github.io/schema/vega-lite/v5.json";
	public static FONT = "Helvetica Neue";

	public static PADDING_TOP = 10;
	public static PADDING_LEFT = 10;
	public static PADDING_RIGHT = 10;
	public static PADDING_BOTTOM = 10;

	public static ECLASSNAME = "eClassName";
	public static $SCHEMA = "$schema";
	public static TITLE = "title";
	public static DATASETS = "datasets";
	public static DATA = "data";
	public static NAME = "name";
	public static TYPE = "type";
	public static PADDING = "padding";
	public static VALUES = "values";

	private ePackage = VegazooPackage.eINSTANCE;

	public convertValueToModel(object: VisageObject, eObjectType?: typeof EObject): EObject {

		// Override eObject type jika ada eClass
		if (object.containsField(ModelConverter.ECLASSNAME)) {
			let text = <VisageText>object.getField(ModelConverter.ECLASSNAME);
			let eClassName = <string>text.getValue();
			eObjectType = this.ePackage.getEClass(eClassName);
		} else {
			if (eObjectType["XCLASSNAME"] === undefined) {

			}
		}

		// Buat eObject baru
		let eObject = <EObject>(new (<any>eObjectType)());

		let fieldNames = object.fieldNames();
		for (let fieldName of fieldNames) {

			let feature = eObject.eFeature(fieldName);
			if (feature === null) {
				continue;
			}

			let value = object.getField(fieldName);
			if (value === null) {

				continue;

			} else if (value instanceof VisageObject) {


				let eMap = eObject.eGet(feature);
				if (eMap instanceof EMap) {

					for (let key of value.fieldNames()) {
						let field = value.getField(key);
						if (field instanceof VisageObject) {

							let childType = (<EReference>feature).getType();
							let childModel = this.convertValueToModel(field, childType);
							eMap.put(key, childModel);

						} else {

							let childValue = (<VisageConstant>field).getValue();
							eMap.put(key, childValue);

						}
					}

				} else {

					let childType = (<EReference>feature).getType();
					let childModel = this.convertValueToModel(value, childType);
					eObject.eSet(feature, childModel);

				}

			} else if (value instanceof VisageList) {

				let eList = <EList<any>>eObject.eGet(feature);
				for (let element of value.getValues()) {
					if (element instanceof VisageObject) {

						let childType = (<EReference>feature).getType();
						let childModel = this.convertValueToModel(element, childType);
						eList.add(childModel);

					} else {

						let childValue = (<VisageConstant>element).getValue();
						eList.add(childValue);

					}
				}

			} else {

				let childValue = (<VisageConstant>value).getValue();
				eObject.eSet(feature, childValue);

			}
		}
		return eObject;
	}

	public convertModelToValue(eObject: EObject): VisageObject {

		let object = new VisageObject();

		// Create usermeta for abstract class
		let eClass = eObject.eClass();
		let eClassName = eClass.getName();
		let eContainingReference = <EReference>eObject.eContainingFeature();
		if (eContainingReference === null) {

			object.setField(ModelConverter.ECLASSNAME, eClassName);

		} else {

			let eContainingType = eContainingReference.getType();
			let eAssigningType = this.ePackage.getEClass(eClassName);
			if (eContainingType !== eAssigningType) {
				object.setField(ModelConverter.ECLASSNAME, eClassName);
			}
		}

		let features = eObject.eFeatures();
		for (let feature of features) {

			let fieldName = feature.getName();

			let value = eObject.eGet(feature);
			if (value === null) {

				continue;

			} else if (value instanceof EObject) {

				let childObject = this.convertModelToValue(value);
				object.setField(fieldName, childObject);


			} else if (value instanceof EMap) {

				let map = new VisageObject();
				let keySet = value.keySet();
				for (let key of keySet) {

					let field = value.get(key);
					if (field instanceof EObject) {
						let childObject = this.convertModelToValue(field);
						map.setField(key, childObject);
					} else {
						map.setField(key, field);
					}
				}

				object.setField(fieldName, map);

			} else if (value instanceof EList) {

				let list = new VisageList();
				for (let element of value) {

					if (element instanceof EObject) {
						let childObject = this.convertModelToValue(element);
						list.add(childObject);
					} else {
						list.add(element);
					}

				}

				object.setField(fieldName, list);

			} else {

				object.setField(fieldName, value);
			}
		}
		return object;
	}

	public convertModelToSpec(model: XTopLevelSpec, mapping: ResultMapping): any {

		let spec = this.convertEObjectToSpec(model, mapping);
		spec[ModelConverter.$SCHEMA] = ModelConverter.SCHEMA;
		spec[ModelConverter.TITLE] = this.getTitle(model);
		spec[ModelConverter.PADDING] = this.getPadding();
		this.prepareDatasetFields(spec, mapping);
		this.prepareDatums(mapping);
		this.prepareViewport(spec, mapping, model);
		return spec;

	}

	private prepareDatasetFields(spec: any, mapping: ResultMapping): void {

		spec[ModelConverter.DATASETS] = {};
		for (let model of mapping.getViews()) {

			let data: XData = null;

			if (model instanceof XTopLevelUnitSpec || model instanceof XUnitSpec) {

				data = model.getData();

				let encoding = model.getEncoding();
				this.replaceEncodingChannelFieldsToColumn(encoding, mapping);

			} else if (model instanceof XTopLevelLayerSpec || model instanceof XLayerSpec) {

				data = model.getData();

				let encoding = model.getEncoding();
				this.replaceEncodingChannelFieldsToColumn(encoding, mapping);

				let layer = model.getLayer();
				this.replaceItemEncodingChannelFieldToColumn(layer, mapping);

			} else if (model instanceof XTopLevelVConcatSpec || model instanceof XVConcatSpec) {

				let concat = model.getVconcat();
				this.replaceItemEncodingChannelFieldToColumn(concat, mapping);

			} else if (model instanceof XTopLevelHConcatSpec || model instanceof XHConcatSpec) {

				let concat = model.getHconcat();
				this.replaceItemEncodingChannelFieldToColumn(concat, mapping);

			} else if (model instanceof XTopLevelFacetSpec) {

				data = model.getData();
				
				let spec = model.getSpec();
				if (spec instanceof XUnitSpec) {

					let encoding = spec.getEncoding();
					this.replaceEncodingChannelFieldsToColumn(encoding, mapping);

				} else if (spec instanceof XLayerSpec) {

					let layer = spec.getLayer();
					this.replaceItemEncodingChannelFieldToColumn(layer, mapping);

				}

				let facet = model.getFacet();
				if (facet instanceof XFacetFieldDef) {

					this.replaceChannelFieldToColumn(facet, mapping);

				} else if (facet instanceof XFacetMapping) {

					let row = facet.getRow();
					let column = facet.getColumn();
					this.replaceChannelFieldToColumn(row, mapping);
					this.replaceChannelFieldToColumn(column, mapping);

				}

			}

			// Data name
			let name = null;
			if (data instanceof XNamedData) {
				name = data.getName();
			} else {
				continue;
			}

			// Dataset assignment
			let dataset = mapping.getDataset(model);
			spec[ModelConverter.DATASETS][name] = dataset;
			let viewSpec = mapping.getModelSpec(model);
			viewSpec[ModelConverter.DATA] = {};
			viewSpec[ModelConverter.DATA][ModelConverter.NAME] = name

		}
	}

	private replaceItemEncodingChannelFieldToColumn(list: EList<XViewSpec>, mapping: ResultMapping): void {

		for (let view of list) {
			if (view instanceof XUnitSpec) {

				let encoding = view.getEncoding();
				this.replaceEncodingChannelFieldsToColumn(encoding, mapping);

			} else if (view instanceof XLayerSpec) {

				let encoding = view.getEncoding();
				this.replaceEncodingChannelFieldsToColumn(encoding, mapping);
			}
		}
	}

	private prepareDatums(mapping: ResultMapping): void {

		for (let model of mapping.getViews()) {
			if (model instanceof XTopLevelUnitSpec) {

				let encoding = model.getEncoding();
				this.replaceDatumToResult(encoding, mapping);

			} else if (model instanceof XUnitSpec) {

				let encoding = model.getEncoding();
				let datumPortion = this.replaceDatumToResult(encoding, mapping);

				// Rule data values
				if (datumPortion === 1) {
					let mark = model.getMark();
					let type = mark.getType();
					if (type === RuleTemplate.MARK_TYPE || type === TextTemplate.MARK_TYPE) {
						let modelSpec = mapping.getModelSpec(model);
						let dataSpec = modelSpec.data;
						delete dataSpec[ModelConverter.NAME];
						dataSpec[ModelConverter.VALUES] = [{}];
					}
				}
			}
		}
	}

	private replaceEncodingChannelFieldsToColumn(encoding: XObjectDef, mapping: ResultMapping): void {
		let features = encoding.eFeatures();
		for (let feature of features) {
			let channel = encoding.eGet(feature);
			if (channel instanceof XFieldDef) {
				this.replaceChannelFieldToColumn(channel, mapping);
			}
		}
	}

	private replaceChannelFieldToColumn(channel: XFieldDef, mapping: ResultMapping): void {

		// Get nearest dataset
		let dataset: string = null;
		let current: EObject = channel;
		let implicit = false;
		while (current !== null) {
			if (current instanceof XTopLevelSpec || current instanceof XViewSpec) {
				let features = current.eFeatures();
				for (let feature of features) {
					let value = current.eGet(feature);
					if (value instanceof XNamedData) {
						dataset = value.getName();
						break;
					} else if (value instanceof XInlineData || value instanceof XSequenceGenerator) {
						implicit = true;
						break;
					}
				}
			}
			current = current.eContainer();
		}

		let field = channel.getField();
		let spec = mapping.getModelSpec(channel);
		let name = XFieldDef.FEATURE_FIELD.getName();
		if (implicit === true) {
			spec[name] = atob(field);
		} else {
			if (dataset !== null) {
				let column = mapping.getDatasetColumn(dataset, field);
				if (column !== null) {
					spec[name] = column;
				}
			} else {
				throw new Error("Missing dataset for field '" + field + "'");
			}
		}
	}

	private replaceDatumToResult(encoding: XObjectDef, mapping: ResultMapping): number {
		let features = encoding.eFeatures();
		let fieldDefCount = 0;
		let datumDefCount = 0;
		for (let feature of features) {
			let channel = encoding.eGet(feature);
			if (channel instanceof XFieldDef) {

				// Hanya jika feature adalah datum
				if (channel instanceof XPositionDatumDef) {
					let datum = channel.getDatum();
					let value = mapping.getDatumResult(datum);
					if (value instanceof VisageConstant) {
						let spec = mapping.getModelSpec(channel);
						let name = XPositionDatumDef.FEATURE_DATUM.getName();
						let result = value.getValue();
						spec[name] = result;
					}
				}
			}
		}
		return datumDefCount / fieldDefCount;
	}

	private prepareViewport(spec: any, mapping: ResultMapping, viewSpec: XTopLevelSpec): void {
		if (spec[ModelConverter.USERMETA] === undefined) {
			spec[ModelConverter.USERMETA] = {};
		}
		let usermeta = spec[ModelConverter.USERMETA];
		if (usermeta[ModelConverter.VIEWPORT] === undefined) {
			usermeta[ModelConverter.VIEWPORT] = {};
		}
		let viewport = usermeta[ModelConverter.VIEWPORT];
		let registry = ViewporterRegistry.getInstance();
		let eClass = viewSpec.eClass();
		let eClassName = eClass.getName();
		let viewporter = registry.get(eClassName);
		viewporter.adjust(mapping, viewport, viewSpec);
	}

	private getTitle(topLevelViewSpec: XTopLevelSpec): any {
		let title = topLevelViewSpec.getTitle();
		return {
			text: title === null ? "" : title,
			font: ModelConverter.FONT,
			color: "#444",
			fontSize: 14,
		};
	}

	private getPadding(): any {
		return {
			left: ModelConverter.PADDING_LEFT,
			top: ModelConverter.PADDING_TOP,
			right: ModelConverter.PADDING_RIGHT,
			bottom: ModelConverter.PADDING_BOTTOM
		};
	}

	private convertEObjectToSpec(eObject: EObject, mapping: ResultMapping): any {

		let object: any = {};
		mapping.setModelSpec(eObject, object);

		let features = eObject.eFeatures();
		for (let feature of features) {

			let fieldName = feature.getName();

			let value = eObject.eGet(feature);
			if (value === null) {

				continue;

			} else if (value instanceof EObject) {

				let subValue = this.convertObjectToValue(value, mapping);
				if (subValue !== null) {
					let keys = Object.keys(subValue);
					if (functions.isSimple(subValue) || keys.length > 0 || value instanceof XEncoding) {
						object[fieldName] = subValue;
					}
				}

			} else if (value instanceof EMap) {

				let map: { [key: string]: any } = {};
				let keySet = value.keySet();
				for (let key of keySet) {
					let field = value.get(key);
					if (field instanceof EObject) {
						let subValue = this.convertObjectToValue(field, mapping);
						if (subValue !== null) {
							map[key] = subValue;
						}
					} else {
						map[key] = field;
					}

				}

				if (Object.keys(map).length > 0) {
					object[fieldName] = map;
				}

			} else if (value instanceof EList) {

				let list: any[] = [];
				for (let element of value) {

					if (element instanceof EObject) {
						let subValue = this.convertObjectToValue(element, mapping);
						if (subValue !== null) {
							list.push(subValue);
						}
					} else {
						list.push(element);
					}

				}

				if (list.length > 0) {
					object[fieldName] = list;
				}

			} else if (value === constants.NULL) {

				object[fieldName] = null;

			} else if (value === constants.EMPTY) {

				object[fieldName] = [{}];

			} else {

				object[fieldName] = value;

			}

		}

		return object;
	}

	private convertObjectToValue(value: EObject, mapping: ResultMapping): any {
		if (value instanceof XValueDef) {
			value = value.getValue();
			if (!(value instanceof EObject)) {
				return value;
			}
		}
		return this.convertEObjectToSpec(value, mapping);
	}

}