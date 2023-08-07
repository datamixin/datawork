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
import * as functions from "webface/functions";

import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EReference from "webface/model/EReference";
import EPackage from "webface/model/EPackage";
import * as constants from "webface/model/constants";

function getEObjectType(json: any, modelPackage: EPackage): typeof EObject {
    let eClassString = json[constants.ECLASS] || null;
    let namespaces = modelPackage.getNamespaces();
    for (var i = 0; i < namespaces.length; i++) {
        let modelNamespace = namespaces[i];
        let modelName = modelNamespace.name;
        let prefixLength = modelName.length;
        let simpleClassName = eClassString.substring(prefixLength + 1);
        let eClassName = modelName + '://' + simpleClassName;
        let eClass = modelPackage.getEClass(eClassName);
        if (eClass !== null) {
            return eClass;
        }
    }
    throw new Error("Missing " + eClassString + " from namespaces " + namespaces);
}

export function createEObject(json: any, modelPackage: EPackage): EObject {
    let eObjectType: any = getEObjectType(json, modelPackage);
    if (eObjectType !== null) {
        let eObject: EObject = new eObjectType(eObjectType, []);
        buildEObject(eObject, json, modelPackage);
        return eObject;
    } else {
        throw new Error("Fail discover eClass type");
    }
}

export function buildEObject(eObject: EObject, json: any, modelPackage: EPackage): void {

    let features = eObject.eFeatures();
    for (var i = 0; i < features.length; i++) {

        let feature = features[i];
        let featureId = feature.getName();
        let featureValue = eObject[featureId];
        let jsonValue = json[featureId];

        if (featureValue instanceof EList) {

            // EList harus mendahului karena yang di cek di model-nya
            let jsonValue = json[featureId];
            let eList = <EList<any>>featureValue;
            if (jsonValue !== undefined) {
                if (jsonValue instanceof Array) {
                    let list = <any[]>jsonValue;
                    for (var j = 0; j < list.length; j++) {
                        let value: any = list[j];
                        if (functions.isSimple(value)) {
                            eList.add(value);
                        } else {
                            let object = createNestedEObject(value, modelPackage, eObject, <EReference>feature);
                            eList.add(object);
                        }
                    }
                } else {
                    throw new Error("Property " + featureId + " expected array, actually " + jsonValue);
                }
            }

        } else if (featureValue instanceof EMap) {

            // EMap harus mendahului karena yang di cek di model-nya
            let jsonValue = json[featureId];
            let eMap = <EMap<any>>featureValue;
            if (jsonValue !== undefined) {
                if (jsonValue instanceof Object) {

                    // Dibaca dari object mao
                    let keys = Object.keys(jsonValue);
                    for (var j = 0; j < keys.length; j++) {

                        // Ambil key dan value dari setiap entry
                        let key = keys[j];
                        let value = jsonValue[key];
                        if (functions.isSimple(value)) {
                            eMap.put(key, value);
                        } else if (key) {
                            let object = createNestedEObject(value, modelPackage, eObject, <EReference>feature);
                            eMap.put(key, object);
                        }
                    }
                } else {
                    throw new Error("Property " + featureId + " expected array, actually " + jsonValue);
                }
            }

        } else if (functions.isSimple(jsonValue)) {

            // Simple value mendahului object
            eObject[featureId] = jsonValue;

        } else if (functions.isObject(jsonValue)) {

            // Object akan di convert lagi secara recursive
            let nestedObject = createNestedEObject(jsonValue, modelPackage, eObject, <EReference>feature);
            eObject[featureId] = nestedObject;

        } else {

            if (jsonValue !== undefined) {

                // Object tidak di kenali, tatapi ada nilainya.
                throw new Error("Unknown property " + featureId + "=" + jsonValue);
            }
        }
    }
}

function createNestedEObject(json: any, modelPackage: EPackage, container: EObject, reference: EReference): EObject {
    let fullEClass = json[constants.ECLASS] || null;
    let eObject: EObject = null;
    if (fullEClass !== null) {

        // Full eClass ada di json
        eObject = <EObject>createEObject(json, modelPackage);
    } else {

        // eObject di bangun dari reference
        let eObjectType: any = reference.getType();
        eObject = <EObject>new eObjectType();
        buildEObject(eObject, json, modelPackage);
    }
    eObject[constants.CONTAINER] = container;
    eObject[constants.CONTAINING_FEATURE] = reference;
    return eObject;
}
