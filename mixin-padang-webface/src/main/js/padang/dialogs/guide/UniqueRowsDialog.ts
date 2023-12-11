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
import Label from "webface/widgets/Label";
import Event from "webface/widgets/Event";
import Combo from "webface/widgets/Combo";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

import ListPlan from "webface/plan/ListPlan";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XExpression from "sleman/model/XExpression";

import { creatorFactory } from "sleman/creator/CreatorFactory";

import UniqueRows from "padang/functions/dataset/UniqueRows";

import * as widgets from "padang/widgets/widgets";

import DialogAction from "padang/dialogs/DialogAction";
import GuideDialog from "padang/dialogs/guide/GuideDialog";

import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";

export abstract class UniqueRowsDialog extends GuideDialog {

    protected static INIT_WIDTH = 560;
    protected static INIT_HEIGHT = 420;

    protected static ICON_SIZE = 24;
    protected static ITEM_HEIGHT = 26;
    protected static INPUT_WIDTH = 160;

    private static MARGIN = 10;
    private static VERTICAL_SPACING = 20;

    private columns: string[] = null;
    private keyListPart: Composite = null;

    protected createControl(parent: Composite): void {

        let margin = UniqueRowsDialog.MARGIN;
        let composite = new Composite(parent);
        widgets.addClass(composite, "unique-rows-dialog-container");
        widgets.setGridLayout(composite, 1, margin, margin, margin, UniqueRowsDialog.VERTICAL_SPACING);

        this.createKeyListPart(composite);
        this.createExtendListPart(composite);
        this.relayout();

    }

    private createKeyListPart(parent: Composite): void {

        this.keyListPart = new Composite(parent, 0);
        widgets.addClass(this.keyListPart, "unique-rows-dialog-key-list-part");
        let layout = widgets.setGridLayout(this.keyListPart, 1, 0, 0);

        let width = UniqueRowsDialog.INPUT_WIDTH + UniqueRowsDialog.ICON_SIZE + layout.horizontalSpacing;
        widgets.setGridData(this.keyListPart, width, UniqueRowsDialog.ITEM_HEIGHT);

        let keyList = this.getList(UniqueRows.KEYS_PLAN);
        this.addNotificationCallback(keyList, (notification: Notification) => {

            let eventType = notification.getEventType();
            if (eventType === Notification.ADD) {

                let newValue = notification.getNewValue();
                this.createKeyPart(this.keyListPart, newValue);
                this.maintainKeyListPart(this.keyListPart, keyList, true);

            } else if (eventType === Notification.REMOVE) {

                let oldValue = notification.getOldValue();
                let children = this.keyListPart.getChildren();
                for (let child of children) {
                    let model = child.getData();
                    if (model === oldValue) {
                        child.dispose();
                        break;
                    }
                }
                this.maintainKeyListPart(this.keyListPart, keyList, false);
            }
            this.relayout();
        });
        this.createKeyHeaderPart(this.keyListPart, keyList);

        let elements = keyList.getElements();
        for (let element of elements) {
            this.createKeyPart(this.keyListPart, <XText>element);
        }

        this.maintainKeyListPart(this.keyListPart, keyList, false);

    }

