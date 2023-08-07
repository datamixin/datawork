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
import MapPlan from "webface/plan/MapPlan";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Notification from "webface/model/Notification";

import XText from "sleman/model/XText";
import XObject from "sleman/model/XObject";
import XAssignment from "sleman/model/XAssignment";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import ValueTextPanel from "padang/dialogs/guide/ValueTextPanel";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import RenameColumns from "padang/functions/dataset/RenameColumns";

export default class RenameColumnsDialog extends GuideDialog {

    private composite: Composite = null;
    private support: NameListSupport = null;
    private nameMap: XObject = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 3, 10, 10);

        let mapPlan = <MapPlan>RenameColumns.NAME_MAP_PLAN.getAssignedPlan();
        let keyPlan = mapPlan.getKey();
        this.support = new NameListSupport(this.conductor, keyPlan);
        this.createNameMapPart(this.composite);
    }

    private createNameMapPart(parent: Composite): void {

        this.nameMap = this.getObject(RenameColumns.NAME_MAP_PLAN);
        dialogs.createLabelGridHorizontal(parent, "Old Name");
        dialogs.createLabelGridHorizontal(parent, "New Name");
        this.createAddIcon(parent);

        let fields = this.nameMap.getFields();
        for (let field of fields) {
            this.createNameMappingPart(parent, field);
        }
    }

    private createAddIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-plus-circle-outline");
        icon.setOnSelection(() => {
            this.support.load((names: string[]) => {
                let name = guide.createText();
                guide.createObjectField(names[0], name, this.nameMap);
            });
        });
    }

    private createNameMappingPart(parent: Composite, field: XAssignment): void {
        let panel = new RenameMappingPanel(this.support, field);
        panel.createControl(this.composite);
        let layoutData = widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
        layoutData.horizontalSpan = 3;
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.ADD) {
            let field = <XAssignment>notification.getNewValue();
            this.createNameMappingPart(this.composite, field);
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
        let fields = this.nameMap.getFields();
        if (fields.size === 0) {
            this.setErrorMessage("Please add column to rename");
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

class RenameMappingPanel {

    private support: NameListSupport = null;
    private field: XAssignment = null;
    private composite: Composite = null;
    private oldNamePanel: NameListComboPanel = null;
    private newNamePanel: ValueTextPanel = null;

    constructor(support: NameListSupport, field: XAssignment) {
        this.support = support;
        this.field = field;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this.field);
        widgets.setGridLayout(this.composite, 3, 0, 0);

        this.createColumnCombo(this.composite);
        this.createNameText(this.composite);
        this.createRemoveIcon(this.composite);

    }

    private createColumnCombo(parent: Composite): void {
        let oldName = this.field.getName();
        this.oldNamePanel = new NameListComboPanel(this.support, oldName);
        this.oldNamePanel.createControl(parent);
        widgets.setGridData(this.oldNamePanel, true, true);
    }

    private createNameText(parent: Composite): void {
        let newName = <XText>this.field.getExpression();
        this.newNamePanel = new ValueTextPanel(newName);
        this.newNamePanel.createControl(parent);
        widgets.setGridData(this.newNamePanel, true, true);
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
factory.register(RenameColumns.FUNCTION_NAME, RenameColumnsDialog);