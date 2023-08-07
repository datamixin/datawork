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

import { jsonLeanFactory } from "webface/constants";

import NavigatorObject from "bekasi/navigator/NavigatorObject";

export default class NavigatorObjectList extends Lean {

    public static LEAN_NAME = "NavigatorObjectList";

    private objectId: any = null;
    private children: NavigatorObject[] = [];

    constructor(leanName?: string) {
        super(leanName === undefined ? NavigatorObjectList.LEAN_NAME : leanName);
    }

    public getObjectId(): any {
        return this.objectId;
    }

    public getChildren(): NavigatorObject[] {
        return this.children;
    }

}

jsonLeanFactory.register(NavigatorObjectList.LEAN_NAME, NavigatorObjectList);