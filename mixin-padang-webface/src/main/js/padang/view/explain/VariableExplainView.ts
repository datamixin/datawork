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
import FormulaPanel from "padang/view/FormulaPanel";

import * as explain from "padang/view/explain/explain";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

export default class VariableExplainView extends ConductorView {

    public static ICON_WIDTH = 30;
    public static NAME_WIDTH = 100;

    private composite: Composite = null;
    private namePanel = new LabelTextPanel();
    private formulaPanel: FormulaPanel = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-variable-explain-view");
        element.css("line-height", (explain.ITEM_HEIGHT) + "px");

        view.setGridLayout(this.composite, 2, 5, 5, 0, 0);
        this.createNamePanel(this.composite);
        this.createFormulaPanel(this.composite);
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
                    MessageDialog.openError("Name Error", message, () => {
                        this.namePanel.setText(oldText);
                        this.namePanel.setShowEdit(true);
                    });
                }
            });
        });
        view.setGridData(this.namePanel, VariableExplainView.NAME_WIDTH, true);
    }

    private createFormulaPanel(parent: Composite): void {
        this.formulaPanel = new FormulaPanel(this.conductor);
        this.formulaPanel.createControl(parent);
        view.setGridData(this.formulaPanel, true, true);
    }

    public setType(type: string): void {
        this.formulaPanel.setType(type);
    }

    public setName(text: string): void {
        this.namePanel.setText(text);
    }

    public setFormula(formula: string): void {
        this.formulaPanel.setFormula(formula);
    }

    public getControl(): Control {
        return this.composite;
    }

}
