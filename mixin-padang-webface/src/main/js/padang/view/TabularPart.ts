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
import VisageValue from "bekasi/visage/VisageValue";

export default interface TabularPart {

	setLeftOrigin(left: number): void;

	setTopOrigin(top: number): void;

	setSelectedRow(index: number): void;

	setSelectedCell(row: number, column: number): void;

	setSelectedColumn(index: number): void;

	setColumnWidth(name: string, width: number): void;

	setColumnFormat(name: string, format: string): void;

	setLoadingInspection(state: boolean): void;

	setInspectProfile(column: string, profile: VisageValue): void;

	setInspectSelection(column: string, values: Map<string, any>): void;

}