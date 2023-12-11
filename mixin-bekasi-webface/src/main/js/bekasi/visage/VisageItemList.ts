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

import VisageItem from "bekasi/visage/VisageItem";

export default class VisageItemList extends Lean {

    public static LEAN_NAME = "VisageItemList";

    private id: string = null;
    private entries: VisageItem[] = [];

    constructor(leanName?: string) {
        super(leanName === undefined ? VisageItemList.LEAN_NAME : leanName);
    }

    public getId(): string {
        return this.id;
    }

    public getEntries(): VisageItem[] {
        return this.entries;
    }

}

jsonLeanFactory.register(VisageItemList.LEAN_NAME, VisageItemList);