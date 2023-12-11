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
import * as ajax from "webface/core/ajax";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

export default class RestSystemWorkspace {

	public static WORKSPACE: string = "../workspace";

	private static instance: RestSystemWorkspace = new RestSystemWorkspace();

	constructor() {
		if (RestSystemWorkspace.instance) {
			throw new Error("Error: Instantiation failed: Use RestSystemWorkspace.getInstance() instead of new");
		}
		RestSystemWorkspace.instance = this;
	}

	public static getInstance(): RestSystemWorkspace {
		return RestSystemWorkspace.instance;
	}

	public getPreference(key: string, callback: (value: string) => void): void {
		ajax.doGet(RestSystemWorkspace.WORKSPACE + "/preferences/" + key, {
		}).done((value: any) => {
			callback(value);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Preference Value");
		});
	}

	public setPreference(key: string, value: any, callback?: () => void): void {
		ajax.doPut(RestSystemWorkspace.WORKSPACE + "/preferences/" + key, {
			value: JSON.stringify(value),
		}).done(() => {
			if (callback !== undefined) {
				callback();
			}
		}).fail((error) => {
			DetailMessageDialog.open(error, "Set Preference Value");
		});
	}

	public getEncrypt(text: string, callback: (text: string) => void): void {
		ajax.doGet(RestSystemWorkspace.WORKSPACE + "/encryption/encrypt", {
			text: text,
		}).done((result: string) => {
			callback(result);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Encryption Text");
		});
	}

	public getDecrypt(text: string, callback: (text: string) => void): void {
		ajax.doGet(RestSystemWorkspace.WORKSPACE + "/encryption/decrypt", {
			text: text,
		}).done((result: string) => {
			callback(result);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Decryption Text");
		});
	}

	public getProperty(key: string, callback: (value: string) => void): void {
		ajax.doGet(RestSystemWorkspace.WORKSPACE + "/properties/" + key, {
		}).done((text: string) => {
			callback(text);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get properties Value");
		});
	}

}

export let engineTypeRegistry = RestSystemWorkspace.getInstance();
