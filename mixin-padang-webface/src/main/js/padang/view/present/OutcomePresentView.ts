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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";

import BaseAction from "webface/wef/base/BaseAction";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import WebFontImage from "webface/graphics/WebFontImage";

import MessageDialog from "webface/dialogs/MessageDialog";

import LiteralFormula from "bekasi/LiteralFormula";

import * as view from "padang/view/view";

import TypeDecoration from "padang/view/TypeDecoration";

import FrontagePanel from "padang/view/present/FrontagePanel";
import FacetPresentView from "padang/view/present/FacetPresentView";
import PresentToolManager from "padang/view/present/PresentToolManager";

import FormulaEditorDialog from "padang/dialogs/FormulaEditorDialog";

import OutcomeVariableRefreshRequest from "padang/requests/present/OutcomeVariableRefreshRequest";
import OutcomeVariableNameSetRequest from "padang/requests/present/OutcomeVariableNameSetRequest";
import OutcomeVariableFormulaSetRequest from "padang/requests/present/OutcomeVariableFormulaSetRequest";
import OutcomeVariableNameValidationRequest from "padang/requests/present/OutcomeVariableNameValidationRequest";

export default class OutcomePresentView extends FacetPresentView {

    private static MIN_HEIGHT = 200;

    private composite: Composite = null;
    private progressLabel: Label = null;
    private namePanel: LabelTextPanel = null;
    private refreshAction: RefreshAction = null;
    private editorAction: EditorAction = null;
    private exportAction: ExportAction = null;
    private container: Composite = null;
    private frontagePanel: FrontagePanel = null;
    private manager: PresentToolManager = null;

    constructor(conductor: Conductor) {
        super(conductor);
        this.constructNamePanel();
        this.editorAction = new EditorAction(this.conductor);
        this.refreshAction = new RefreshAction(this.conductor);
        this.exportAction = new ExportAction(this.conductor);
    }

    private constructNamePanel(): void {
        this.namePanel = new LabelTextPanel();
        this.namePanel.onCommit((newText: string, oldText: string) => {
            let request = new OutcomeVariableNameValidationRequest(newText);
            this.conductor.submit(request, (message: string) => {
                if (message === null) {
                    let request = new OutcomeVariableNameSetRequest(newText);
                    this.conductor.submit(request);
                } else {
                    MessageDialog.openError("Outcome Name Error", message, () => {
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
        element.addClass("padang-outcome-present-view");
        element.css("border", "1px solid #E0E0E0");
        element.css("border-radius", "4px");
        element.css("background", "#FFF");

        view.setAbsoluteLayout(this.composite);

        this.createContainer(this.composite);
        this.createProgressLabel(this.composite);

    }

    private createContainer(parent: Composite): void {

        this.container = new Composite(parent);

        let element = this.container.getElement();
        element.addClass("padang-outcome-present-container");

        view.setGridLayout(this.container, 1, 0, 0, 0, 0);
        view.setAbsoluteData(this.container, 0, 0, "100%", "100%");
    }

    private createProgressLabel(parent: Composite): void {

        this.progressLabel = new Label(parent);
        this.progressLabel.setText("Progress...");

        let element = this.progressLabel.getElement();
        element.css("z-index", 3);
        element.css("color", "#888");
        element.css("text-indent", "5px");
        element.css("line-height", "24px");
        element.css("font-style", "italic");
        element.css("background-color", "rgba(255, 255, 255, 0.8)");

        view.setAbsoluteData(this.progressLabel, 0, 0, "100%", 0);
    }

    public setName(name: string): void {
        this.namePanel.setText(name);
    }

    public setType(type: string): void {
        let icon = TypeDecoration.ICON_MAP[type];
        this.manager.setTypeIcon(icon);
    }

    public setFormula(formula: string): void {
        this.editorAction.setFormula(formula);
    }

    public setProgress(state: boolean): void {
        view.setAbsoluteData(this.progressLabel, 0, 0, "100%", state ? "100%" : 0);
        this.composite.relayout();
    }

    public setProperty(keys: string[], value: any): void {
        this.frontagePanel.setProperty(keys, value);
    }

    public populateTools(manager: PresentToolManager): void {
        manager.setTypeIcon("mdi-variable");
        manager.setCaptionPanel(this.namePanel, {
            "color": "#444",
            "font-weight": "500"
        });
        manager.addBarIcon(this.refreshAction);
        manager.addBarIcon(this.editorAction);
        manager.addMenuItem(this.exportAction);
        this.manager = manager;
    }

    public disposeTools(manager: PresentToolManager): void {
        manager.removeTool(this.refreshAction);
        manager.removeTool(this.editorAction);
        manager.removeTool(this.exportAction);
    }

    public setFrontagePanel(panel: FrontagePanel): void {

        if (this.frontagePanel !== null) {
            let control = this.frontagePanel.getControl();
            control.dispose();
        }

        panel.createControl(this.container);
        let control = panel.getControl();

        view.setGridData(control, true, true);

        this.frontagePanel = panel;
        this.container.relayout();

    }

    public relayout(): void {
        this.container.relayout();
    }

    public adjustHeight(): number {
        return OutcomePresentView.MIN_HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
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
        let request = new OutcomeVariableRefreshRequest();
        this.conductor.submit(request);
    }

}

class EditorAction extends BaseAction {

    private formula: string = null;

    public setFormula(formula: string): void {
        this.formula = formula;
    }

    public getText(): string {
        return "Editor...";
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", "mdi-square-edit-outline");
    }

    public run(): void {
        let formula = new LiteralFormula(this.formula);
        let dialog = new FormulaEditorDialog(this.conductor, formula);
        dialog.open((result: string) => {
            if (result === FormulaEditorDialog.OK) {
                let formula = dialog.getFormula();
                let request = new OutcomeVariableFormulaSetRequest(formula.literal);
                this.conductor.submit(request);
            }
        });
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