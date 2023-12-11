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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";
import VisageConstant from "bekasi/visage/VisageConstant";

export default class VisageRecord extends VisageValue {

    public static LEAN_NAME = "VisageRecord";

    private columns: string[] = [];
    private values: VisageValue[] = [];

    constructor(values?: any[]) {
        super(VisageRecord.LEAN_NAME);
        this.values = values === undefined ? [] : values;
    }

    public getValues(): VisageValue[] {
        return this.values;
    }

    public setValues(values: VisageValue[]) {
        this.values = values;
    }

    public setColumns(columns: string[]) {
        this.columns = columns;
    }

    public getColumns(): string[] {
        return this.columns;
    }

    public size(): number {
        return this.values.length;
    }

    public get(index: number): VisageValue {
        return this.values[index];
    }

    public getValue(index: number): any {
        let value = this.values[index] || null;
        if (value === null) {
            return null;
        } else {
            if (value instanceof VisageConstant) {
                return value.getValue();
            } else {
                return value;
            }
        }
    }

}

jsonLeanFactory.register(VisageRecord.LEAN_NAME, <any>VisageRecord);