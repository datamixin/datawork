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
import * as wef from "webface/wef";

import BaseHandler from "webface/wef/base/BaseHandler";

import BaseSelectionHandler from "webface/wef/base/BaseSelectionHandler";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import * as bekasi from "bekasi/directors";

import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunstackFile from "bekasi/resources/RunstackFile";

import LeanController from "bekasi/controller/LeanController";

import RunspaceHomeListHandler from "bekasi/handlers/RunspaceHomeListHandler";
import RunspaceItemListHandler from "bekasi/handlers/RunspaceItemListHandler";

import RunspaceHomeListRequest from "bekasi/requests/RunspaceHomeListRequest";
import RunspaceItemListRequest from "bekasi/requests/RunspaceItemListRequest";

import * as directors from "padang/directors";

import RunspaceItemFindoutView from "padang/view/findout/RunspaceItemFindoutView";

import RunspaceItemOpenRequest from "padang/requests/findout/RunspaceItemOpenRequest";
import RunspaceItemMoveRequest from "padang/requests/findout/RunspaceItemMoveRequest";
import RunspaceItemRemoveRequest from "padang/requests/findout/RunspaceItemRemoveRequest";
import RunspaceItemRenameRequest from "padang/requests/findout/RunspaceItemRenameRequest";
import RunspaceItemDuplicateRequest from "padang/requests/findout/RunspaceItemDuplicateRequest";
import RunspaceItemSelectionRequest from "padang/requests/findout/RunspaceItemSelectionRequest";
import RunspaceItemIsRemovableRequest from "padang/requests/findout/RunspaceItemIsRemovableRequest";
import RunspaceItemNameValidationRequest from "padang/requests/findout/RunspaceItemNameValidationRequest";

export default class RunspaceItemFindoutController extends LeanController {

	constructor() {
		super();
		super.addParticipant(wef.SELECTION_PARTICIPANT, new BaseSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(RunspaceHomeListRequest.REQUEST_NAME, new RunspaceHomeListHandler(this));
		this.installRequestHandler(RunspaceItemListRequest.REQUEST_NAME, new RunspaceItemListHandler(this));
		this.installRequestHandler(RunspaceItemOpenRequest.REQUEST_NAME, new RunspaceItemOpenHandler(this));
		this.installRequestHandler(RunspaceItemMoveRequest.REQUEST_NAME, new RunspaceItemMoveHandler(this));
		this.installRequestHandler(RunspaceItemRemoveRequest.REQUEST_NAME, new RunspaceItemRemoveHandler(this));
		this.installRequestHandler(RunspaceItemRenameRequest.REQUEST_NAME, new RunspaceItemRenameHandler(this));
		this.installRequestHandler(RunspaceItemSelectionRequest.REQUEST_NAME, new BaseSelectionHandler(this));
		this.installRequestHandler(RunspaceItemDuplicateRequest.REQUEST_NAME, new RunspaceItemDuplicateHandler(this));
		this.installRequestHandler(RunspaceItemIsRemovableRequest.REQUEST_NAME, new RunspaceItemIsRemovableHandler(this));
		this.installRequestHandler(RunspaceItemNameValidationRequest.REQUEST_NAME, new ExtensionRunspaceItemNameValidationHandler(this));
	}

	public createView(): RunspaceItemFindoutView {
		return new RunspaceItemFindoutView(this);
	}

	public getView(): RunspaceItemFindoutView {
		return <RunspaceItemFindoutView>super.getView();
	}

	public getModel(): RunspaceItem {
		return <RunspaceItem>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshIcon();
		this.refreshFileName();
		this.refreshModified();
	}

	private refreshIcon(): void {

		let model = this.getModel();
		let directory = model.isDirectory();
		let view = this.getView();
		if (directory === true) {
			view.setDirectory(directory);
		} else {
			let director = bekasi.getRunspaceDirector(this);
			let icon = director.getFileIcon();
			view.setIcon(icon);
		}

	}

	private refreshFileName(): void {
		let model = this.getModel();
		let name = model.getNameOnly();
		let view = this.getView();
		view.setFileName(name);
	}

	private refreshModified(): void {
		let model = this.getModel();
		let modified = model.getModified();
		let view = this.getView();
		view.setModified(modified);
	}

}

class RunspaceItemOpenHandler extends BaseHandler {

