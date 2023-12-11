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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

import FeaturePath from "webface/model/FeaturePath";
import Notification from "webface/model/Notification";

export default class Modification extends Lean {

    public static LEAN_NAME = "Modification";

    private path: FeaturePath = null;
    private type: number;
    private oldValue: any = null;
    private newValue: any = null;

    constructor(notification: Notification) {
        super(Modification.LEAN_NAME);
        if (notification !== null && notification !== undefined) {
            this.path = new FeaturePath(notification);
            this.type = notification.getEventType();
            this.readOldValue(notification);
            this.readNewValue(notification);
        }
    }

    private readOldValue(notification: Notification): void {
        let oldValue = notification.getOldValue();
        if (oldValue !== null) {
            this.oldValue = oldValue;
        }
    }

    private readNewValue(notification: Notification): void {
        let newValue = notification.getNewValue();
        if (newValue !== null) {
            this.newValue = newValue;
        }
    }

    public getPath(): FeaturePath {
        return this.path;
    }

    public setPath(path: FeaturePath): void {
        this.path = path;
    }

    public getType(): number {
        return this.type;
    }

    public getOldValue(): any {
        return this.oldValue;
    }

    public getNewValue(): any {
        return this.newValue;
    }

}

jsonLeanFactory.register(Modification.LEAN_NAME, <any>Modification);
