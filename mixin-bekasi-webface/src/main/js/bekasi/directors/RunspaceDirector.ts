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
export let RUNSPACE_DIRECTOR = "runspace-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";
import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

export interface RunspaceDirector {

	getCurrentFolderId(): string;

	setCurrentFolderId(folderId: string): void;

	getHomeList(callback: (list: RunspaceHomeList) => void): void;

	getItem(itemId: string, callback: (item: RunspaceItem) => void): void;

	getNewFileName(folderId: string, name: string, callback: (name: string) => void): void;

	validateItemName(folderId: string, name: string, callback: (message: string) => void): void;

	getItemList(folderId: string, callback: (list: RunspaceItemList) => void): void;

	createFolder(folderId: string, name: string, callback: (item: RunspaceItem) => void): void;

	createFile(folderId: string, name: string, callback: (item: RunspaceItem) => void): void;

	renameItem(itemId: string, newName: string, callback: (item: RunspaceItem) => void): void;

	moveItem(itemId: string, newFolder: string, callback: (item: RunspaceItem) => void): void;

	copyItem(itemId: string, newFolder: string, newName: string, callback: (item: RunspaceItem) => void): void;

	removeItem(itemId: string, callback: () => void): void;

	getItemAncestors(itemId: string, callback: (path: RunspaceItem[]) => void): void;

	getDependentFiles(fileId: string, callback: (fileId: string[]) => void): void;

	getFileIcon(): string;

}

export function getRunspaceDirector(host: Controller | PartViewer): RunspaceDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <RunspaceDirector>viewer.getDirector(RUNSPACE_DIRECTOR);
}

export default RunspaceDirector;

