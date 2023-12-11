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

export default class VisageItem extends Lean {

    public static LEAN_NAME = "VisageItem";

    private id: string = null;
    private name: string = null;
    private parentId: string = null;
    private itemCount: number = 0;
    private group: boolean = false;

    constructor(leanName?: string) {
        super(leanName === undefined ? VisageItem.LEAN_NAME : leanName);
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getParentId(): string {
        return this.parentId;
    }

    public setParentId(parentId: string): void {
        this.parentId = parentId;
    }

    public isGroup(): boolean {
        return this.group;
    }

    public setGroup(group: boolean): void {
        this.group = group;
    }

    public getItemCount(): number {
        return this.itemCount;
    }

}

jsonLeanFactory.register(VisageItem.LEAN_NAME, VisageItem);