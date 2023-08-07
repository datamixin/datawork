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
import Map from "webface/util/Map";
import ObjectMap from "webface/util/ObjectMap";

import Lean from "webface/core/Lean";
import LeanFactory from "webface/core/LeanFactory";

import * as functions from "webface/functions";

/**
 * Implementasi LeanFactory dengan menggunakan object json sebagai sumber object.
 * Setiap lean di bedakan dengan nama lean yang harus diberikan saat register.
 * Setiap json yang diberikan saat create harus memiliki property leanName.
 * Factory optinally memiliki parent yang nama lean harus unique di parent-nya.
 */
export default class JsonLeanFactory implements LeanFactory {

    private static LEAN_NAME = "leanName";

    // Mapping dari nama jenis object ke type Lean
    private map = new ObjectMap<typeof Lean>();
    private parent: JsonLeanFactory = null;

    constructor(parent?: JsonLeanFactory) {
        if (parent !== undefined) {
            this.parent = parent;
        }
    }

    public isExists(name: string): boolean {
        if (this.map.containsKey(name)) {
            return true;
        } else {
            if (this.parent !== null) {
                return this.parent.isExists(name);
            } else {
                return false;
            }
        }
    }

    public register(name: string, type: typeof Lean): void {
        if (this.isExists(name) === true) {
            throw new Error("'" + name + "' already exists");
        }
        this.map.put(name, type);
    }

    public create(json: any): Lean {
        let name = json[JsonLeanFactory.LEAN_NAME];
        if (name !== undefined) {
            let lean = this.createByName(name, json);
            return lean;
        } else {
            throw Error("Missing property 'leanName' from given json");
        }
    }

    public createByName(name: string, json: any): Lean {
        if (this.isExists(name) === true) {
            let lean = this.doCreateLean(name, json);
            return lean;
        } else {
            throw Error("Missing Lean for '" + name + "'");
        }
    }

    private getType(name: string): any {
        if (this.map.containsKey(name)) {
            return <any>this.map.get(name);
        } else {
            if (this.parent !== null) {
                return this.parent.getType(name);
            } else {
                return null;
            }
        }
    }

    private doCreateLean(name: string, json: any): Lean {

        let type = this.getType(name);
        let lean = <Lean>new type();

        let fieldNames = Object.keys(json);
        for (let i = 0; i < fieldNames.length; i++) {

            let fieldName = fieldNames[i];
            if (fieldName === JsonLeanFactory.LEAN_NAME) {

                continue;

            } else {

                let fieldValue = lean[fieldName];

                // Field name di json bisa camel case atau dash case
                let jsonValue = json[fieldName];
                if (jsonValue === undefined) {
                    let dashCaseName = this.dashCase(fieldName);
                    jsonValue = json[dashCaseName];
                }

                if (fieldValue instanceof ObjectMap) {

                    // Field di initialize dengan empty map
                    let map = <Map<any>>fieldValue;
                    let keys = Object.keys(jsonValue);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let valueJson = jsonValue[key];
                        if (valueJson instanceof Array) {
                            let array = <any[]>valueJson;
                            for (let j = 0; j < array.length; j++) {
                                let element = array[j];
                                let value = this.doCreateValue(element);
                                array[j] = value;
                            }
                            map.put(key, array);
                        } else {
                            let value = this.doCreateValue(valueJson);
                            map.put(key, value);
                        }
                    }

                    lean[fieldName] = map;

                } else if (fieldValue instanceof Array) {

                    // Field di initialize dengan empty array
                    let jsonArray = <any[]>jsonValue;
                    let fieldArray = <any[]>fieldValue;
                    if (jsonArray === null) {
                        throw new Error("Initial field value for '" + fieldName + "' must be []");
                    }
                    for (let i = 0; i < jsonArray.length; i++) {
                        let valueJson = jsonValue[i];
                        let value = this.doCreateValue(valueJson);
                        fieldArray[i] = value;
                    }

                    lean[fieldName] = fieldArray;

                } else {

                    if (!(jsonValue instanceof Array)) {

                        // Hanya memproses selain array
                        lean[fieldName] = this.doCreateValue(jsonValue);
                    }

                }
            }
        }
        return lean;
    }

    private doCreateValue(json: any): any {
        if (json === null) {
            return null;
        } else if (functions.isObject(json)) {
            return this.create(json);
        } else if (functions.isSimple(json)) {
            return json;
        } else {
            throw Error("Unknown json value for '" + json + "'");
        }
    }

    private dashCase(name: string): string {
        let dashCase = "";
        for (let i = 0; i < name.length; i++) {
            let char = name.charAt(i);
            let code = name.charCodeAt(i);
            if (code > 64 && code < 91) {
                dashCase += "-" + char.toLowerCase();
            } else {
                dashCase += char;
            }
        }
        return dashCase;
    }
}
