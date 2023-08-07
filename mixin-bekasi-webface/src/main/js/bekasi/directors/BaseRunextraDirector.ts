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
import EObject from "webface/model/EObject";

import RestFileRunextra from "bekasi/rest/RestFileRunextra";

import RunextraDirector from "bekasi/directors/RunextraDirector";

export default class BaseRunextraDirector implements RunextraDirector {

	private runextra: RestFileRunextra = null;

	constructor(runextra: RestFileRunextra) {
		this.runextra = runextra;
	}

	public getNames(group: string, callback: (names: string[]) => void): void {
		return this.runextra.getNames(group, callback);
	}

	public getNamesByType(group: string, type: string, callback: (names: string[]) => void): void {
		return this.runextra.getNamesByType(group, type, callback);
	}

	public save(group: string, name: string, model: EObject, callback: (message: string) => void): void {
		return this.runextra.save(group, name, model, callback);
	}

	public load(group: string, name: string): Promise<EObject> {
		return this.runextra.load(group, name);
	}

	public remove(group: string, name: string, callback: () => void): void {
		return this.runextra.remove(group, name, callback);
	}

}