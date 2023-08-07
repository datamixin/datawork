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

import Notification from "webface/model/Notification";

import XReference from "sleman/model/XReference";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import FromDataset from "padang/functions/source/FromDataset";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import LabelNameListComboPanel from "padang/dialogs/guide/LabelNameListComboPanel";

export default class FromDatasetDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private dataset: XReference = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 1);

        this.createDatasetPart(this.composite);

    }

    private createDatasetPart(parent: Composite): void {
        this.support = new NameListSupport(this.conductor, FromDataset.DATASET_PLAN);
        this.dataset = <XReference>this.getPointer(FromDataset.DATASET_PLAN, true);
        let panel = new LabelNameListComboPanel("Dataset", this.support, this.dataset);
        panel.createControl(parent);
        widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
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
factory.register(FromDataset.FUNCTION_NAME, FromDatasetDialog);