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

import RootView from "webface/wef/RootView";
import PartViewer from "webface/wef/PartViewer";
import RootController from "webface/wef/RootController";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BaseSelectionDirector from "webface/wef/base/BaseSelectionDirector";

import * as bekasi from "bekasi/directors";

import RunspaceItemList from "bekasi/resources/RunspaceItemList";

import FolderRunspaceReconcile from "bekasi/reconciles/FolderRunspaceReconcile";

import * as directors from "padang/directors";

import FindoutPartDirector from "padang/directors/FindoutPartDirector";

import FindoutReconcileApplier from "padang/ui/appliers/FindoutReconcileApplier";

import BaseProjectExportDirector from "padang/directors/BaseProjectExportDirector";
import BaseProjectRunstackDirector from "padang/directors/BaseProjectRunstackDirector";
import BaseProjectRunspaceDirector from "padang/directors/BaseProjectRunspaceDirector";

export default class FindoutPartViewer extends BaseControllerViewer implements FindoutPartDirector {

    private rootController: RootController;
    private rootView: RootView = new RootView();

    constructor() {
        super();
        this.registerExportDirector();
        this.registerRunstackDirector();
        this.registerRunspaceDirector();
        this.registerSelectionDirector();
        this.registerFindoutPartDirector();
    }

    public setParent(parent: PartViewer): void {
        super.setParent(parent);
        this.registerReconcileApplier();
    }

    private registerExportDirector(): void {
        let key = bekasi.EXPORT_DIRECTOR;
        this.registerDirector(key, new BaseProjectExportDirector());
    }

    private registerRunstackDirector(): void {
        let key = bekasi.RUNSTACK_DIRECTOR;
        this.registerDirector(key, new BaseProjectRunstackDirector());
    }

    private registerRunspaceDirector(): void {
        let key = bekasi.RUNSPACE_DIRECTOR;
        this.registerDirector(key, new BaseProjectRunspaceDirector());
    }

    private registerSelectionDirector(): void {
        let key = wef.SELECTION_DIRECTOR;
        this.registerDirector(key, new BaseSelectionDirector(this));
    }

    private registerFindoutPartDirector(): void {
        let key = directors.FINDOUT_PART_DIRECTOR;
        this.registerDirector(key, this);
    }

    public createControl(parent: Composite) {

        this.rootView.createControl(parent)
        let control = this.rootView.getControl();

        let element = control.getElement();
        element.addClass("padang-findout-part-viewer");

        this.rootController = new RootController(this.rootView);
        this.rootController.setViewer(this);
    }

    public getControl(): Control {
        return this.rootView.getControl();
    }

    public getRootController(): RootController {
        return this.rootController;
    }

    public getFolderId(): string {
        let controller = this.rootController.getContents();
        let item = <RunspaceItemList>controller.getModel();
        return item.getId();
    }

    public refreshContents(): void {
        let director = bekasi.getRunspaceDirector(this);
        let folderId = this.getFolderId();
        director.getItemList(folderId, (list: RunspaceItemList) => {
            this.setContents(list);
        });
    }

    public openDirectory(itemId: string, callback: () => void): void {
        let director = bekasi.getRunspaceDirector(this);
        if (itemId !== null) {
            director.getItemList(itemId, (list: RunspaceItemList) => {
                this.setContents(list);
                callback();
            });
        } else {
            director.getHomeList((list: RunspaceItemList) => {
                this.setContents(list);
                callback();
            });
        }
    }

    private setCurrentFindout(model: RunspaceItemList): void {
        let director = bekasi.getRunspaceDirector(this);
        let folderId = model.getId();
        director.setCurrentFolderId(folderId);
    }

    private registerReconcileApplier(): void {
        let applier = new FindoutReconcileApplier(this);
        let director = bekasi.getReconcileDirector(this);
        director.registerRunspaceApplier(FolderRunspaceReconcile.LEAN_NAME, applier);
    }

    public setContents(model: RunspaceItemList): void {

        this.setCurrentFindout(model);

        let factory = this.getControllerFactory();

        let controller = factory.createController(model);
        controller.setModel(model);
        this.rootController.setContents(controller);

        let composite = <Composite>this.rootView.getControl();
        composite.relayout();

    }

}
