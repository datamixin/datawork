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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as bekasi from "bekasi/directors";

import LeanController from "bekasi/controller/LeanController";

import RunspaceItemList from "bekasi/resources/RunspaceItemList";

import RunspaceItemAncestorsRequest from "bekasi/requests/RunspaceItemAncestorsRequest";

import RunspaceItemAncestorsHandler from "bekasi/handlers/RunspaceItemAncestorsHandler";

import * as directors from "padang/directors";

import RunspaceItemListFindoutView from "padang/view/findout/RunspaceItemListFindoutView";

import RunspaceItemListDirectoryAddRequest from "padang/requests/findout/RunspaceItemListDirectoryAddRequest";
import RunspaceItemListDirectoryOpenRequest from "padang/requests/findout/RunspaceItemListDirectoryOpenRequest";
import RunspaceItemListNameValidationRequest from "padang/requests/findout/RunspaceItemListNameValidationRequest";

export default class RunspaceItemListFindoutController extends LeanController {

    public createRequestHandlers(): void {

        super.createRequestHandlers();

        this.installRequestHandler(RunspaceItemAncestorsRequest.REQUEST_NAME, new RunspaceItemAncestorsHandler(this));
        this.installRequestHandler(RunspaceItemListDirectoryAddRequest.REQUEST_NAME, new RunspaceItemListDirectoryAddHandler(this));
        this.installRequestHandler(RunspaceItemListDirectoryOpenRequest.REQUEST_NAME, new RunspaceItemListDirectoryOpenHandler(this));
        this.installRequestHandler(RunspaceItemListNameValidationRequest.REQUEST_NAME, new RunspaceItemListNameValidationHandler(this));
    }

    public createView(): RunspaceItemListFindoutView {
        return new RunspaceItemListFindoutView(this);
    }

    public getView(): RunspaceItemListFindoutView {
        return <RunspaceItemListFindoutView>super.getView();
    }

    public getModel(): RunspaceItemList {
        return <RunspaceItemList>super.getModel();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        return model.getItems();
    }

    public getFolderId(): string {
        let model = this.getModel();
        return model.getId();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshFindoutId();
    }

    private refreshFindoutId(): void {

        let folderId = this.getFolderId();
        let director = bekasi.getRunspaceDirector(this);
        director.setCurrentFolderId(folderId);

        let view = this.getView();
        view.setFolderId(folderId);
    }

}

abstract class RunspaceItemListHandler extends BaseHandler {

    protected getFolderId(): string {
        let controller = <RunspaceItemListFindoutController>this.controller;
        let itemId = controller.getFolderId();
        return itemId;
    }

}

class RunspaceItemListDirectoryOpenHandler extends RunspaceItemListHandler {

    public handle(request: RunspaceItemListDirectoryOpenRequest, callback?: (data: any) => void): void {
        let openPath = request.getData(RunspaceItemListDirectoryOpenRequest.FOLDER_ID);
        let director = directors.getFindoutPartDirector(this.controller);
        director.openDirectory(openPath, () => { });
    }

}

class RunspaceItemListNameValidationHandler extends RunspaceItemListHandler {

    public handle(request: RunspaceItemListNameValidationRequest, callback?: (data: any) => void): void {
        let folderId = this.getFolderId();
        let name = request.getData(RunspaceItemListNameValidationRequest.NAME);
        let director = bekasi.getRunspaceDirector(this.controller);
        director.validateItemName(folderId, name, callback);
    }

}

class RunspaceItemListDirectoryAddHandler extends RunspaceItemListHandler {

    public handle(request: RunspaceItemListDirectoryAddRequest, callback?: (data: any) => void): void {
        let folderId = this.getFolderId();
        let name = request.getData(RunspaceItemListDirectoryAddRequest.NAME);
        let director = bekasi.getRunspaceDirector(this.controller);
        director.createFolder(folderId, name, () => {
            let director = directors.getFindoutPartDirector(this.controller);
            director.refreshContents();
        });
    }

}
