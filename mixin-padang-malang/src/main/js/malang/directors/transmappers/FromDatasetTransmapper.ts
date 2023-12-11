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
import XCall from "sleman/model/XCall";

import FromDataset from "padang/functions/source/FromDataset";

import Transmapper from "malang/directors/transmappers/Transmapper";
import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

export default class FromDatasetTransmapper extends Transmapper {

	public track(_call: XCall, inputs: string[]): string[] {
		return inputs;
	}

	public getOptionStarted(): number {
		return 0;
	}

}

let plan = FromDataset.getPlan();
let registry = TransmapperRegistry.getInstance();
registry.register(FromDataset.FUNCTION_NAME, new FromDatasetTransmapper(plan));