	public handle(): void {
		let file = <RunspaceItem>this.controller.getModel();
		let itemId = file.getId();
		if (file.isDirectory() === true) {
			let director = directors.getFindoutPartDirector(this.controller);
			director.openDirectory(itemId, () => { });
		} else {
			let director = bekasi.getRunstackDirector(this.controller);
			director.open(itemId, (file: RunstackFile) => {
				let director = bekasi.getConsoleDirector(this.controller);
				director.openFile(file, () => { });
			});
		}
	}

}

class RunspaceItemMoveHandler extends BaseHandler {

	public handle(request: RunspaceItemMoveRequest, callback?: (data: any) => void): void {
		let item = <RunspaceItem>this.controller.getModel();
		let itemId = item.getId();
		let folderId = <string>request.getData(RunspaceItemMoveRequest.FOLDER_ID);
		if (itemId === folderId) {
			callback("Cannot move item to same folder");
		} else {
			let director = bekasi.getRunspaceDirector(this.controller);
			director.getItemAncestors(folderId, (path: RunspaceItem[]) => {
				let ancestor = false;
				for (let item of path) {
					if (item.getId() === itemId) {
						ancestor = true;
					}
				}
				if (ancestor) {
					callback("Cannot move folder to subfolder of current folder");
				} else {
					director.moveItem(itemId, folderId, () => {
						let director = directors.getFindoutPartDirector(this.controller);
						director.refreshContents();
					});
				}
			});
		}
	}

}

class RunspaceItemRemoveHandler extends BaseHandler {

	public handle(request: RunspaceItemRemoveRequest, callback?: (data: any) => void): void {
		let file = <RunspaceItem>this.controller.getModel();
		let itemId = file.getId();
		let director = bekasi.getRunspaceDirector(this.controller);
		director.removeItem(itemId, () => {
			let director = directors.getFindoutPartDirector(this.controller);
			director.refreshContents();
		});
	}

}

class ExtensionRunspaceItemNameValidationHandler extends BaseHandler {

	public handle(request: RunspaceItemNameValidationRequest, callback?: (data: any) => void): void {

		let name = request.getData(RunspaceItemNameValidationRequest.NAME);

		let file = <RunspaceItem>this.controller.getModel();
		if (file.isDirectory() === false) {
			let extension = file.getExtension();
			name = name + "." + extension;
		}

		let director = directors.getFindoutPartDirector(this.controller);
		let folderId = director.getFolderId();
		{
			let director = bekasi.getRunspaceDirector(this.controller);
			director.validateItemName(folderId, name, callback);
		}
	}

}


class RunspaceItemRenameHandler extends BaseHandler {

	public handle(request: RunspaceItemRenameRequest, callback?: (data: any) => void): void {

		let name = <string>request.getData(RunspaceItemRenameRequest.NAME);

		let file = <RunspaceItem>this.controller.getModel();
		if (file.isDirectory() === false) {
			let extension = file.getExtension();
			name = name + "." + extension;
		}

		let itemId = file.getId();
		let director = bekasi.getRunspaceDirector(this.controller);
		director.renameItem(itemId, name, () => {
			let director = directors.getFindoutPartDirector(this.controller);
			director.refreshContents();
		});
	}

}

class RunspaceItemDuplicateHandler extends BaseHandler {

	public handle(request: RunspaceItemDuplicateRequest, callback?: (data: any) => void): void {
		let file = <RunspaceItem>this.controller.getModel();
		let nameOnly = file.getNameOnly();
		let newName = nameOnly + " copy";
		let itemId = file.getId();
		let folderId = file.getParentId();
		let director = bekasi.getRunspaceDirector(this.controller);
		director.getNewFileName(folderId, newName, (name: string) => {
			let extension = file.getExtension();
			name = name + "." + extension;
			director.copyItem(itemId, folderId, name, () => {
				let director = directors.getFindoutPartDirector(this.controller);
				director.refreshContents();
			});
		});
	}

}

class RunspaceItemIsRemovableHandler extends BaseHandler {

	public handle(request: RunspaceItemIsRemovableRequest, callback?: (data: any) => void): void {
		let controller = <RunspaceItemFindoutController>this.controller;
		let model = controller.getModel();
		if (model.isDirectory()) {
			if (model.getItemCount() > 0) {
				callback("Cannot remove non empty directory");
			} else {
				callback(true);
			}
		} else {
			let fileId = model.getId();
			let director = bekasi.getRunspaceDirector(this.controller);
			director.getDependentFiles(fileId, (projects: string[]) => {
				if (projects.length > 0) {
					callback("Cannot remove project bacause there is " + projects.length + " depend on it");
				} else {
					callback(true);
				}
			});
		}
	}

}
