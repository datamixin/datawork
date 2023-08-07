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
import * as functions from "webface/util/functions";

import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";
import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

import RestFileRunstack from "bekasi/rest/RestFileRunstack";
import RestFileRunspace from "bekasi/rest/RestFileRunspace";

import RunspaceDirector from "bekasi/directors/RunspaceDirector";

export abstract class BaseRunspaceDirector implements RunspaceDirector {

	private runspace: RestFileRunspace = null;
	private runstack: RestFileRunstack = null;
	private currentFolderId: string = null;

	constructor(runspace: RestFileRunspace, runstack: RestFileRunstack) {
		this.runspace = runspace;
		this.runstack = runstack;
	}

	public getCurrentFolderId(): string {
		return this.currentFolderId;
	}

	public setCurrentFolderId(folderId: string): void {
		this.currentFolderId = folderId;
	}

	public getHomeList(callback: (list: RunspaceHomeList) => void): void {
		this.runspace.getHomeList(callback);
	}

	public getItem(itemId: string, callback: (item: RunspaceItem) => void): void {
		this.runspace.getItem(itemId, callback);
	}

	private getNameOnlyList(list: string[]): string[] {
		let names: string[] = [];
		for (let i = 0; i < list.length; i++) {
			let file = list[i];
			let period = file.lastIndexOf(".");
			let name = file.substring(0, period);
			names.push(name);
		}
		return names;
	}

	public getNewFileName(folderId: string, name: string, callback: (name: string) => void): void {
		this.runspace.getItemNameList(folderId, (names: string[]) => {
			let list = this.getNameOnlyList(names);
			this.runstack.getUntitledNameList((untitles: string[]) => {
				let names = this.getNameOnlyList(untitles);
				let used = list.concat(names);
				let newName = functions.getIncrementedName(name, used);
				callback(newName);
			});
		});
	}

	public validateItemName(folderId: string, name: string, callback: (message: string) => void): void {
		if (name.length === 0) {
			callback("Please define item name");
		} else {
			this.runspace.getItemNameList(folderId, (names: string[]) => {
				if (names.indexOf(name) >= 0) {
					callback("Item '" + name + "' already exists");
				} else {
					callback(null);
				}
			});
		}
	}

	public getItemList(folderId: string, callback: (list: RunspaceItemList) => void): void {
		this.runspace.getItemList(folderId, callback);
	}

	public createFolder(folderId: string, name: string, callback: (item: RunspaceItem) => void): void {
		this.runspace.postCreateFolder(folderId, name, callback);
	}

	public createFile(folderId: string, name: string, callback: (item: RunspaceItem) => void): void {
		this.runspace.postCreateFile(folderId, name, callback);
	}

	public getItemAncestors(itemId: string, callback: (items: RunspaceItem[]) => void): void {
		this.runspace.getItemAncestors(itemId, callback);
	}

	public renameItem(itemId: string, newName: string, callback: (item: RunspaceItem) => void): void {
		this.runspace.postItemRename(itemId, newName, callback);
	}

	public moveItem(itemId: string, newFolder: string, callback: (item: RunspaceItem) => void): void {
		this.runspace.postItemMove(itemId, newFolder, callback);
	}

	public copyItem(itemId: string, newFolder: string, newName: string,
		callback: (item: RunspaceItem) => void): void {
		this.runspace.postItemCopy(itemId, newFolder, newName, callback);
	}

	public removeItem(itemId: string, callback: () => void): void {
		this.runspace.removeItem(itemId, callback);
	}

	public getDependentFiles(fileId: string, callback: (fileId: string[]) => void): void {
		this.runspace.getDependentFiles(fileId, callback);
	}

	public abstract getFileIcon(): string;

}

export default BaseRunspaceDirector;