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
import EHolder from "webface/model/EHolder";

// Model util mengikuti EcoreUtil di EMF
export function replace(oldModel: EObject, newModel: EObject): void {

	let container = oldModel.eContainer();
	if (container === null) {
		return;
	}

	let feature = oldModel.eContainingFeature();
	if (feature === null) {
		return;
	}

	let oldFeatureValue = container.eGet(feature);
	if (oldFeatureValue instanceof EList) {

		// Value is multiplicity many using EList
		let list = <EList<any>>oldFeatureValue;
		let oldIndex = list.indexOf(oldModel);
		list.set(oldIndex, newModel);

	} else if (oldFeatureValue instanceof EMap) {

		// Value is map (key -> value) using EMap
		let map = <EMap<any>>oldFeatureValue;
		let keySet = map.keySet();
		for (let i = 0; i < keySet.length; i++) {
			let key = keySet[i];
			let existing = map.get(key);
			if (existing === oldModel) {
				map.put(key, newModel);
				break;
			}
		}

	} else {

		// Replace hanya apabila benar oldModel adalah oldFeatureValue di container
		if (oldModel === oldFeatureValue) {
			container.eSet(feature, newModel);
		}
	}
}

export function remove(model: EObject): void {

	let container = model.eContainer();
	let feature = model.eContainingFeature();
	if (container === null || feature === null) {
		return;
	}

	let containerFeatureValue = container.eGet(feature);
	if (containerFeatureValue instanceof EList) {

		// Value multiplicity many
		let list = <EList<any>>containerFeatureValue;
		list.remove(model);

	} else if (containerFeatureValue instanceof EMap) {

		let map = <EMap<any>>containerFeatureValue;
		map.removeValue(model);

	} else {

		container.eSet(feature, null);
	}
}

export function copy(eObject: EObject): EObject {
	let eClass = eObject.eClass();
	let ePackage = eClass.getEPackage();
	let factory = ePackage.getEFactoryInstance();
	let copy = factory.create(eClass);
	imitate(eObject, copy);
	return copy;
}

function imitate(eObject: EObject, copy: EObject): void {

	let features = eObject.eFeatures();
	for (let i = 0; i < features.length; i++) {

		let feature = features[i];
		let featureId = feature.getName();
		let fieldValue = eObject[featureId];

		if (fieldValue !== null && featureId !== undefined) {

			if (fieldValue instanceof EList) {

				let eList = <EList<any>>fieldValue;
				let copyList = <EList<any>>copy[featureId];

				for (let j = 0; j < eList.size; j++) {
					let value = eList.get(j);
					let copyValue = createCopy(value);
					copyList.add(copyValue);
				}

			} else if (fieldValue instanceof EMap) {

				let eMap = <EMap<any>>fieldValue;
				let copyMap = <EMap<any>>copy[featureId];
				let keys = eMap.keySet();

				for (let j = 0; j < keys.length; j++) {
					let key = keys[j];
					let value = eMap.get(key);
					let copyValue = createCopy(value);
					copyMap.put(key, copyValue);
				}

			} else {

				let copyValue = createCopy(fieldValue);
				copy.eSet(feature, copyValue);
			}

		}
	}
}

function createCopy(value: any): any {
	if (value instanceof EObject) {
		let eObject = <EObject>value;
		return copy(eObject);
	} else {
		return value;
	}
}

export function getIndex(model: EObject): number {
	let feature = model.eContainingFeature();
	let container = model.eContainer();
	if (container) {
		let featureValue = container.eGet(feature);
		if (featureValue instanceof EList) {
			let list = <EList<any>>featureValue;
			return list.indexOf(model);
		}
	}
	return -1;
}

export function getAncestor(model: EObject | EHolder, typeClass: typeof EObject): EObject {

	// Ambil model atau owner-nya.
	let container: EObject = null;
	if (model instanceof EHolder) {
		let list = <EHolder>model;
		container = list.eOwner();
	} else {
		container = <EObject>model;
	}

	// Seek ke atas sampai ketemu typeClass
	while (container !== null && container !== undefined) {
		if (container instanceof typeClass) {
			return container;
		}
		container = (<EObject>container).eContainer();
	}
	return container;
}

export function isAncestor(ancestor: EObject, model: EObject): boolean {
	let container = model;
	while (container !== null && container !== undefined) {
		if (container === ancestor) {
			return true;
		}
		container = container.eContainer();
	}
	return false;
}

export function getRootContainer(model: any): EObject {
	let eObject = getEObject(model);
	while (eObject !== null) {
		let container = eObject.eContainer();
		if (container === null) {
			break;
		}
		eObject = container;
	}
	return eObject;
}

export function getEObject(model: any): EObject {
	let eObject: EObject = null;
	if (model instanceof EObject) {
		eObject = <EObject>model;
	} else if (model instanceof EList) {
		let list = <EList<any>>model;
		eObject = list.eOwner();
	}
	return eObject;
}

