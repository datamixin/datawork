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
import * as util from "webface/model/util";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import XForeach from "sleman/model/XForeach";

import * as dialogs from "padang/dialogs/dialogs";

import * as widgets from "padang/widgets/widgets";

import FormulaEditor from "padang/widgets/FormulaEditor";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

import FormulaParseRequest from "padang/requests/FormulaParseRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

export default class ForeachEditorPanel extends ConductorPanel {

    private dialog: GuideDialog = null;
    private validated: string = null;
    private foreach: XForeach = null;
    private composite: Composite = null;
    private editor: FormulaEditor = null;

    constructor(conductor: Conductor, dialog: GuideDialog, foreach: XForeach) {
        super(conductor);
        this.dialog = dialog;
        this.foreach = foreach;
    }

    public createControl(parent: Composite): void {
        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1, 0, 0, 0, 5);
        this.createLiteralEditor(this.composite);
        this.createValidateButton(this.composite);
    }

    private createLiteralEditor(parent: Composite): void {
        let expression = this.foreach.getExpression();
        this.validated = expression.toLiteral();
        this.editor = new FormulaEditor(parent);
        this.editor.setFormula(this.validated);
        this.editor.setOnModify((text: string) => {
            this.dialog.setErrorMessage(null);
            if (text !== this.validated) {
                this.dialog.setOKEnabled(false);
                this.dialog.setErrorMessage("Please validate formula");
            } else {
                this.dialog.setOKEnabled(true);
            }
        });
        widgets.setGridData(this.editor, true, true);
    }

    private createValidateButton(parent: Composite): void {
        let button = dialogs.createButtonGridWidth(parent, "Validate", 100);
        button.onSelection(() => {
            this.dialog.updatePageComplete();
        });
    }

    public updatePanelComplete(callback: (message: string) => void): void {
        let literal = this.editor.getText();
        let formula = "=" + literal;
        let request = new FormulaValidationRequest(formula);
        this.conductor.submit(request, (message: string) => {
            if (message === null) {
                this.validated = literal;
                let request = new FormulaParseRequest(formula);
                this.conductor.submit(request, (model: any) => {
                    let current = this.foreach.getExpression();
                    if (!util.isEquals(current, model)) {
                        this.foreach.setExpression(model);
                    }
                    callback(null);
                });
            } else {
                callback(message);
            }
        });
    }

    public getControl(): Control {
        return this.composite;
    }

}