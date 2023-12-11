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
import Check from "webface/widgets/Check";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ListPlan from "webface/plan/ListPlan";
import EntityPlan from "webface/plan/EntityPlan";

import Notification from "webface/model/Notification";

import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XObject from "sleman/model/XObject";
import XLogical from "sleman/model/XLogical";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import SortRows from "padang/functions/dataset/SortRows";
import ColumnFunction from "padang/functions/dataset/ColumnFunction";

export default class SortRowsDialog extends GuideDialog {

    private factory = SlemanFactory.eINSTANCE;
    private composite: Composite = null;
    private support: NameListSupport = null;
    private orderList: XList = null;

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 3, 10, 10);

        let mapPlan = <ListPlan>SortRows.ORDERS_PLAN.getAssignedPlan();
        let elementPlan = mapPlan.getElement();
        let orderPlan = <EntityPlan>elementPlan.getPlan();
        let fields = orderPlan.getFields();
        let fieldPlan = fields.get(ColumnFunction.SPECIFIED_PLAN.getName());
        this.support = new NameListSupport(this.conductor, fieldPlan);
        this.createNameMapPart(this.composite);
    }

    private createNameMapPart(parent: Composite): void {

        this.orderList = this.getList(SortRows.ORDERS_PLAN, true);
        dialogs.createLabelGridHorizontal(parent, "Column");
        dialogs.createLabelGridHorizontal(parent, "Ascending");
        this.createAddIcon(parent);

        let elements = this.orderList.getElements();
        for (let element of elements) {
            this.createColumnOrderPanel(parent, <XObject>element);
        }
    }

    private createAddIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-plus-circle-outline");
        icon.setOnSelection(() => {
            this.support.load((names: string[]) => {

                // Column
                let columnKey = ColumnFunction.SPECIFIED_PLAN.getName();
                let columnValue = this.factory.createXText(names[0]);
                let columnField = this.factory.createXAssignment(columnKey, columnValue);

                // Ascending
                let ascendingValue = this.factory.createXLogical(true);
                let ascendingField = this.factory.createXAssignment(SortRows.ASCENDING, ascendingValue);

                // Order
                let order = this.factory.createXObject(columnField, ascendingField);
                let elements = this.orderList.getElements();
                elements.add(order);

            });
        });
    }

    private createColumnOrderPanel(parent: Composite, order: XObject): void {
        let panel = new ColumnOrderPanel(this.support, order);
        panel.createControl(this.composite);
        let layoutData = widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
        layoutData.horizontalSpan = 3;
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.ADD) {
            let order = <XObject>notification.getNewValue();
            this.createColumnOrderPanel(this.composite, order);
        } else if (eventType === Notification.REMOVE) {
            let order = <XObject>notification.getOldValue();
            let control = guide.getChildrenByData(this.composite, order);
            control.dispose();
        }
        this.composite.relayout();
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        let orders = this.orderList.getElements();
        if (orders.size === 0) {
            this.setErrorMessage("Please add column to change");
            return;
        }
        for (let element of orders) {
            let order = <XObject>element;
            let column = <XText>order.getField(ColumnFunction.SPECIFIED_PLAN.getName());
            let name = column.getValue();
            if (name === null || name === undefined || name === "") {
                this.setErrorMessage("Please new name for column '" + name + "'");
                return;
            }
        }
        this.okButton.setEnabled(true);
    }

}

class ColumnOrderPanel {

    private support: NameListSupport = null;
    private order: XObject = null;
    private composite: Composite = null;
    private columnPanel: NameListComboPanel = null;
    private ascendingCheck: Check = null;

    constructor(support: NameListSupport, order: XObject) {
        this.support = support;
        this.order = order;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this.order);
        widgets.setGridLayout(this.composite, 3, 0, 0);

        this.createColumnCombo(this.composite);
        this.createAscendingCheck(this.composite);
        this.createRemoveIcon(this.composite);

    }

    private createColumnCombo(parent: Composite): void {
        let column = <XText>this.order.getField(ColumnFunction.SPECIFIED_PLAN.getName());
        this.columnPanel = new NameListComboPanel(this.support, column);
        this.columnPanel.createControl(parent);
        widgets.setGridData(this.columnPanel, true, true);
    }

    private createAscendingCheck(parent: Composite): void {

        this.ascendingCheck = new Check(parent);
        widgets.setGridData(this.ascendingCheck, true, true);

        let logical = <XLogical>this.order.getField(SortRows.ASCENDING);
        let ascending = logical.getValue();
        this.ascendingCheck.setChecked(ascending);

        this.ascendingCheck.onSelection((checked: boolean) => {
            logical.setValue(checked);
        });

    }

    private createRemoveIcon(parent: Composite): void {
        let icon = dialogs.createIconGrid(this.composite, "mdi-close-circle-outline");
        icon.setOnSelection(() => {
            guide.remove(this.order);
        });
    }

    public getControl(): Control {
        return this.composite;
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(SortRows.FUNCTION_NAME, SortRowsDialog);