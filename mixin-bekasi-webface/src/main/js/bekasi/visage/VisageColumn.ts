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

import VisageColumnMetadata from "bekasi/visage/VisageColumnMetadata";

export default class VisageColumn extends Lean {

    public static LEAN_NAME = "VisageColumn";

    private key: string = null;
    private type: string = null;
    private metadata: VisageColumnMetadata = null;

    constructor(key?: string, type?: string) {
        super(VisageColumn.LEAN_NAME);
        this.setKey(key === undefined ? null : key);
        this.setType(type === undefined ? null : type);
    }

    public getKey(): any {
        return this.key;
    }

    public setKey(key: any): void {
        this.key = key;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public getMetadata(): VisageColumnMetadata {
        return this.metadata;
    }

}

jsonLeanFactory.register(VisageColumn.LEAN_NAME, VisageColumn);