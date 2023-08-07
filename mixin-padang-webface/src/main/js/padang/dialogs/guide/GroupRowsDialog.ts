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
import Text from "webface/widgets/Text";
import Combo from "webface/widgets/Combo";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/util/functions";

import Notification from "webface/model/Notification";

import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XCall from "sleman/model/XCall";
import XAlias from "sleman/model/XAlias";
import XObject from "sleman/model/XObject";
import XForeach from "sleman/model/XForeach";
import XArgument from "sleman/model/XArgument";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as widgets from "padang/widgets/widgets";

import InteractionPlan from "padang/plan/InteractionPlan";

import GroupRows from "padang/functions/dataset/GroupRows";

import UniqueRowsDialog from "padang/dialogs/guide/UniqueRowsDialog";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

export default class GroupRowsDialog extends UniqueRowsDialog {

    private valueListPart: Composite = null;

    constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
        super(conductor, plan, options);
        this.setDialogSize(GroupRowsDialog.INIT_WIDTH, GroupRowsDialog.INIT_HEIGHT);
        this.setWindowTitle("Group Dialog");
        this.setTitle("Group Function");
        this.setMessage("Please specify group keys and values");
    }

    protected createExtendListPart(parent: Composite): void {

        this.valueListPart = new Composite(parent, 1);
        widgets.addClass(this.valueListPart, "table-group-dialog-value-list-part");
        widgets.setGridLayout(this.valueListPart, 1, 0, 0);
        widgets.setGridData(this.valueListPart, true, GroupRowsDialog.ITEM_HEIGHT);

        let valueList = this.getList(GroupRows.VALUES_PLAN);
        this.addNotificationCallback(valueList, (notification: Notification) => {

            let eventType = notification.getEventType();
            if (eventType === Notification.ADD) {

                let newValue = notification.getNewValue();
                this.createValuePart(this.valueListPart, newValue);
                this.maintainValueListPart(this.valueListPart, valueList, true);

            } else if (eventType === Notification.REMOVE) {

                let oldValue = notification.getOldValue();
                let children = this.valueListPart.getChildren();
                for (let child of children) {
                    let model = child.getData();
                    if (model === oldValue) {
                        child.dispose();
                        break;
                    }
                }
                this.maintainValueListPart(this.valueListPart, valueList, true);
            }
        });

        this.createValueHeaderPart(this.valueListPart, valueList);

        let elements = valueList.getElements();
        for (let element of elements) {
            this.createValuePart(this.valueListPart, <XObject>element);
        }

        this.maintainValueListPart(this.valueListPart, valueList, false);
    }

    private createValueHeaderPart(parent: Composite, valueList: XList): void {

        let composite = new Composite(parent);
        let element = composite.getElement();
        element.addClass("table-group-dialog-value-list-header-part");

        let layout = new GridLayout(4, 0, 0);
        composite.setLayout(layout);

        let layoutData = new GridData(true, GroupRowsDialog.ITEM_HEIGHT);
        composite.setLayoutData(layoutData);

        this.createLabel(composite, "Function");
        this.createLabel(composite, "Column");
        this.createLabel(composite, "Alias");
        this.createAddIcon(composite, "Add Aggregate", valueList, (): XExpression => {

            let elements = valueList.getElements();
            let valueNames: string[] = [];
            for (let element of elements) {
                let aggregate = <XObject>element;
                let alias = <XText>aggregate.getField(GroupRows.ALIAS);
                let value = alias.getValue();
                valueNames.push(value);
            }

            let factory = SlemanFactory.eINSTANCE;

            let foreach = factory.createXForeach();
            let call = factory.createXCall();
            let callee = factory.createXPointer(GroupRows.SUM);
            call.setCallee(callee);
            let args = call.getArguments();
            let alias = factory.createXAlias();
            let arg = factory.createXArgument(alias);
            args.add(arg);
            foreach.setExpression(call);

            let name = functions.getIncrementedName("Value", valueNames);
            let valueText = factory.createXText(name);
            let value = factory.createXObject();
            let fields = value.getFields();
            let aliasField = factory.createXAssignment(GroupRows.ALIAS, valueText);
            let aggregateField = factory.createXAssignment(GroupRows.AGGREGATE, foreach);
            fields.add(aliasField);
            fields.add(aggregateField);

            return value;
        });

    }

    private maintainValueListPart(parent: Composite, list: XList, check: boolean): void {
        this.maintainListPart(parent, "No Values", list, check);
    }

    private createValuePart(parent: Composite, value: XObject): void {

        let composite = new Composite(parent);
        let element = composite.getElement();
        element.addClass("table-group-dialog-group-value-part");

        composite.setData(value);

        let layout = new GridLayout(4, 0, 0);
        composite.setLayout(layout);

        let layoutData = new GridData(true, GroupRowsDialog.ITEM_HEIGHT);
        composite.setLayoutData(layoutData);

        let foreach = <XForeach>value.getField(GroupRows.AGGREGATE);
        let call = <XCall>foreach.getExpression()
        let args = call.getArguments();
        let callee = call.getCallee();
        let selectedFunction = callee.toLiteral();
        let arg = <XArgument>args.get(0);
        let aggColumn = <XAlias>arg.getExpression();
        let aggColumnName = aggColumn.getName();
        let aggAlias = <XText>value.getField(GroupRows.ALIAS);
        let aggAliasName = aggAlias.getValue();

        this.createFunctionCombo(composite, selectedFunction, (qualifiedName: string) => {
            let factory = SlemanFactory.eINSTANCE;
            let callee = factory.createXPointer(qualifiedName);
            call.setCallee(callee);
        });
        this.createColumnCombo(composite, aggColumnName, false, (name: string) => {
            aggColumn.setName(name);
        });
        this.createAliasText(composite, aggAliasName, (name: string) => {
            aggAlias.setValue(name);
        });
        this.createMenuIcon(composite, value);
        super.relayout();
    }

    private createFunctionCombo(parent: Composite, selected: string, callback: (name: string) => void): void {

        let combo = new Combo(parent);
        combo.setItems(GroupRows.FUNCTIONS);
        this.presetSelection(combo, selected, GroupRows.FUNCTIONS, callback);

        let layoutData = new GridData(GroupRowsDialog.INPUT_WIDTH, true);
        combo.setLayoutData(layoutData);

        combo.onChanged((text: string) => {
            callback(text);
            this.updatePageComplete();
        });
    }

    private createAliasText(parent: Composite, name: string, callback: (name: string) => void): void {

        let text = new Text(parent);
        text.setText(name);

        let element = text.getElement();
        element.css("line-height", (GroupRowsDialog.ITEM_HEIGHT - 1) + "px");

        let layoutData = new GridData(GroupRowsDialog.INPUT_WIDTH, true);
        text.setLayoutData(layoutData);

        text.onModify((text: string) => {
            callback(text);
            this.updatePageComplete();
        });
    }

    protected adjustExtendHeight(): number {
        return this.adjustHeight(this.valueListPart);
    }

    public updatePageComplete(): void {

        this.setErrorMessage(null);
        this.okButton.setEnabled(false);

        // Pastikan minimal ada key atau value
        let keys = this.getList(GroupRows.KEYS_PLAN);
        let values = this.getList(GroupRows.VALUES_PLAN);
        let keyCount = keys.getElementCount();
        let valueCount = values.getElementCount();
        if (keyCount === 0 || valueCount === 0) {
            this.setErrorMessage("Please define a key or a value");
            return;
        }

        this.okButton.setEnabled(true);
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(GroupRows.FUNCTION_NAME, GroupRowsDialog);