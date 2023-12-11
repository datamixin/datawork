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
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EReference from "webface/model/EReference";

import VisageList from "bekasi/visage/VisageList";
import VisageText from "bekasi/visage/VisageText";
import VisageObject from "bekasi/visage/VisageObject";
import VisageConstant from "bekasi/visage/VisageConstant";

import ValueMapping from "padang/util/ValueMapping";

import XRoutine from "rinjani/model/XRoutine";
import RinjaniPackage from "rinjani/model/RinjaniPackage";

export default class ModelConverter {

	public static FONT = "Helvetica Neue";

	public static MARGIN_TOP = 10;
	public static MARGIN_LEFT = 10;
	public static MARGIN_RIGHT = 20;
	public static MARGIN_BOTTOM = 10;

	public static ECLASSNAME = "eClassName";

	private ePackage = RinjaniPackage.eINSTANCE;

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

				let childType = (<EReference>feature).getType();
				let childModel = this.convertValueToModel(value, childType);
				eObject.eSet(feature, childModel);

			} else if (value instanceof VisageList) {

				let eList = <EList<any>>eObject.eGet(feature);
				for (let element of value.getValues()) {

					if (element instanceof VisageObject) {
						let childType = (<EReference>feature).getType();
						let childModel = this.convertValueToModel(element, childType);
						eList.add(childModel);

					} else {

						if (element instanceof VisageConstant) {
							element = element.getValue();
						}
						eList.add(element);

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

			} else if (value instanceof EList) {

				let childList = new VisageList();
				for (let element of value) {

					if (element instanceof EObject) {
						let childObject = this.convertModelToValue(element);
						childList.add(childObject);
					} else {
						childList.add(element);
					}

				}

				object.setField(fieldName, childList);

			} else {

				object.setField(fieldName, value);
			}
		}
		return object;
	}

	public convertModelToSpec(model: XRoutine, mapping: ValueMapping): any {

		let spec = this.convertEObjectToSpec(model, mapping);
		return spec;

	}

	private convertEObjectToSpec(_eObject: EObject, _mapping: ValueMapping): any {

		let object: any = {};
		return object;
	}

}