    private createKeyHeaderPart(parent: Composite, keyList: XList): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "unique-rows-dialog-key-header-part");
        widgets.setGridLayout(composite, 2, 0, 0);
        widgets.setGridData(composite, true, UniqueRowsDialog.ITEM_HEIGHT);

        this.createLabel(composite, "Group By");
        this.createAddIcon(composite, "Add Group", keyList, (): XExpression => {
            let plan = <ListPlan>UniqueRows.KEYS_PLAN.getAssignedPlan();
            let element = plan.getElement();
            let elementPlan = element.getPlan();
            return creatorFactory.createDefaultValue(elementPlan);
        });

    }

    private createKeyPart(parent: Composite, text: XText): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "unique-rows-dialog-key-part");
        widgets.setGridLayout(composite, 2, 0, 0);
        widgets.setGridData(composite, true, UniqueRowsDialog.ITEM_HEIGHT);

        composite.setData(text);

        let name = text.getValue();
        this.createColumnCombo(composite, name, true, (name: string) => {
            text.setValue(name);
        });
        this.createMenuIcon(composite, text);
        composite.relayout();

    }

    private maintainKeyListPart(parent: Composite, list: XList, check: boolean): void {
        this.maintainListPart(parent, "No Group", list, check);
    }

    protected maintainListPart(parent: Composite, text: string, list: XList, check: boolean): void {

        let elements = list.getElements();
        if (elements.size === 0) {

            let label = new Label(parent);
            label.setText(text);

            let element = label.getElement();
            element.addClass("unique-rows-dialog-no-element-label");
            element.css("color", "#888");
            element.css("font-style", "italic");
            element.css("line-height", UniqueRowsDialog.ITEM_HEIGHT + "px");

            widgets.setGridData(label, true, true);

        } else {

            let children = parent.getChildren();
            for (let child of children) {
                if (child instanceof Label) {
                    child.dispose();
                    break;
                }
            }

        }

        parent.relayout();

        if (check === true) {
            this.updatePageComplete();
        }

    }

    protected abstract createExtendListPart(parent: Composite): void;

    protected createColumnCombo(parent: Composite, selected: string,
        group: boolean, callback: (name: string) => void): void {

        let combo = new Combo(parent);
        if (this.columns !== null) {
            combo.setItems(this.columns);
            this.presetSelection(combo, selected, this.columns, callback);
        } else {
            let plan = <ListPlan>UniqueRows.KEYS_PLAN.getAssignedPlan();
            let element = plan.getElement();
            let assignable = element.getAssignable();
            let request = new FormulaAssignableRequest(assignable);
            this.conductor.submit(request, (columns: any) => {
                combo.setItems(columns);
                this.columns = columns;
                this.presetSelection(combo, selected, this.columns, callback);
            });
        }

        widgets.setGridData(combo, UniqueRowsDialog.INPUT_WIDTH, UniqueRowsDialog.ITEM_HEIGHT);

        combo.onChanged((text: string) => {
            callback(text);
            this.updatePageComplete();
        });
    }

    protected presetSelection(combo: Combo, selected: string,
        values: any[], callback: (name: string) => void): void {
        if (selected === '' || selected === undefined || selected === null) {
            for (let value of values) {
                combo.setSelectionText(value);
                callback(value);
                break;
            }
        } else {
            combo.setSelectionText(selected);
        }
    }

    protected createLabel(parent: Composite, text: string): void {
        let label = new Label(parent);
        label.setText(text);
        widgets.css(label, "line-height", UniqueRowsDialog.ITEM_HEIGHT + "px");
        widgets.setGridData(label, UniqueRowsDialog.INPUT_WIDTH, UniqueRowsDialog.ITEM_HEIGHT);
    }

    protected createAddIcon(parent: Composite, text: string, list: XList, callback: () => XExpression): void {
        let icon = this.createIcon(parent, "mdi-plus-circle-outline");
        widgets.addClass(icon, "unique-rows-dialog-add-icon");
        icon.onSelection(() => {
            let value = callback();
            let element = list.getElements();
            element.add(value);
        });
    }

    protected createMenuIcon(composite: Composite, item: XExpression): void {
        let icon = this.createIcon(composite, "mdi-dots-horizontal");
        widgets.addClass(icon, "unique-rows-dialog-menu-icon");
        icon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                let action = new ListPopupAction(item);
                action.open(event);
            }
        });

    }

    private createIcon(parent: Composite, image: string): WebFontIcon {

        let icon = new WebFontIcon(parent);
        icon.addClasses("mdi", image);

        let element = icon.getElement();
        element.css("line-height", UniqueRowsDialog.ITEM_HEIGHT + "px");
        element.css("font-size", UniqueRowsDialog.ICON_SIZE + "px");
        element.css("cursor", "pointer");
        element.css("color", "#888");

        widgets.setGridData(icon, UniqueRowsDialog.ICON_SIZE, true);

        return icon;
    }

    public relayout(): void {
        let height = super.getBaseHeight();
        height += UniqueRowsDialog.MARGIN * 2 + UniqueRowsDialog.VERTICAL_SPACING;
        height += this.adjustHeight(this.keyListPart);
        height += this.adjustExtendHeight();
        height = Math.max(UniqueRowsDialog.INIT_HEIGHT, height);
        this.setDialogSize(UniqueRowsDialog.INIT_WIDTH, height);
    }

    protected adjustHeight(composite: Composite): number {

        let layout = <GridLayout>composite.getLayout();
        let children = composite.getChildren();
        let layoutData = <GridData>composite.getLayoutData();
        let length = children.length;
        layoutData.heightHint = length * UniqueRowsDialog.ITEM_HEIGHT + (length - 1) * layout.verticalSpacing;
        composite.relayout();

        let parent = composite.getParent();
        parent.relayout();

        return layoutData.heightHint;
    }

    protected abstract adjustExtendHeight(): number;

    public abstract updatePageComplete(): void;

}

class ListPopupAction extends PopupAction {

    private item: XExpression = null;

    constructor(item: XExpression) {
        super();
        this.item = item;
    }

    public getActions(): Action[] {
        let actions: Action[] = [];
        actions.push(new DialogAction("Remove", () => {
            util.remove(this.item);
        }));
        return actions;
    }

}

export default UniqueRowsDialog;