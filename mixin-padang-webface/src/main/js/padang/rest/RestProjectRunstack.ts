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
import PadangPackage from "padang/model/PadangPackage";

import RestFileRunstack from "bekasi/rest/RestFileRunstack";

export default class RestProjectRunstack extends RestFileRunstack {

	private static instance: RestProjectRunstack = new RestProjectRunstack();

	constructor() {
		super("/projects/runstack");
		if (RestProjectRunstack.instance) {
			throw new Error("Error: Instantiation failed: Use RestProjectRunstack.getInstance() instead of new");
		}
		RestProjectRunstack.instance = this;
	}

	protected getEPackage(): PadangPackage {
		return PadangPackage.eINSTANCE;
	}

	public static getInstance(): RestProjectRunstack {
		return RestProjectRunstack.instance;
	}

}

export let managerStack = RestProjectRunstack.getInstance();
