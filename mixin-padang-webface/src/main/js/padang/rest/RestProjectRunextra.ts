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
import PadangPackage from "padang/model/PadangPackage";

import RestFileRunextra from "bekasi/rest/RestFileRunextra";

export default class RestProjectRunextra extends RestFileRunextra {

	private static instance: RestProjectRunextra = new RestProjectRunextra();

	constructor() {
		super("/projects/runextra");
		if (RestProjectRunextra.instance) {
			throw new Error("Error: Instantiation failed: Use RestProjectRunextra.getInstance() instead of new");
		}
		RestProjectRunextra.instance = this;
	}

	protected getEPackage(): PadangPackage {
		return PadangPackage.eINSTANCE;
	}

	public static getInstance(): RestProjectRunextra {
		return RestProjectRunextra.instance;
	}

}

export let managerStack = RestProjectRunextra.getInstance();
