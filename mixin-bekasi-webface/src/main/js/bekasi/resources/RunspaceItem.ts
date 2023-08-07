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

export default class RunspaceItem extends Lean {

    public static LEAN_NAME = "RunspaceItem";

    public static PATH_DELIMITER = "/";

    private id: string = null;
    private name: string = null;
    private nameOnly: string = null;
    private extension: string = null;
    private parentId: string = null;
    private itemCount: number = 0;
    private file: boolean = true;
    private directory: boolean = false;
    private modified: number = null;

    constructor(leanName?: string) {
        super(leanName === undefined ? RunspaceItem.LEAN_NAME : leanName);
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getExtension(): string {
        return this.extension;
    }

    public getNameOnly(): string {
        return this.nameOnly;
    }

    public getParentId(): string {
        return this.parentId;
    }

    public isFile(): boolean {
        return this.file;
    }

    public isDirectory(): boolean {
        return this.directory;
    }

    public getItemCount(): number {
        return this.itemCount;
    }

    public getModified(): number {
        return this.modified;
    }

}

jsonLeanFactory.register(RunspaceItem.LEAN_NAME, RunspaceItem);