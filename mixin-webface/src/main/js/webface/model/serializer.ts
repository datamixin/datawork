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
import Lean from "webface/core/Lean";

import * as functions from "webface/functions";

import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import EReference from "webface/model/EReference";

import * as constants from "webface/model/constants";

export function serializeLean(lean: Lean): string {
	let object = leanToObject(lean);
	return JSON.stringify(object);
}

export function leanToObject(lean: Lean): any {

	let leanObject: any = {};

	let fieldNames = Object.keys(<any>lean);
	for (var i = 0; i < fieldNames.length; i++) {

		let fieldName = fieldNames[i];
		let fieldValue = lean[fieldName];
		leanObject[fieldName] = readValue(fieldValue);

	}

	return leanObject;
}

export function readValue(fieldValue: any): any {

	if (functions.isSimple(fieldValue)) {

		return fieldValue;

	} else if (fieldValue instanceof Lean) {

		let subLean = <Lean>fieldValue;
		let subLeanObject = leanToObject(subLean);
		return subLeanObject;

	} else if (fieldValue instanceof EObject) {

		let eObject = <EObject>fieldValue;
		let eCopy = util.copy(eObject);
		let object = eObjectToObject(eCopy);
		return object;

	} else if (fieldValue instanceof Array) {

		let list: any[] = [];
		let values = <any[]>fieldValue;
		for (var j = 0; j < values.length; j++) {

			let value = values[j];
			let element = readValue(value);
			list.push(element);
		}

		return list;

	} else if (fieldValue instanceof Object) {

		let object: any = {};
		let keys = Object.keys(fieldValue);
		for (var j = 0; j < keys.length; j++) {

			let key = keys[j];
			let value = fieldValue[key];
			let entry = readValue(value);
			object[key] = entry;
		}

		return object;

	}

}

export function serializeEObject(model: EObject): string {

	let eClass = model.eClass();
	let modelPackage = eClass.getEPackage();

	let object: any = {};

	let nsList = [];
	let namespaces = modelPackage.getNamespaces();
	for (var i = 0; i < namespaces.length; i++) {

		let ns = {};
		let nameSpace = namespaces[i];
		ns[constants.PREFIX] = nameSpace.name;
		ns[constants.URI] = nameSpace.uri;
		nsList.push(ns);
	}

	object[constants.NS] = nsList;
	object = $.extend(object, eObjectToObject(model));
	return JSON.stringify(object);
}

export function isWriteEClass(eObject: EObject): boolean {

	let needEClass = false;
	let containingFeature = eObject.eContainingFeature();
	if (functions.isNullOrUndefined(containingFeature)) {

		needEClass = true;

	} else if (containingFeature instanceof EReference) {

		let reference = containingFeature;
		let type = reference.getType();

		let xClassName = type[constants.XCLASSNAME];
		needEClass = functions.isNullOrUndefined(xClassName);
	}
	return needEClass;
}

export function eObjectToObject(eObject: EObject): any {

	let object: any = {};

	let writeEClass = isWriteEClass(eObject);
	if (writeEClass == true) {
		let eClass = eObject.eClass();
		object[constants.ECLASS] = eClass.getAliasName();
	}

	// Looping ke semua feature.
	let features = eObject.eFeatures();
	for (var i = 0; i < features.length; i++) {

		// Property name
		let feature = features[i];
		let featureId = feature.getName();

		// Property value
		let value = eObject[featureId];

		if (value instanceof EList) {

			// Value adalah EList
			let eList = <EList<any>>value;
			let list: any[] = [];
			for (var j = 0; j < eList.size; j++) {
				let element = eList.get(j);
				if (functions.isSimple(element)) {
					list.push(element);
				} else if (element instanceof EObject) {
					list.push(eObjectToObject(<EObject>element));
				}
			}
			object[featureId] = list;

		} else if (value instanceof EMap) {

			// Value adalah EMap
			let eMap = <EMap<any>>value;
			let names = eMap.keySet();

			if (names.length > 0) {

				// Bangun map object
				let map = {};
				for (var j = 0; j < names.length; j++) {
					let key = names[j];
					let value = eMap.get(key);
					if (value instanceof EObject) {
						let entry = eObjectToObject(<EObject>value);
						map[key] = entry;
					} else {
						map[key] = value;
					}
				}

				object[featureId] = map;

			}

		} else if (functions.isSimple(value)) {

			object[featureId] = value;

		} else if (value instanceof EObject) {

			object[featureId] = eObjectToObject(<EObject>value);

		}
	}

	return object;
}
