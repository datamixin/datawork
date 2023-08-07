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
import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

import SecurityProviderRegistry from "bekasi/ui/SecurityProviderRegistry";

import SystemWorkspaceDirector from "bekasi/directors/SystemWorkspaceDirector";

export default class BaseSystemWorkspaceDirector implements SystemWorkspaceDirector {

	private preference = RestSystemWorkspace.getInstance();

	public getProperty(key: string, callback: (value: any) => void): void {
		this.preference.getProperty(key, callback);
	}

	public getPreference(key: string, callback: (value: any) => void): void {
		this.preference.getPreference(key, callback);
	}

	public setPreference(key: string, value: any, callback?: () => void): void {
		this.preference.setPreference(key, value, callback);
	}

	public encrypt(text: string, callback: (result: string) => void): void {
		this.preference.getEncrypt(text, callback);
	}

	public decrypt(text: string, callback: (result: string) => void): void {
		this.preference.getDecrypt(text, callback);
	}

	public getSecurityPrivilages(callback: (privilages: string[]) => void): void {
		let registry = SecurityProviderRegistry.getInstance();
		let provider = registry.getProvider();
		provider.getSecurityPrevilages(callback);
	}

}