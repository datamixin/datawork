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
import { Client, Models } from "appwrite";
import { Account } from "appwrite";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

let preference = RestSystemWorkspace.getInstance();

type AuthConfig = {
	endpoint: string,
	project: string
}

let server: AuthConfig = {
	endpoint: null,
	project: null
}

export const api = {
	provider: (callback: (account: Account) => void): void => {
		let client = new Client();
		if (!(server.endpoint || server.project)) {
			preference.getProperty("auth.appwrite.url", (value) => {
				server.endpoint = value;
				preference.getProperty("auth.appwrite.project.id", (value) => {
					server.project = value;
					client.setEndpoint(server.endpoint)
						.setProject(server.project);
					const account = new Account(client);
					callback(account);
				});
			});
		} else {
			client.setEndpoint(server.endpoint)
				.setProject(server.project);
			const account = new Account(client);
			callback(account);
		}
	},

	createAccount: (email: string, password: string, name: string, callback: (model: Promise<Models.Account<Models.Preferences>>) => void) => {
		api.provider((account) => {
			let model = account.create('unique()', email, password, name)
			callback(model);
		});
	},

	getAccount: (callback: (model: Promise<Models.Account<Models.Preferences>>) => void) => {
		api.provider((account) => {
			callback(account.get());
		});
	},

	createSession: (email: string, password: string, callback: (model: Promise<Models.Session>) => void) => {

		api.provider((account) => {
			let model = account.createEmailSession(email, password);
			callback(model);
		});
	},

	deleteCurrentSession: (callback: (model: Promise<{}>) => void) => {

		api.provider((account) => {
			let model = account.deleteSession('current')
			callback(model);
		});
	},
};