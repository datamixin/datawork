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
import EMap from "webface/model/EMap";
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import FeatureKey from "webface/model/FeatureKey";
import MapFeatureKey from "webface/model/MapFeatureKey";
import ListFeatureKey from "webface/model/ListFeatureKey";

export abstract class EObjectVisitor {

    protected traverse(eObject: EObject, keys: FeatureKey[], index: number): void {
        let length = keys.length;
        if (index == length) {
            return;
        }
        let featureKey = keys[index];
        let featureId = featureKey.getName();
        let feature = eObject.eFeature(featureId);
        let value = eObject[featureId];

        // Sebelum key terakhir pencarian masih recursive
        if (index < length - 1) {

            if (featureKey instanceof MapFeatureKey) {

                let mapKey = this.getMapKey(featureKey);
                let map = this.asEMap(value);
                let object = map.get(mapKey);
                this.traverseAny(object, keys, index + 1);

            } else if (featureKey instanceof ListFeatureKey) {

                let listPosition = this.getListPosition(featureKey);
                let list = this.asEList(value);
                let object = list.get(listPosition);
                this.traverseAny(object, keys, index + 1);

            } else {

                this.traverseAny(value, keys, index + 1);
            }

        } else {

            // Key terakhir adalah feature yang di-modify
            this.complete(eObject, featureKey, feature, value);
        }
    }

    protected getMapKey(featureKey: FeatureKey): string {
        let mapFeatureKey = <MapFeatureKey>featureKey;
        let mapKey = mapFeatureKey.getKey();
        return mapKey;
    }

    protected getListPosition(featureKey: FeatureKey): number {
        let listFeatureKey = <ListFeatureKey>featureKey;
        let listPosition = listFeatureKey.getPosition();
        return listPosition;
    }

    protected asEMap(value: any): EMap<any> {
        let map = <EMap<any>>value;
        return map;
    }

    protected asEList(value: any): EList<any> {
        let list = <EList<any>>value;
        return list;
    }

    protected traverseAny(object: any, keys: FeatureKey[], index: number): void {
        if (object instanceof EObject) {
            let eObject: any = <EObject>object;
            this.traverse(eObject, keys, index);
        } else {
            throw new Error("Object '" + object + "' not instanceof EObject");
        }
    }

    protected abstract complete(eObject: EObject, featureKey: FeatureKey, feature: EFeature, value: any): void;

}

export default EObjectVisitor;