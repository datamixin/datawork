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
import FeaturePath from "webface/model/FeaturePath";
import MapFeatureKey from "webface/model/MapFeatureKey";
import ListFeatureKey from "webface/model/ListFeatureKey";
import EObjectVisitor from "webface/model/EObjectVisitor";

export default class EObjectAccessor extends EObjectVisitor {

    private path: FeaturePath = null;
    private target: EObject = null;

    constructor(path: FeaturePath) {
        super();
        this.path = path;
    }

    public access(eObject: EObject): EObject {
        let keys = this.path.getKeys();
        try {
            this.traverse(eObject, keys, 0);
            return this.target;
        } catch (e) {
            return null;
        }
    }

    protected complete(eObject: EObject, featureKey: FeatureKey, feature: EFeature, value: any): void {

        if (featureKey instanceof ListFeatureKey) {

            let position = featureKey.getPosition();
            let list = <EList<EObject>>value;
            this.target = list.get(position);

        } else if (featureKey instanceof MapFeatureKey) {

            let key = featureKey.getKey();
            let map = <EMap<EObject>>value;
            this.target = map.get(key);

        } else {

            this.target = <EObject>value;

        }
    }

}
