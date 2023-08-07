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

export default class RunstackFile extends Lean {

    public static LEAN_NAME = "RunstackFile";

    public static PATH_DELIMITER = "/";

    private fileId: string = null;
    private name: string = null;
    private nameOnly: string = null;
    private extension: string = null;
    private parentId: string = null;
    private untitled: boolean = true;
    private committed: boolean = true;

    constructor(leanName?: string) {
        super(leanName === undefined ? RunstackFile.LEAN_NAME : leanName);
    }

    public getFileId(): string {
        return this.fileId;
    }

    public getName(): string {
        return this.name;
    }

    public getNameOnly(): string {
        return this.nameOnly;
    }

    public getExtension(): string {
        return this.extension;
    }

    public getParentId(): string {
        return this.parentId;
    }

    public isUntitled(): boolean {
        return this.untitled;
    }

    public isCommitted(): boolean {
        return this.committed;
    }

    public setCommitted(committed: boolean): void {
        this.committed = committed;
    }

}

jsonLeanFactory.register(RunstackFile.LEAN_NAME, RunstackFile);