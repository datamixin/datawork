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
import XCall from "sleman/model/XCall";

import SelectColumns from "padang/functions/dataset/SelectColumns";

import Transmapper from "malang/directors/transmappers/Transmapper";
import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

export default class SelectColumnsTransmapper extends Transmapper {

	public track(call: XCall, inputs: string[]): string[] {
		let names = this.getListColumnNames(call, SelectColumns.VALUES_PLAN);
		let outputs: string[] = [];
		for (let name of names) {
			if (inputs.indexOf(name) !== -1) {
				outputs.push(name);
			}
		}
		return outputs;
	}
}

let plan = SelectColumns.getPlan();
let registry = TransmapperRegistry.getInstance();
registry.register(SelectColumns.FUNCTION_NAME, new SelectColumnsTransmapper(plan));