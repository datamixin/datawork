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
import XReference from "sleman/model/XReference";

import Transmapper from "malang/directors/transmappers/Transmapper";

export default class TransmapperRegistry {

	private static instance = new TransmapperRegistry();

	private transmappers = new Map<string, Transmapper>();

	constructor() {
		if (TransmapperRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use TransmapperRegistry.getInstance() instead of new");
		}
		TransmapperRegistry.instance = this;
	}

	public static getInstance(): TransmapperRegistry {
		return TransmapperRegistry.instance;
	}

	public register(name: string, transmapper: Transmapper): void {
		this.transmappers.set(name, transmapper);
	}

	public list(): Iterable<Transmapper> {
		return this.transmappers.values();
	}

	public getTransmapper(mutation: XCall): Transmapper {
		let args = mutation.getArguments();
		let reference = <XReference>args.get(0).getExpression();
		let name = reference.getName();
		return this.transmappers.get(name) || null;
	}

}