export function getDescendants(model: EObject, evaluate: (model: any) => boolean, self?: boolean): EObject[] {
	let models: EObject[] = [];
	discoverDescendants(model, evaluate, models);
	retainSelf(model, evaluate, models, self);
	return models;
}

export function getDescendantsByModelClass(model: EObject, type: any, self?: boolean): EObject[] {
	let models: EObject[] = [];
	let evaluate = (model: any) => {
		return model instanceof type;
	};
	discoverDescendants(model, evaluate, models);
	retainSelf(model, evaluate, models, self);
	return models;
}

function retainSelf(model: EObject, evaluate: (model: any) => boolean, models: EObject[], self?: boolean): void {
	if (self === true) {
		if (evaluate(model) !== true) {
			let index = models.indexOf(model);
			if (index !== -1) {
				models.splice(index, 1);
			}
		}
	}
}

export function discoverDescendants(model: EObject, evaluate: (model: any) => boolean, models: EObject[]): void {

	if (evaluate(model) === true) {
		models.push(model);
	}

	let features = model.eFeatures();
	for (let i = 0; i < features.length; i++) {

		let feature = features[i];
		let value = model.eGet(feature);

		if (value instanceof EObject) {

			discoverDescendants(<EObject>value, evaluate, models);

		} else if (value instanceof EList) {

			let list = <EList<any>>value;
			for (let j = 0; j < list.size; j++) {
				let element = list.get(j);
				if (element instanceof EObject) {
					discoverDescendants(<EObject>element, evaluate, models);
				}
			}

		} else if (value instanceof EMap) {

			let map = <EMap<any>>value;
			let keys = map.keySet();
			for (let j = 0; j < keys.length; j++) {
				let key = keys[j];
				let value = map.get(key);
				if (value instanceof EObject) {
					discoverDescendants(<EObject>value, evaluate, models);
				}
			}
		}
	}

}

export function isEquals(model: EObject, other: EObject): boolean {

	// Salah satu null model tidak sama
	if (model === null || other === null) {
		return model === null && other === null;
	}

	// Beda class beda model
	let modelClass = model.eClass();
	let otherClass = other.eClass();
	let modelName = modelClass.getFullName();
	let otherName = otherClass.getFullName();
	if (modelName !== otherName) {
		return false;
	}

	// Banding setiap feature
	let features = model.eFeatures();
	for (let i = 0; i < features.length; i++) {

		let feature = features[i];
		let modelValue = model.eGet(feature);
		let otherValue = other.eGet(feature);

		if (modelValue === null || otherValue === null) {

			if (!(modelValue === null && otherValue === null)) {
				return false;
			}

		} else {

			if (modelValue instanceof EObject) {

				let modelObject = <EObject>modelValue;
				let otherObject = <EObject>otherValue;
				if (isEquals(modelObject, otherObject) === false) {
					return false;
				}

			} else if (modelValue instanceof EList) {

				let modelList = <EList<any>>modelValue;
				let otherList = <EList<any>>otherValue;
				if (modelList.size !== otherList.size) {
					return false;
				}

				for (let j = 0; j < modelList.size; j++) {

					let modelElement = modelList.get(j);
					let otherElement = otherList.get(j);

					if (modelElement === null || otherElement === null) {
						if (!(modelElement === null && otherElement === null)) {
							return false;
						}
					}

					if (modelElement instanceof EObject) {
						let modelObject = <EObject>modelElement;
						let otherObject = <EObject>otherElement;

						if (isEquals(modelObject, otherObject) === false) {
							return false;
						}

					} else {

						if (modelValue !== otherValue) {
							return false;
						}
					}
				}

			} else if (modelValue instanceof EMap) {

				let modelMap = <EMap<any>>modelValue;
				let otherMap = <EMap<any>>otherValue;

				let modelKeys = modelMap.keySet();
				let otherKeys = otherMap.keySet();
				if (modelKeys.length !== otherKeys.length) {
					return false;
				}

				for (let j = 0; j < modelKeys.length; j++) {

					let modelKey = modelKeys[j];
					let otherKey = otherKeys[j];

					if (modelKey !== otherKey) {
						return false;
					}

					let modelValue = modelMap.get(modelKey);
					let otherValue = otherMap.get(otherKey);

					if (modelValue === null || otherValue === null) {
						if (!(modelValue === null && otherValue === null)) {
							return false;
						}
					}

					if (modelValue instanceof EObject) {
						let modelObject = <EObject>modelValue;
						let otherObject = <EObject>otherValue;

						if (isEquals(modelObject, otherObject) === false) {
							return false;
						}

					} else {

						if (modelValue !== otherValue) {
							return false;
						}
					}
				}
			} else {

				if (modelValue !== otherValue) {
					return false;
				}
			}
		}

	}

	return true;
}
