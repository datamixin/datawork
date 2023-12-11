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
import Notification from "webface/model/Notification";

import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import CheckLabelLogicalPanel from "padang/dialogs/guide/CheckLabelLogicalPanel";
import LabelNameListComboPanel from "padang/dialogs/guide/LabelNameListComboPanel";
import LabelFormulaEditorPanel from "padang/dialogs/guide/LabelFormulaEditorPanel";

import ReplaceValue from "padang/functions/dataset/ReplaceValue";

export default class ReplaceValueDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private column: XText = null;
    private targetPanel: LabelFormulaEditorPanel = null;
    private replacementPanel: LabelFormulaEditorPanel = null;
    private regexPanel: CheckLabelLogicalPanel = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1, 10, 10);

        this.support = new NameListSupport(this.conductor, ReplaceValue.COLUMN_PLAN);

        this.createColumnPart(this.composite);
        this.createTargetPart(this.composite);
        this.createReplacementPart(this.composite);
        this.createRegexPart(this.composite);

    }

    private createColumnPart(parent: Composite): void {
        this.column = this.getText(ReplaceValue.COLUMN_PLAN);
        let panel = new LabelNameListComboPanel("Column", this.support, this.column);
        panel.createControl(parent);
        widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
    }

    private createTargetPart(parent: Composite): void {
        this.targetPanel = new LabelFormulaEditorPanel("Target", this, ReplaceValue.TARGET_PLAN);
        this.targetPanel.createControl(parent);
        widgets.setGridData(this.targetPanel, true, dialogs.ITEM_HEIGHT);
    }

    private createReplacementPart(parent: Composite): void {
        this.replacementPanel = new LabelFormulaEditorPanel("Replacement", this, ReplaceValue.REPLACEMENT_PLAN);
        this.replacementPanel.createControl(parent);
        widgets.setGridData(this.replacementPanel, true, dialogs.ITEM_HEIGHT);
    }

    private createRegexPart(parent: Composite): void {
        this.regexPanel = new CheckLabelLogicalPanel(this, "Regex", ReplaceValue.REGEX_PLAN);
        this.regexPanel.createControl(parent);
        widgets.setGridData(this.regexPanel, true, dialogs.ITEM_HEIGHT);
    }

    public notifyChanged(notification: Notification): void {
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        this.okButton.setEnabled(true);
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(ReplaceValue.FUNCTION_NAME, ReplaceValueDialog);