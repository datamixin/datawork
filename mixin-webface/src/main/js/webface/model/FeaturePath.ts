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

import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import FeatureKey from "webface/model/FeatureKey";
import Notification from "webface/model/Notification";
import MapFeatureKey from "webface/model/MapFeatureKey";
import ListFeatureKey from "webface/model/ListFeatureKey";

import { jsonLeanFactory } from "webface/constants";

export default class FeaturePath extends Lean {

    public static LEAN_NAME = "FeaturePath";
    public static SLASH = "/";

    private keys: FeatureKey[] = [];

    constructor(target?: EObject | Notification | FeatureKey[]) {
        super(FeaturePath.LEAN_NAME);

        if (target instanceof EObject) {

            this.generate(target);

        } else if (target instanceof Notification) {

            let notifier = target.getNotifier();
            let feature = target.getFeature();
            let featureId = feature.getName();
            let featureKey = new FeatureKey(featureId);
            let value = notifier[featureId];
            if (value instanceof EList) {
                let listPosition = target.getListPosition();
                featureKey = new ListFeatureKey(featureId, listPosition);
            } else if (value instanceof EMap) {
                let mapKey = target.getMapKey();
                featureKey = new MapFeatureKey(featureId, mapKey);
            }
            this.generate(notifier, featureKey);

        } else if (target instanceof Array) {
            this.keys = target;
        }
    }

    private generate(object: EObject, featureKey?: FeatureKey): void {

        // Key tempat notifikasi terjadi
        let feature: EFeature = null;

        // Otomatis minimal ada satu key terakhir
        if (featureKey !== undefined) {
            this.keys.push(featureKey);
        }
        let container = object.eContainer();

        while (container !== null) {

            feature = object.eContainingFeature();
            let featureId = feature.getName();
            let value = container[featureId];

            if (value instanceof EList) {

                // Untuk feature list
                let list = <EList<any>>value;
                let position = list.indexOf(object);
                featureKey = new ListFeatureKey(featureId, position);
                object = list.eOwner();

            } else if (value instanceof EMap) {

                // Untuk Feature Map
                let map = <EMap<any>>value;
                let keys = map.keySet();
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value = map.get(key);
                    if (value === object) {
                        featureKey = new MapFeatureKey(featureId, key);
                        object = map.eOwner();
                        break;
                    }
                }
                if (featureKey === null) {
                    throw new Error("Fail seek value key while create MapFeatureKey");
                }

            } else {

                // Untuk feature biasa
                featureKey = new FeatureKey(featureId);
                object = object.eContainer();
            }
            container = container.eContainer();
            this.keys.splice(0, 0, featureKey);
        }

    }

    public getKeys(): FeatureKey[] {
        return this.keys;
    }

    public setKeys(keys: FeatureKey[]): void {
        this.keys = keys;
    }

    public toQualified(): string {
        let strings: string[] = [];
        for (let i = 0; i < this.keys.length; i++) {
            strings[i] = this.keys[i].toQualified();
        }
        return strings.join(FeaturePath.SLASH);
    }

    public static fromQualified(qualifiedPath: string): FeaturePath {

        let parts = qualifiedPath.split(FeaturePath.SLASH);
        let keys: FeatureKey[] = [];
        for (let i = 0; i < parts.length; i++) {

            let part = parts[i];
            if (part.indexOf(ListFeatureKey.SEPARATOR) > 0) {

                let hash = part.indexOf(ListFeatureKey.SEPARATOR);
                let name = part.substring(0, hash);
                let indexString = part.substring(hash + 1);
                let position = parseInt(indexString);
                keys[i] = new ListFeatureKey(name, position);

            } else if (part.indexOf(MapFeatureKey.SEPARATOR) > 0) {

                let hash = part.indexOf(MapFeatureKey.SEPARATOR);
                let name = part.substring(0, hash);
                let key = part.substring(hash + 1);
                keys[i] = new MapFeatureKey(name, key);

            } else {

                keys[i] = new FeatureKey(part);

            }
        }
        return new FeaturePath(keys);
    }

    public toString(): string {
        return this.keys.toString();
    }

    public static toQualifiedPath(eObject: EObject): string {
        let path = new FeaturePath(eObject);
        return path.toQualified();
    }

}

jsonLeanFactory.register(FeaturePath.LEAN_NAME, <any>FeaturePath);
