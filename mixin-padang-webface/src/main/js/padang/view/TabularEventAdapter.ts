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
import Conductor from "webface/wef/Conductor";

import GridEventAdapter from "padang/grid/GridEventAdapter";

import TabularRowSelectRequest from "padang/requests/TabularRowSelectRequest";
import TabularCellSelectRequest from "padang/requests/TabularCellSelectRequest";
import TabularColumnSelectRequest from "padang/requests/TabularColumnSelectRequest";
import TabularTopOriginChangeRequest from "padang/requests/TabularTopOriginChangeRequest";
import TabularLeftOriginChangeRequest from "padang/requests/TabularLeftOriginChangeRequest";

export default class TabularEventAdapter implements GridEventAdapter {

	private conductor: Conductor = null;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

	public getOnRowSelection(): (row: number) => void {
		return (row: number) => {
			let request = new TabularRowSelectRequest(row);
			this.conductor.submit(request);
		}
	}

	public getOnColumnSelection(): (column: number, label: string) => void {
		return (column: number, label: string) => {
			let request = new TabularColumnSelectRequest(column, label);
			this.conductor.submit(request);
		}
	}

	public getOnCellSelection(): (row: number, column: number, label: string) => void {
		return (row: number, column: number, label: string) => {
			let request = new TabularCellSelectRequest(row, column, label);
			this.conductor.submit(request);
		}
	}

	public getOnTopOriginChanged?(): (top: number) => void {
		return (top: number) => {
			let request = new TabularTopOriginChangeRequest(top);
			this.conductor.submit(request);
		}
	}

	public getOnLeftOriginChanged?(): (left: number) => void {
		return (left: number) => {
			let request = new TabularLeftOriginChangeRequest(left);
			this.conductor.submit(request);
		}
	}

}
