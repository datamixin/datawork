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
import TableMarkerPane from "webface/viewers/TableMarkerPane";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableColumnMaker from "webface/viewers/TableColumnMaker";
import TableColumnTitlePane from "webface/viewers/TableColumnTitlePane";
import TableMarkerTitlePane from "webface/viewers/TableMarkerTitlePane";

export interface TableLabelProvider {

    getColumnCount(input: any): number;

    getColumnTitle(input: any, columnIndex: number): string;

    getColumnText(element: any, columnIndex: number): string;

    getColumnTitlePane?(input: any, columnIndex: number): TableColumnTitlePane;

    getColumnWidth?(input: any, columnIndex: number): TableColumnWidth;

    getColumnMaker?(element: any, columnIndex: number): TableColumnMaker;

    getMarkerPane?(): TableMarkerPane;

    getMarkerTitlePane?(): TableMarkerTitlePane;

    getMarkerWidth?(): number;

    isValidValue?(input: any, row: number, column: number): boolean;

    commitChanged?(row: number, column: number, oldText: string, newText: string): void;

}

export default TableLabelProvider;