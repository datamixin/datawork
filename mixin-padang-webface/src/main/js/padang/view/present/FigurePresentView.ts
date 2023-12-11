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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import BaseAction from "webface/wef/base/BaseAction";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import WebFontImage from "webface/graphics/WebFontImage";

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";

import FacetPresentView from "padang/view/present/FacetPresentView";
import PresentToolManager from "padang/view/present/PresentToolManager";

import FigureNameSetRequest from "padang/requests/present/FigureNameSetRequest";
import FigureNameValidationRequest from "padang/requests/present/FigureNameValidationRequest";
import FigureGraphicRefreshRequest from "padang/requests/present/FigureGraphicRefreshRequest";
import FigureGraphicComposerOpenRequest from "padang/requests/present/FigureGraphicComposerOpenRequest";

export default class FigurePresentView extends FacetPresentView {

    private static MIN_HEIGHT = 200;

    private composite: Composite = null;
    private namePanel: LabelTextPanel = null;
    private refreshAction: RefreshAction = null;
    private composeAction: ComposeAction = null;
    private exportAction: ExportAction = null;

    constructor(conductor: Conductor) {
        super(conductor);
        this.constructNamePanel();
        this.composeAction = new ComposeAction(this.conductor);
        this.refreshAction = new RefreshAction(this.conductor);
        this.exportAction = new ExportAction(this.conductor);
    }

    private constructNamePanel(): void {
        this.namePanel = new LabelTextPanel();
        this.namePanel.onCommit((newText: string, oldText: string) => {
            let request = new FigureNameValidationRequest(newText);
            this.conductor.submit(request, (message: string) => {
                if (message === null) {
                    let request = new FigureNameSetRequest(newText);
                    this.conductor.submit(request);
                } else {
                    MessageDialog.openError("Figure Name Error", message, () => {
                        this.namePanel.setText(oldText);
                        this.namePanel.setShowEdit(true);
                    });
                }
            });
        });
    }

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-figure-present-view");

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

    }

    public relayout(): void {
        this.composite.relayout();
    }

    public setName(name: string): void {
        this.namePanel.setText(name);
    }

    public populateTools(manager: PresentToolManager): void {
        manager.setTypeIcon("mdi-chart-areaspline");
        manager.setCaptionPanel(this.namePanel, {
            "color": "#444",
            "font-weight": "500"
        });
        manager.addBarIcon(this.refreshAction);
        manager.addBarIcon(this.composeAction);
        manager.addMenuItem(this.exportAction);
    }

    public disposeTools(manager: PresentToolManager): void {
        manager.removeTool(this.refreshAction);
        manager.removeTool(this.composeAction);
        manager.removeTool(this.exportAction);
    }

    public adjustHeight(): number {
        return FigurePresentView.MIN_HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {
        child.createControl(this.composite, index);
        view.setGridData(child, true, true);
    }

    public removeView(child: ConductorView): void {
        view.dispose(child);
    }

}

class RefreshAction extends BaseAction {

    public getText(): string {
        return "Refresh";
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", "mdi-refresh");
    }

    public run(): void {
        let request = new FigureGraphicRefreshRequest();
        this.conductor.submit(request);
    }

}

class ComposeAction extends BaseAction {

    public getText(): string {
        return "Compose...";
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", "mdi-square-edit-outline");
    }

    public run(): void {
        let request = new FigureGraphicComposerOpenRequest();
        this.conductor.submit(request);
    }

}

class ExportAction extends BaseAction {

    public getText(): string {
        return "Export";
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", "mdi-export");
    }

    public run(): void {

    }

}