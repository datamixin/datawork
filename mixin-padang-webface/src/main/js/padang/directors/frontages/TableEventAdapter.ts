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
import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";

import GridFrontagePanel from "padang/directors/frontages/GridFrontagePanel";

export default class TableEventAdapter implements GridEventAdapter {

	private conductor: Conductor = null;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

	private submitSetProperty(keys: string[], value: any): void {
		let request = new FacetPropertySetRequest(keys, value);
		this.conductor.submit(request);
	}

	public getOnRowSelection(): (row: number) => void {
		return (row: number) => {
			let value: { [key: string]: any } = {};
			value[GridFrontagePanel.PART] = GridFrontagePanel.ROW;
			value[GridFrontagePanel.ROW] = row;
			this.submitSetProperty([GridFrontagePanel.SELECTION], value);
		}
	}

	public getOnColumnSelection(): (column: number, label: string) => void {
		return (column: number, label: string) => {
			let value: { [key: string]: any } = {};
			value[GridFrontagePanel.PART] = GridFrontagePanel.COLUMN;
			value[GridFrontagePanel.COLUMN] = column;
			value[GridFrontagePanel.LABEL] = label;
			this.submitSetProperty([GridFrontagePanel.SELECTION], value);
		}
	}

	public getOnCellSelection(): (row: number, column: number, label: string) => void {
		return (row: number, column: number, label: string) => {
			let value: { [key: string]: any } = {};
			value[GridFrontagePanel.PART] = GridFrontagePanel.CELL;
			value[GridFrontagePanel.ROW] = row;
			value[GridFrontagePanel.COLUMN] = column;
			value[GridFrontagePanel.LABEL] = label;
			this.submitSetProperty([GridFrontagePanel.SELECTION], value);
		}
	}

}