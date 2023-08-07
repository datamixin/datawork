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

import { jsonLeanFactory } from "webface/constants";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";
import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

import RestSystemWorkspace from "bekasi/rest/RestSystemWorkspace";

export default class RestFileRunspace {

	private endPoint: string = null;

	constructor(endPoint: string) {
		this.endPoint = RestSystemWorkspace.WORKSPACE + endPoint;
	}

	public getHomeList(callback: (list: RunspaceHomeList) => void): void {
		ajax.doGet(this.endPoint + "", {
		}).done((json: any) => {
			let list = <RunspaceHomeList>jsonLeanFactory.create(json);
			callback(list);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Home List");
		});
	}

	public getItem(itemId: string, callback: (item: RunspaceItem) => void): void {
		ajax.doGet(this.endPoint + "/" + itemId, {
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Item");
		});
	}

	public removeItem(itemId: string, callback: () => void): void {
		ajax.doDelete(this.endPoint + "/" + itemId, {
		}).done(() => {
			callback();
		}).fail((error) => {
			DetailMessageDialog.open(error, "Remove Item");
		});
	}

	public getItemAncestors(itemId: string, callback: (items: RunspaceItem[]) => void): void {
		ajax.doGet(this.endPoint + "/" + itemId + "/ancestors", {
		}).done((jsons) => {
			let items: RunspaceItem[] = [];
			for (let i = 0; i < jsons.length; i++) {
				let json = jsons[i];
				let item = <RunspaceItem>jsonLeanFactory.create(json);
				items.push(item);
			}
			callback(items);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Item Ancestors");
		});
	}

	public getItemList(folderId: string, callback: (list: RunspaceItemList) => void): void {
		ajax.doGet(this.endPoint + "/" + folderId + "/list", {
		}).done((json: any) => {
			let list = <RunspaceItemList>jsonLeanFactory.create(json);
			callback(list);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Item List");
		});
	}

	public getItemNameList(folderId: string, callback: (list: string[]) => void): void {
		ajax.doGet(this.endPoint + "/" + folderId + "/names", {
		}).done((json) => {
			let list = <string[]>json;
			callback(list);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Item Name List");
		});
	}

	public postItemRename(itemId: string, newName: string, callback: (item: RunspaceItem) => void): void {
		ajax.doPost(this.endPoint + "/" + itemId + "/rename", {
			newName: newName,
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Item Rename");
		});
	}

	public postItemMove(itemId: string, newFolderId: string, callback: (item: RunspaceItem) => void): void {
		ajax.doPost(this.endPoint + "/" + itemId + "/move", {
			newFolderId: newFolderId,
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Item Move");
		});
	}

	public postItemCopy(itemId: string, newFolderId: string, newName: string,
		callback: (item: RunspaceItem) => void): void {
		ajax.doPost(this.endPoint + "/" + itemId + "/copy", {
			newFolderId: newFolderId,
			newName: newName,
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Item Copy");
		});
	}

	public postCreateFolder(itemId: string, name: string, callback: (item: RunspaceItem) => void): void {
		ajax.doPost(this.endPoint + "/" + itemId + "/create-folder", {
			name: name,
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Create Folder");
		});
	}

	public postCreateFile(itemId: string, name: string, callback: (item: RunspaceItem) => void): void {
		ajax.doPost(this.endPoint + "/" + itemId + "/create-file", {
			name: name,
		}).done((json) => {
			let item = <RunspaceItem>jsonLeanFactory.create(json);
			callback(item);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Post Create File");
		});
	}

	public getDependentFiles(fileId: string, callback: (fileIds: string[]) => void): void {
		ajax.doGet(this.endPoint + "/" + fileId + "/dependent-files", {
		}).done((fileIds: any[]) => {
			callback(fileIds);
		}).fail((error) => {
			DetailMessageDialog.open(error, "Get Dependent Files");
		});
	}

}
