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
import ListPlan from "webface/plan/ListPlan";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Notification from "webface/model/Notification";

import XList from "sleman/model/XList";
import XReference from "sleman/model/XReference";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import UnionRows from "padang/functions/dataset/UnionRows";

export default class UnionRowsDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private keys: XList = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 2, 10, 10);

        let listPlan = <ListPlan>UnionRows.OTHERS_PLAN.getAssignedPlan();
        let elementPlan = listPlan.getElement();
        this.support = new NameListSupport(this.conductor, elementPlan);
        this.createOthersPart(this.composite);
    }

    private createOthersPart(parent: Composite): void {

        this.keys = this.getList(UnionRows.OTHERS_PLAN);
        dialogs.createLabelGridHorizontal(parent, "Dataset Name");
        this.createAddIcon(parent);

        let elements = this.keys.getElements();
        for (let element of elements) {
            this.createElementPart(parent, <XReference>element);
        }

    }

    private createAddIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-plus-circle-outline");
        icon.setOnSelection(() => {
            this.support.load((names: string[]) => {
                guide.createListReference(names[0], this.keys);
            });
        });
    }

    private createElementPart(parent: Composite, pointer: XReference): void {
        let panel = new DatasetNamePanel(this.support, pointer);
        panel.createControl(this.composite);
        let layoutData = widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
        layoutData.horizontalSpan = 3;
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.ADD) {
            let element = <XReference>notification.getNewValue();
            this.createElementPart(this.composite, element);
        } else if (eventType === Notification.REMOVE) {
            let element = <XReference>notification.getOldValue();
            let control = guide.getChildrenByData(this.composite, element);
            control.dispose();
        }
        this.composite.relayout();
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        let elements = this.keys.getElements();
        if (elements.size === 0) {
            this.setErrorMessage("Please add dataset to union");
            return;
        }
        this.okButton.setEnabled(true);
    }

}

class DatasetNamePanel {

    private support: NameListSupport = null;
    private pointer: XReference = null;
    private composite: Composite = null;
    private namePanel: NameListComboPanel = null;

    constructor(support: NameListSupport, pointer: XReference) {
        this.support = support;
        this.pointer = pointer;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this.pointer);
        widgets.setGridLayout(this.composite, 2, 0, 0);

        this.createColumnCombo(this.composite);
        this.createRemoveIcon(this.composite);

    }

    private createColumnCombo(parent: Composite): void {
        this.namePanel = new NameListComboPanel(this.support, this.pointer);
        this.namePanel.createControl(parent);
        widgets.setGridData(this.namePanel, true, true);
    }

    private createRemoveIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-close-circle-outline");
        icon.setOnSelection(() => {
            guide.remove(this.pointer);
        });
    }

    public getControl(): Control {
        return this.composite;
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(UnionRows.FUNCTION_NAME, UnionRowsDialog);