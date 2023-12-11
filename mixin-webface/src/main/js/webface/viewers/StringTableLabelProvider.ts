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
import TableLabelProvider from "webface/viewers/TableLabelProvider";

export default class StringTableLabelProvider implements TableLabelProvider {

    public getColumnCount(input: any): number {
        return 1;
    }

    public getColumnTitle(input: any, columnIndex: number): string {
        return "Column";
    }

    public getColumnText(element: any, columnIndex: number): string {
        return element + "";
    }

}
