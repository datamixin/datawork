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
import FolderRunspaceReconcile from "bekasi/reconciles/FolderRunspaceReconcile";

import RunspaceReconcileApplier from "bekasi/directors/RunspaceReconcileApplier";

import * as directors from "padang/directors";

import FindoutPartViewer from "padang/ui/FindoutPartViewer";

import RunspaceItemListFindoutController from "padang/controller/findout/RunspaceItemListFindoutController";

export default class FindoutReconcileApplier implements RunspaceReconcileApplier {

    private partViewer: FindoutPartViewer = null;

    constructor(partViewer: FindoutPartViewer) {
        this.partViewer = partViewer;
    }

    public apply(reconcile: FolderRunspaceReconcile): void {

        let controller = this.partViewer.getRootController();
        let contents = <RunspaceItemListFindoutController>controller.getContents();

        let director = directors.getFindoutPartDirector(contents);
        let folderId = director.getFolderId();
        if (folderId === reconcile.getFolderId()) {
            director.refreshContents();
        }
    }

}