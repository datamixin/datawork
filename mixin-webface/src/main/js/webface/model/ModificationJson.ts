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
import * as functions from "webface/functions";

import EObject from "webface/model/EObject";
import EPackage from "webface/model/EPackage";
import * as  builder from "webface/model/builder";
import FeatureKey from "webface/model/FeatureKey";
import FeaturePath from "webface/model/FeaturePath";
import Modification from "webface/model/Modification";
import MapFeatureKey from "webface/model/MapFeatureKey";
import ListFeatureKey from "webface/model/ListFeatureKey";

export default class ModificationJson {

    public static FEATURE_PATH = "featurePath";
    public static FEATURE_KEYS = "featureKeys";
    public static EVENT_TYPE = "eventType";
    public static OLD_VALUE = "oldValue";
    public static OLD_VALUE_TYPE = "oldValueType";
    public static NEW_VALUE = "newValue";
    public static NEW_VALUE_TYPE = "newValueType";
    public static POSITION = "position";
    public static KEY = "key";

    public static NAME = "name";
    public static STRING = "string";
    public static NUMBER = "number";
    public static BOOLEAN = "boolean";
    public static OBJECT = "object";

    private modification = new Modification(null);
    private ePackage: EPackage = null;

    constructor(json: any, ePackage: EPackage) {
        this.ePackage = ePackage;
        this.readFeaturePath(json);
        this.readEventType(json);
        this.readOldValue(json);
        this.readNewValue(json);
    }

    private readFeaturePath(json: any): void {
        let pathJson = json[ModificationJson.FEATURE_PATH];
        let arrayJson = pathJson[ModificationJson.FEATURE_KEYS];
        let featureKeys: FeatureKey[] = [];
        for (let i = 0; i < arrayJson.length; i++) {
            let featureKeyJson = arrayJson[i];
            let featureId = featureKeyJson[ModificationJson.NAME];
            let featureKey = new FeatureKey(featureId);
            if (featureKeyJson[ModificationJson.POSITION] !== undefined) {
                let position = featureKeyJson[ModificationJson.POSITION];
                featureKey = new ListFeatureKey(featureId, position);
            } else if (featureKeyJson[ModificationJson.KEY] !== undefined) {
                let key = featureKeyJson[ModificationJson.KEY];
                featureKey = new MapFeatureKey(featureId, key);
            }
            featureKeys.push(featureKey);
        }
        let featurePath = new FeaturePath();
        featurePath.setKeys(featureKeys);
        this.modification[ModificationJson.FEATURE_PATH] = featurePath;
    }

    private readEventType(json: any): void {
        this.modification[ModificationJson.EVENT_TYPE] = json[ModificationJson.EVENT_TYPE];
    }

    private readOldValue(json: any): void {
        let oldValue = json[ModificationJson.OLD_VALUE] || null;
        if (oldValue !== null) {
            let value = this.doDeserialize(oldValue);
            this.modification[ModificationJson.OLD_VALUE] = value;
            this.modification[ModificationJson.OLD_VALUE_TYPE] = typeof oldValue;
        }
    }

    private readNewValue(json: any): void {
        let newValue = json[ModificationJson.NEW_VALUE] || null;
        if (newValue !== null) {
            let value = this.doDeserialize(newValue);
            this.modification[ModificationJson.NEW_VALUE] = value;
            this.modification[ModificationJson.NEW_VALUE_TYPE] = typeof newValue;
        }
    }

    private doDeserialize(json: any): any {
        if (json === null) {
            return null;
        } if (functions.isSimple(json)) {
            return json;
        } else {
            return <EObject>builder.createEObject(json, this.ePackage);
        }
    }

    public getModification(): Modification {
        return this.modification;
    }

}
