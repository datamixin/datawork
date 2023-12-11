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
import GraphicPremise from "padang/ui/GraphicPremise";

import Library from "malang/directors/libraries/Library";

export default class LibraryFactory {

	private static instance = new LibraryFactory();

	private types = new Map<string, any>();

	constructor() {
		if (LibraryFactory.instance) {
			throw new Error("Error: Instantiation failed: Use LibraryFactory.getInstance() instead of new");
		}
		LibraryFactory.instance = this;
	}

	public static getInstance(): LibraryFactory {
		return LibraryFactory.instance;
	}

	public create(name: string, premise: GraphicPremise, task: string, settings: Map<string, any>): Library {
		return <Library>(new (this.types.get(name))(premise, task, settings));
	}

	public register(name: string, type: any): void {
		this.types.set(name, type);
	}

}
