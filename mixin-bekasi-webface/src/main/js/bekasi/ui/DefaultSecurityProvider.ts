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

import Composite from "webface/widgets/Composite";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

import LoginProcess from "bekasi/ui/LoginProcess";
import SecurityProvider from "bekasi/ui/SecurityProvider";
import SecurityProviderRegistry from "bekasi/ui/SecurityProviderRegistry";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

export default class DefaultSecurityProvider extends SecurityProvider {

	public login(_parent: Composite, process: LoginProcess): void {
		process.success();
	}

	public getSecurityPrevilages(callback: (privilages: string[]) => void): void {
		callback([]);
	}

	public logout(callback: (url: string) => void): void {
		let workspace = RestSystemWorkspace.getInstance();
		workspace.getProperty("workspace.logout.url", (url: string) => {
			ajax.doPost(url, {
			}).done((url: string) => {
				callback(url);
			}).fail((error) => {
				DetailMessageDialog.open(error, "Post workspace logout URL");
			});
		});
	}

	public timeout(callback: (url: string) => void): void {
		let workspace = RestSystemWorkspace.getInstance();
		workspace.getProperty("workspace.timeout.url", (url: string) => {
			ajax.doPost(url, {
			}).done((url: string) => {
				callback(url);
			}).fail((error) => {
				DetailMessageDialog.open(error, "Post workspace timeout URL");
			});
		});
	}

}

let registry = SecurityProviderRegistry.getInstance();
registry.register(new DefaultSecurityProvider(), true);