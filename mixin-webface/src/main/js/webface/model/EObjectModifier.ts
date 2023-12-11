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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import FeatureKey from "webface/model/FeatureKey";
import Notification from "webface/model/Notification";
import Modification from "webface/model/Modification";
import EObjectVisitor from "webface/model/EObjectVisitor";

export default class EObjectModifier extends EObjectVisitor {

    private modification: Modification = null;

    constructor(modification: Modification) {
        super();
        this.modification = modification;
    }

    public modify(eObject: EObject): void {
        let path = this.modification.getPath();
        let keys = path.getKeys();
        this.traverse(eObject, keys, 0);
    }

    protected complete(eObject: EObject, featureKey: FeatureKey, feature: EFeature, value: any): void {

        let type = this.modification.getType();
        let newValue = this.modification.getNewValue();

        if (value instanceof EMap) {

            let map = this.asEMap(value);
            let mapKey = this.getMapKey(featureKey);
            if (type == Notification.ADD || type == Notification.SET) {
                map.put(mapKey, newValue);
            } else if (type == Notification.REMOVE) {
                map.remove(mapKey);
            } else {
                throw new Error("Map event type " + type + " not supported");
            }

        } else if (value instanceof EList) {

            let list = this.asEList(value);
            let listPosition = this.getListPosition(featureKey);
            if (type == Notification.ADD) {
                list.add(listPosition, newValue);
            } else if (type == Notification.REMOVE) {
                list.remove(listPosition);
            } else if (type == Notification.MOVE) {
                let oldPosition = -1;
                for (let i = 0; i < list.size; i++) {
                    let currentObject = list.get(i);
                    if (newValue instanceof EObject) {
                        let newEObject = <EObject>newValue;
                        if (currentObject instanceof EObject) {
                            let oldEObject = <EObject>currentObject;
                            if (util.isEquals(oldEObject, newEObject)) {
                                oldPosition = i;
                                break;
                            }
                        } else {
                            if (newValue === currentObject) {
                                oldPosition = i;
                                break;
                            }
                        }
                    }
                }
                list.move(listPosition, oldPosition);
            } else if (type == Notification.SET) {
                list.set(listPosition, newValue);
            } else if (type == Notification.REMOVE_MANY) {
                list.clear();
            } else {
                throw new Error("List event type " + type + " not supported");
            }

        } else {

            if (type == Notification.SET) {
                eObject.eSet(feature, newValue);
            } else {
                throw new Error("Event type " + type + " not supported");
            }
        }
    }

}