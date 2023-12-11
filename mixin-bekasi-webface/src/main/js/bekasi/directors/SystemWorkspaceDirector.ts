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
export let SYSTEM_WORKSPACE_DIRECTOR = "system-workspace-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export interface SystemWorkspaceDirector {

	getProperty(key: string, callback: (value: any) => void): void;

	getPreference(key: string, callback: (value: any) => void): void;

	setPreference(key: string, value: any, callback?: () => void): void;

	encrypt(text: string, callback: (result: string) => void): void;

	decrypt(text: string, callback: (result: string) => void): void;

	getSecurityPrivilages(callback: (privilages: string[]) => void): void;

}

export function getSystemWorkspaceDirector(host: Controller | PartViewer): SystemWorkspaceDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <SystemWorkspaceDirector>viewer.getDirector(SYSTEM_WORKSPACE_DIRECTOR);
}

export default SystemWorkspaceDirector;

