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

import ConductorView from "webface/wef/ConductorView";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import FormulaPanel from "padang/view/FormulaPanel";

import VariableSelectRequest from "padang/requests/present/VariableSelectRequest";
import VariableRemoveRequest from "padang/requests/present/VariableRemoveRequest";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

export default class VariablePresentView extends ConductorView {

    private static HEIGHT = 30;
    private static ICON_WIDTH = 30;
    private static LABEL_WIDTH = 100;

    private composite: Composite = null;
    private namePanel = new LabelTextPanel();
    private formulaPanel: FormulaPanel = null;
    private menuPanel = new MenuPanel();

    public createControl(parent: Composite, index: number): void {
        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-variable-present-view");
        view.css(this.composite, "line-height", (VariablePresentView.HEIGHT - 2) + "px");
        view.setGridLayout(this.composite, 3, 0, 0, 0, 0);
        this.createNamePanel(this.composite);
        this.createFormulaPanel(this.composite);
        this.createDialogPanel(this.composite);
        this.composite.onSelection(() => {
            let request = new VariableSelectRequest();
            this.conductor.submit(request);
        });
    }

    private createNamePanel(parent: Composite): void {
        this.namePanel.createControl(parent);
        this.namePanel.onCommit((newText: string, oldText: string) => {
            let request = new VariableNameValidationRequest(newText);
            this.conductor.submit(request, (message: string) => {
                if (message === null) {
                    let request = new VariableNameSetRequest(newText);
                    this.conductor.submit(request);
                } else {
                    MessageDialog.openError("Variable Name Error", message, () => {
                        this.namePanel.setText(oldText);
                        this.namePanel.setShowEdit(true);
                    });
                }
            });
        });
        view.setGridData(this.namePanel, VariablePresentView.LABEL_WIDTH, true);
    }

    private createFormulaPanel(parent: Composite): void {
        this.formulaPanel = new FormulaPanel(this.conductor);
        this.formulaPanel.createControl(parent);
        view.setGridData(this.formulaPanel, true, true);
    }

    private createDialogPanel(parent: Composite): void {
        this.menuPanel.createControl(parent);
        this.menuPanel.setActions([
            new ViewAction("Remove", () => {
                let request = new VariableRemoveRequest();
                this.conductor.submit(request);
            }, "mdi-playlist-remove")

        ]);
        view.setGridData(this.menuPanel, VariablePresentView.ICON_WIDTH, true);
    }

    public setName(name: string): void {
        this.namePanel.setText(name);
    }

    public setFormula(formula: string): void {
        this.formulaPanel.setFormula(formula);
    }

    public setSelected(selected: boolean): void {
        view.setSelected(this.composite, selected);
    }

    public adjustHeight(): number {
        return VariablePresentView.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}
