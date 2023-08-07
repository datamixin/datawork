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

import EncodeColumn from "padang/functions/dataset/EncodeColumn";

import Transmapper from "malang/directors/transmappers/Transmapper";
import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

export default class EncodeColumnTransmapper extends Transmapper {

	public track(_call: XCall, inputs: string[]): string[] {
		return inputs;
	}

	public isEncoder(): boolean {
		return true;
	}

}

let plan = EncodeColumn.getPlan();
let registry = TransmapperRegistry.getInstance();
registry.register(EncodeColumn.FUNCTION_NAME, new EncodeColumnTransmapper(plan));