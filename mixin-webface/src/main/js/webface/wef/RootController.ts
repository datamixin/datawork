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
import View from "webface/wef/View";
import RootView from "webface/wef/RootView";
import Controller from "webface/wef/Controller";
import ControllerViewer from "webface/wef/ControllerViewer";

export default class RootController extends Controller {

    private viewer: ControllerViewer;
    private contents: Controller = null;
    private rootView: RootView;

    constructor(rootView: RootView) {
        super();
        this.rootView = rootView;
    }

    public getView(): View {
        return this.rootView;
    }

    public setContents(controller: Controller): void {

        // Hapus terlebih dahulu yang sebelumnya jika ada
        if (this.contents !== null) {
            this.removeChild(this.contents);
        }

        // Setting contents baru
        this.contents = controller;
        if (this.contents !== null) {
            this.addChild(this.contents, 0);

            // Activate controller ini
            this.activate();

        }
    }

    public getContents(): Controller {
        return this.contents;
    }

    public getChildren(): Controller[] {
        return this.contents === null ? [] : [this.contents];
    }

    public getViewer(): ControllerViewer {
        return this.viewer;
    }

    public setViewer(viewer: ControllerViewer) {
        this.viewer = viewer;
    }

    public getRoot(): RootController {
        return this;
    }

    public createView(): View {
        return this.rootView;
    }

}
