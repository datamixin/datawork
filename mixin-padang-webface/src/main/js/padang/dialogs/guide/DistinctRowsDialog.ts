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
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";

import XExpression from "sleman/model/XExpression";

import InteractionPlan from "padang/plan/InteractionPlan";

import DistinctRows from "padang/functions/dataset/DistinctRows";

import UniqueRowsDialog from "padang/dialogs/guide/UniqueRowsDialog";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

export default class DistinctRowsDialog extends UniqueRowsDialog {

    constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
        super(conductor, plan, options);
        this.setDialogSize(DistinctRowsDialog.INIT_WIDTH, DistinctRowsDialog.INIT_HEIGHT);
        this.setWindowTitle("Distinct Dialog");
        this.setTitle("Distinct Function");
        this.setMessage("Please specify distinct keys");
    }

    protected createExtendListPart(parent: Composite): void {

    }

    protected adjustExtendHeight(): number {
        return 0;
    }

    public updatePageComplete(): void {

        this.setErrorMessage(null);
        this.okButton.setEnabled(false);

        // Pastikan minimal ada key atau value
        let keys = this.getList(DistinctRows.KEYS_PLAN);
        let keyCount = keys.getElementCount();
        if (keyCount === 0) {
            this.setErrorMessage("Please define a key");
            return;
        }

        this.okButton.setEnabled(true);
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(DistinctRows.FUNCTION_NAME, DistinctRowsDialog);