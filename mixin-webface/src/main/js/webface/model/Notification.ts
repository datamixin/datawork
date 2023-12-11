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
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

export default class Notification {

    // EObject and EMap        
    public static SET = 1;
    public static UNSET = 2;

    // EList        
    public static ADD = 3;
    public static REMOVE = 4;
    public static MOVE = 5;
    public static ADD_MANY = 6;
    public static REMOVE_MANY = 7;
    public static REPLACE_MANY = 8;

    private notifier: EObject;
    private eventType: number;
    private feature: EFeature;
    private oldValue: any;
    private newValue: any;
    private listPosition: number = null;
    private mapKey: string = null;

    constructor(notifier: EObject, eventType: number,
        feature: EFeature, oldValue: any, newValue: any, listPosition?: number, mapKey?: string) {

        this.notifier = notifier;
        this.eventType = eventType;
        this.feature = feature;
        this.oldValue = oldValue;
        this.newValue = newValue;
        if (listPosition !== undefined) {
            this.listPosition = listPosition;
        }
        if (mapKey !== undefined) {
            this.mapKey = mapKey;
        }
    }

    public getNotifier(): EObject {
        return this.notifier;
    }

    public getEventType(): number {
        return this.eventType;
    }

    public getFeature(): EFeature {
        return this.feature;
    }

    public getOldValue(): any {
        return this.oldValue;
    }

    public getNewValue(): any {
        return this.newValue;
    }

    public getListPosition(): number {
        return this.listPosition;
    }

    public getMapKey(): string {
        return this.mapKey;
    }

}
