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
import Composite from "webface/widgets/Composite";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import SelectRows from "padang/functions/dataset/SelectRows";

import ForeachEditorPanel from "padang/dialogs/guide/ForeachEditorPanel";

export default class SelectRowsDialog extends GuideDialog {

    private composite: Composite = null;
    private conditionPanel: ForeachEditorPanel = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1, 10, 10);

        this.createConditionPanel(this.composite);
    }

    private createConditionPanel(parent: Composite): void {
        let foreach = this.getForeach(SelectRows.CONDITION_PLAN);
        dialogs.createLabelGridHorizontal(parent, "Condition");
        this.conditionPanel = new ForeachEditorPanel(this.conductor, this, foreach);
        this.conditionPanel.createControl(parent);
        widgets.setGridData(this.conditionPanel, true, true);
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        this.conditionPanel.updatePanelComplete((message: string) => {
            if (message === null) {
                this.okButton.setEnabled(true);
            } else {
                this.setErrorMessage(message);
            }
        });
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(SelectRows.FUNCTION_NAME, SelectRowsDialog);