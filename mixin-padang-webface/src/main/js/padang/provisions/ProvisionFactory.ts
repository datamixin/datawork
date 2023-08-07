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
import RowRangeProvision from "padang/provisions/RowRangeProvision";
import RowCountProvision from "padang/provisions/RowCountProvision";

import ColumnKeysProvision from "padang/provisions/ColumnKeysProvision";
import ColumnTypesProvision from "padang/provisions/ColumnTypesProvision";
import ColumnExistsProvision from "padang/provisions/ColumnExistsProvision";

export default class ProvisionFactory {

    private static instance = new ProvisionFactory();

    constructor() {
        if (ProvisionFactory.instance) {
            throw new Error("Error: Instantiation failed: Use ProvisionFactory.getInstance() instead of new");
        }
        ProvisionFactory.instance = this;
    }

    public static getInstance(): ProvisionFactory {
        return ProvisionFactory.instance;
    }

    public createRowCount(): RowCountProvision {
        return new RowCountProvision();
    }

    public createRowRange(rowStart: number, rowEnd: number,
        columnStart: number, columnEnd: number): RowRangeProvision {
        return new RowRangeProvision(rowStart, rowEnd, columnStart, columnEnd);
    }

    public createColumnKeys(): ColumnKeysProvision {
        return new ColumnKeysProvision();
    }

    public createColumnTypes(start: number, end: number): ColumnTypesProvision {
        return new ColumnTypesProvision(start, end);
    }

    public createColumnExists(name: string): ColumnExistsProvision {
        return new ColumnExistsProvision(name);
    }

}
