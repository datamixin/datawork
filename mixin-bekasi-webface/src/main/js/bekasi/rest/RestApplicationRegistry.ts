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
import * as ajax from "webface/core/ajax";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

export default class RestApplicationRegistry {

	private static instance: RestApplicationRegistry = new RestApplicationRegistry();

	private endPoint: string = "../applications";

	constructor() {
		if (RestApplicationRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use RestApplicationRegistry.getInstance() instead of new");
		}
		RestApplicationRegistry.instance = this;
	}

	public static getInstance(): RestApplicationRegistry {
		return RestApplicationRegistry.instance;
	}

	public getScripts(callback: (scripts: { [key: string]: { [key: string]: string } }) => void): void {
		ajax.doGet(this.endPoint + "/scripts", {
		}).done((scripts: { [key: string]: { [key: string]: string } }) => {
			callback(scripts);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Application Scripts");
		});
	}

	public getStyles(callback: (styles: { [key: string]: { [key: string]: string } }) => void): void {
		ajax.doGet(this.endPoint + "/styles", {
		}).done((styles: { [key: string]: { [key: string]: string } }) => {
			callback(styles);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Application Styles");
		});
	}

}

export let engineTypeRegistry = RestApplicationRegistry.getInstance();
