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
import EFeature from "webface/model/EFeature";

import Controller from "webface/wef/Controller";
import MapPutCommand from "webface/wef/base/MapPutCommand";
import MapRemoveCommand from "webface/wef/base/MapRemoveCommand";

import XValue from "sleman/model/XValue";

import { expressionFactory } from "sleman/ExpressionFactory";

import * as directors from "padang/directors";

import MultikeyProperties from "padang/util/MultikeyProperties";

export default class ControllerProperties {

    private static KEY_SEPARATOR = ".";

    private controller: Controller = null;
    private properties: EMap<string> = null;

    constructor(controller: Controller, properties: EMap<string> | EFeature) {
        this.controller = controller;
        if (properties instanceof EFeature) {
            this.prepareProperties(properties);
        } else {
            this.properties = properties;
        }
    }

    private prepareProperties(feature: EFeature): void {
        let model = this.controller.getModel();
        this.properties = <EMap<string>>model.eGet(feature);
    }

    private getKey(name: string | string[]): string {
        let key: string = <string>name;
        if (name instanceof Array) {
            key = name.join(ControllerProperties.KEY_SEPARATOR);
        }
        return key;
    }

    public getProperty(name: string | string[], defaultValue?: any): any {
        let key = this.getKey(name);
        if (this.properties.containsKey(key)) {
            let property = this.properties.get(key);
            let director = directors.getExpressionFormulaDirector(this.controller);
            try {
                let value = <XValue>director.parseFormula(property);
                return value.toValue();
            } catch (e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public executePutCommand(name: string | string[], property: any): void {
        let key = this.getKey(name);
        let value = <XValue>expressionFactory.createValue(property);
        let literal = "=" + value.toLiteral();
        let command = new MapPutCommand();
        command.setMap(this.properties);
        command.setKey(key);
        command.setValue(literal);
        this.controller.execute(command);
    }

    public executeRemoveCommand(name: string | string[]): void {
        let key = this.getKey(name);
        let command = new MapRemoveCommand();
        command.setMap(this.properties);
        command.setKey(key);
        this.controller.execute(command);
    }

    public executeRemoveCommandPrefix(name: string | string[]): void {
        let key = this.getKey(name);
        let keys = this.properties.keySet();
        for (let full of keys) {
            if (full.startsWith(key + ControllerProperties.KEY_SEPARATOR)) {
                this.executeRemoveCommand(full);
            }
        }
    }

    public toMultikeyProperties(): MultikeyProperties {
        let properties = new MultikeyProperties();
        let keys = this.properties.keySet();
        for (let key of keys) {
            let property = this.getProperty(key);
            let keys = key.split(ControllerProperties.KEY_SEPARATOR);
            properties.setValue(keys, property);
        }
        return properties;
    }

    public static createKeys(key: string): string[] {
        return key.split(".");
    }

}