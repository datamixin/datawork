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

export default class NavigatorObject extends Lean {

    public static LEAN_NAME = "NavigatorObject";

    private name: string = null;
    private objectId: any = null;
    private parentId: any = null;
    private group: boolean = false;
    private childCount: number = 0;

    constructor(leanName?: string) {
        super(leanName === undefined ? NavigatorObject.LEAN_NAME : leanName);
    }

    public getName(): string {
        return this.name;
    }

    public getObjectId(): any {
        return this.objectId;
    }

    public getParentId(): any {
        return this.parentId;
    }

    public isGroup(): boolean {
        return this.group;
    }

    public getChildCount(): number {
        return this.childCount;
    }

}

jsonLeanFactory.register(NavigatorObject.LEAN_NAME, NavigatorObject);