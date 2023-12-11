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
import Conductor from "webface/wef/Conductor";

import Notification from "webface/model/Notification";

import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";
import XExpression from "sleman/model/XExpression";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import InteractionPlan from "padang/plan/InteractionPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import CheckLabelTextPanel from "padang/dialogs/guide/CheckLabelTextPanel";
import CheckLabelLogicalPanel from "padang/dialogs/guide/CheckLabelLogicalPanel";
import LabelNameListComboPanel from "padang/dialogs/guide/LabelNameListComboPanel";

import ToDatetime from "padang/functions/dataset/ToDatetime";

export default class ToDatetimeDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private column: XText = null;
    private formatPanel: CheckLabelTextPanel = null;
    private detectPanel: CheckLabelLogicalPanel = null;

    constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
        super(conductor, plan, options);
    }

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1, 10, 10);

        this.support = new NameListSupport(this.conductor, ToDatetime.COLUMN_PLAN);

        this.createColumnPart(this.composite);
        this.createFormatPart(this.composite);
        this.createDetectPart(this.composite);

    }

    private createColumnPart(parent: Composite): void {
        this.column = this.getText(ToDatetime.COLUMN_PLAN);
        let panel = new LabelNameListComboPanel("Column", this.support, this.column);
        panel.createControl(parent);
        widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
    }

    private createFormatPart(parent: Composite): void {
        this.formatPanel = new CheckLabelTextPanel(this, "Format", ToDatetime.FORMAT_PLAN);
        this.formatPanel.createControl(parent);
        widgets.setGridData(this.formatPanel, true, dialogs.ITEM_HEIGHT);
    }

    private createDetectPart(parent: Composite): void {
        this.detectPanel = new CheckLabelLogicalPanel(this, "Auto Detect", ToDatetime.AUTO_DETECT_PLAN);
        this.detectPanel.createControl(parent);
        widgets.setGridData(this.detectPanel, true, dialogs.ITEM_HEIGHT);
    }

    public notifyChanged(notification: Notification): void {
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        if (this.formatPanel.isChecked()) {
            if (this.formatPanel.getValue() === "") {
                this.setErrorMessage("Please specify format");
                return;
            }
        }
        this.okButton.setEnabled(true);
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(ToDatetime.FUNCTION_NAME, ToDatetimeDialog);