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
import Premix from "malang/directors/premixes/Premix";

export default class PremixRegistry {

	private static instance = new PremixRegistry();

	private premixes = new Map<string, Premix>();

	constructor() {
		if (PremixRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use PremixRegistry.getInstance() instead of new");
		}
		PremixRegistry.instance = this;
	}

	public static getInstance(): PremixRegistry {
		return PremixRegistry.instance;
	}

	public register(name: string, premix: Premix): void {
		this.premixes.set(name, premix);
	}

	public list(): Iterable<Premix> {
		return this.premixes.values();
	}

	public get(name: string): Premix {
		return this.premixes.get(name) || null;
	}

}