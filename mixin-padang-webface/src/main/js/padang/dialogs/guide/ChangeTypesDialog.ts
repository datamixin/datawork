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
import Combo from "webface/widgets/Combo";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import MapPlan from "webface/plan/MapPlan";

import Notification from "webface/model/Notification";

import VisageType from "bekasi/visage/VisageType";

import XText from "sleman/model/XText";
import XObject from "sleman/model/XObject";
import XAssignment from "sleman/model/XAssignment";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import ChangeTypes from "padang/functions/dataset/ChangeTypes";

export default class ChangeTypesDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private typeMap: XObject = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 3, 10, 10);

        let mapPlan = <MapPlan>ChangeTypes.TYPE_MAP_PLAN.getAssignedPlan();
        let keyPlan = mapPlan.getKey();
        this.support = new NameListSupport(this.conductor, keyPlan);
        this.createNameMapPart(this.composite);
    }

    private createNameMapPart(parent: Composite): void {

        this.typeMap = this.getObject(ChangeTypes.TYPE_MAP_PLAN);
        dialogs.createLabelGridHorizontal(parent, "Column");
        dialogs.createLabelGridHorizontal(parent, "Type");
        this.createAddIcon(parent);

        let fields = this.typeMap.getFields();
        for (let field of fields) {
            this.createNameTypePanel(parent, field);
        }
    }

    private createAddIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-plus-circle-outline");
        icon.setOnSelection(() => {
            this.support.load((names: string[]) => {
                let name = guide.createText();
                guide.createObjectField(names[0], name, this.typeMap);
            });
        });
    }

    private createNameTypePanel(parent: Composite, field: XAssignment): void {
        let panel = new NameTypePanel(this.support, field);
        panel.createControl(this.composite);
        let layoutData = widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
        layoutData.horizontalSpan = 3;
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.ADD) {
            let field = <XAssignment>notification.getNewValue();
            this.createNameTypePanel(this.composite, field);
        } else if (eventType === Notification.REMOVE) {
            let field = <XAssignment>notification.getOldValue();
            let control = guide.getChildrenByData(this.composite, field);
            control.dispose();
        }
        this.composite.relayout();
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        let fields = this.typeMap.getFields();
        if (fields.size === 0) {
            this.setErrorMessage("Please add column to change");
            return;
        }
        for (let field of fields) {
            let identifier = field.getName();
            let name = identifier.getName();
            let text = <XText>field.getExpression();
            let value = text.getValue();
            if (value === null || value === "") {
                this.setErrorMessage("Please new name for column '" + name + "'");
                return;
            }
        }
        this.okButton.setEnabled(true);
    }

}

class NameTypePanel {

    private support: NameListSupport = null;
    private field: XAssignment = null;
    private composite: Composite = null;
    private columnPanel: NameListComboPanel = null;
    private typeCombo: Combo = null;

    constructor(support: NameListSupport, field: XAssignment) {
        this.support = support;
        this.field = field;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this.field);
        widgets.setGridLayout(this.composite, 3, 0, 0);

        this.createColumnCombo(this.composite);
        this.createTypeCombo(this.composite);
        this.createRemoveIcon(this.composite);

    }

    private createColumnCombo(parent: Composite): void {
        let oldName = this.field.getName();
        this.columnPanel = new NameListComboPanel(this.support, oldName);
        this.columnPanel.createControl(parent);
        widgets.setGridData(this.columnPanel, true, true);
    }

    private createTypeCombo(parent: Composite): void {

        this.typeCombo = new Combo(parent);
        widgets.setGridData(this.typeCombo, true, true);

        let labels = Object.keys(VisageType.LABEL_TYPE_MAP);
        this.typeCombo.setItems(labels);

        let text = <XText>this.field.getExpression();
        let type = text.getValue();
        let label = VisageType.getLabel(type);
        this.typeCombo.setSelectionText(label);

        this.typeCombo.onChanged((label: string) => {
            let newType = VisageType.LABEL_TYPE_MAP[label];
            if (type !== newType) {
                text.setValue(newType);
            }
        });

    }

    private createRemoveIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-close-circle-outline");
        icon.setOnSelection(() => {
            guide.remove(this.field);
        });
    }

    public getControl(): Control {
        return this.composite;
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(ChangeTypes.FUNCTION_NAME, ChangeTypesDialog);