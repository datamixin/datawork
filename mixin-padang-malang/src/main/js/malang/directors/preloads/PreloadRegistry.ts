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
import Preload from "malang/directors/preloads/Preload";

export default class PreloadRegistry {

	private static instance = new PreloadRegistry();

	private preloads = new Map<string, Preload>();

	constructor() {
		if (PreloadRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use PreloadRegistry.getInstance() instead of new");
		}
		PreloadRegistry.instance = this;
	}

	public static getInstance(): PreloadRegistry {
		return PreloadRegistry.instance;
	}

	public register(preload: Preload): void {
		let name = preload.getQualifiedName();
		this.preloads.set(name, preload);
	}

	public list(): Iterable<Preload> {
		return this.preloads.values();
	}

	public get(name: string): Preload {
		return this.preloads.get(name) || null;
	}

}