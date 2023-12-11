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
import Combo from "webface/widgets/Combo";
import Event from "webface/widgets/Event";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import Action from "webface/action/Action";

import ListPlan from "webface/plan/ListPlan";

import Conductor from "webface/wef/Conductor";

import GridLayout from "webface/layout/GridLayout";

import ListViewer from "webface/viewers/ListViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import Notification from "webface/model/Notification";

import LabelPopupPanel from "webface/ui/LabelPopupPanel";

import XList from "sleman/model/XList";
import XText from "sleman/model/XText";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import JoinRows from "padang/functions/dataset/JoinRows";

import ParameterPlan from "padang/plan/ParameterPlan";
import InteractionPlan from "padang/plan/InteractionPlan";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";
import DialogAction from "padang/dialogs/DialogAction";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";

export default class JoinRowsDialog extends GuideDialog {

    private static INIT_WIDTH = 640;
    private static INIT_HEIGHT = 480;
    private static ITEM_HEIGHT = 24;
    private static ICON_SIZE = 24;
    private static LABEL_WIDTH = 100;

    private factory = SlemanFactory.eINSTANCE;
    private leftColumnToKeyIcon: WebFontIcon = null;
    private leftKeyToColumnIcon: WebFontIcon = null;
    private rightColumnToKeyIcon: WebFontIcon = null;
    private rightKeyToColumnIcon: WebFontIcon = null;
    private selectedLeftColumn: XText = null;
    private selectedLeftKey: XText = null;
    private selectedRightColumn: XText = null;
    private selectedRightKey: XText = null;
    private joinType: XText = null;

    constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
        super(conductor, plan, options);
        this.setDialogSize(JoinRowsDialog.INIT_WIDTH, JoinRowsDialog.INIT_HEIGHT);
        this.setTitle("Join Rows");
        this.setMessage("Please specify join table and keys");
    }

    protected createControl(parent: Composite): void {

        let composite = new Composite(parent);
        let element = composite.getElement();
        element.addClass("table-join-dialog-container");

        let layout = new GridLayout(1, 10, 10, 10, 20);
        composite.setLayout(layout);

        this.createMatchPart(composite);
        this.createTypePart(composite);

    }

    private createMatchPart(parent: Composite): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "table-join-dialog-match-part");
        widgets.setGridLayout(composite, 2, 0, 0);
        widgets.setGridData(composite, true, true);

        this.createLeftPart(composite);
        this.createRightPart(composite);

    }

    private createLeftPart(parent: Composite): void {

        let composite = this.createSidePart(parent);
        let element = composite.getElement();
        element.addClass("table-join-dialog-left-side-part");

        let keys = JoinRows.LEFT_KEYS_PLAN;
        let columns = this.factory.createXList();
        this.createDatasetPart(composite, true, JoinRows.DATASET_PLAN, columns, keys, "Left Dataset", true);
        this.createMoveIconsPart(composite, columns, keys, true);
        this.createKeysPart(composite, true, columns, keys, "Left Keys", true);
    }

    private createRightPart(parent: Composite): void {

        let composite = this.createSidePart(parent);
        let element = composite.getElement();
        element.addClass("table-join-dialog-right-side-part");

        let keys = JoinRows.RIGHT_KEYS_PLAN;
        let columns = this.factory.createXList();
        this.createKeysPart(composite, false, columns, keys, "Right Keys", false);
        this.createMoveIconsPart(composite, columns, keys, false);
        this.createDatasetPart(composite, false, JoinRows.RIGHT_DATASET_PLAN, columns, keys, "Right Dataset", false);
    }

    private createSidePart(parent: Composite): Composite {
        let composite = new Composite(parent);
        widgets.setGridLayout(composite, 3, 0, 0, 0, 3);
        widgets.setGridData(composite, true, true);
        return composite;
    }

    private createDatasetPart(parent: Composite, implicit: boolean, datasetPlan: ParameterPlan,
        columns: XList, keysPlan: ParameterPlan, label: string, left: boolean): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "table-join-dialog-table-part");
        widgets.setGridLayout(composite, 1, 0, 0, 0, 3);
        widgets.setGridData(composite, true, true);

        dialogs.createLabelGridHorizontal(composite, label);
        this.createDatasetPopupPart(composite, implicit, datasetPlan, columns, keysPlan);
        this.createColumnsListPart(composite, implicit, datasetPlan, columns, keysPlan, left);

    }

    private createDatasetPopupPart(parent: Composite, implicit: boolean,
        datasetPlan: ParameterPlan, columns: XList, keysPlan: ParameterPlan): void {

        let panel = new LabelPopupPanel();
        panel.createControl(parent);
        if (implicit === true) {

            panel.setText("Current");
            panel.setEnabled(false);

        } else {

            panel.setPopupActions((callback: (actions: Action[]) => void) => {
                let specifiedPlan = datasetPlan.getAssignedPlan();
                let assignable = specifiedPlan.getAssignable();
                let request = new FormulaAssignableRequest(assignable);
                this.conductor.submit(request, (assignables: string[]) => {
                    let actions: Action[] = [];
                    for (let assignable of assignables) {
                        actions.push(new DialogAction(assignable, () => {
                            let reference = <XReference>pointer;
                            reference.setName(assignable);
                        }));
                    }
                    callback(actions);
                });
            });

            let pointer = this.getPointer(datasetPlan, false);
            if (pointer instanceof XReference) {
                let name = pointer.getName();
                panel.setText(name);
            } else {
                let factory = SlemanFactory.eINSTANCE;
                pointer = factory.createXReference();
                let name = datasetPlan.getName();
                this.setOption(name, pointer);
            }

            this.addNotificationCallback(pointer, (notification: Notification) => {

                let eventType = notification.getEventType();
                if (eventType === Notification.SET) {

                    let name = <string>notification.getNewValue();
                    panel.setText(name);

                    let keys = this.getList(keysPlan, false);
                    let keyElements = keys.getElements();
                    keyElements.clear();

                    let columnElements = columns.getElements();
                    columnElements.clear();

                    this.populateColumns(columns, keysPlan);
                    this.updatePageComplete();
                }
            });
        }

        let control = panel.getControl();
        widgets.css(control, "line-height", (JoinRowsDialog.ITEM_HEIGHT - 2) + "px");
        widgets.setGridData(control, true, JoinRowsDialog.ITEM_HEIGHT);

    }

    private createColumnsListPart(parent: Composite, implicit: boolean, datasetPlan: ParameterPlan,
        columns: XList, keysPlan: ParameterPlan, left: boolean): void {

        let viewer = new ListViewer(parent);
        viewer.setLabelProvider(new ColumnLabelProvider());
        viewer.setContentProvider(new ColumnContentProvider());
        viewer.setInput(columns);

        widgets.setGridData(viewer, true, true);

        this.populateColumns(columns, keysPlan);
        viewer.refresh();

        viewer.addListener(webface.MouseDoubleClick, <Listener>{
            handleEvent: (event: Event) => {

                let element = <XText><any>event.item;
                let columnElements = columns.getElements();
                columnElements.remove(element);

                let keys = this.getList(keysPlan, false);
                let keyElements = keys.getElements();
                keyElements.add(element);

                this.updatePageComplete();

            }
        });

        viewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                if (!selection.isEmpty()) {
                    if (left === true) {
                        this.selectedLeftColumn = selection.getFirstElement();
                        this.leftColumnToKeyIcon.setEnabled(true);
                    } else {
                        this.selectedRightColumn = selection.getFirstElement();
                        this.rightColumnToKeyIcon.setEnabled(true);
                    }
                } else {
                    if (left === true) {
                        this.leftColumnToKeyIcon.setEnabled(false);
                    } else {
                        this.rightColumnToKeyIcon.setEnabled(false);
                    }
                }
            }
        });

        this.addNotificationCallback(columns, (notification: Notification) => {
            viewer.refresh();
        });
    }

    private populateColumns(columns: XList, keysPlan: ParameterPlan): void {

        let listPlan = <ListPlan>keysPlan.getAssignedPlan();
        let elementPlan = listPlan.getElement();
        let assignable = elementPlan.getAssignable();
        let request = new FormulaAssignableRequest(assignable);
        this.conductor.submit(request, (assignables: string[]) => {

            for (let assignable of assignables) {

                let columnElements = columns.getElements();
                let factory = SlemanFactory.eINSTANCE;

                let exists = false;
                let keys = <XList>this.getList(keysPlan, false);
                let keyElements = keys.getElements();
                for (let keyElement of keyElements) {
                    if ((<XText>keyElement).getValue() === assignable) {
                        exists = true;
                        break;
                    }
                }

                if (exists === false) {
                    let text = factory.createXText(assignable);
                    columnElements.add(text);
                }
            }
        });
    }

    private createMoveIconsPart(parent: Composite, columns: XList, keysPlan: ParameterPlan, left: boolean): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "table-join-dialog-move-icons-part");
        widgets.setGridLayout(composite, 1, 0, 0, 0, 0);
        let layoutData = widgets.setGridData(composite, JoinRowsDialog.ICON_SIZE, JoinRowsDialog.ITEM_HEIGHT * 3);
        layoutData.verticalAlignment = webface.CENTER;

        this.createSpace(composite);
        this.createMoveIcon(composite, columns, keysPlan, left, left ? true : false, true);
        this.createMoveIcon(composite, columns, keysPlan, left, left ? false : true, false);
    }

    private createMoveIcon(parent: Composite, columns: XList,
        keysPlan: ParameterPlan, left: boolean, toRight: boolean, toKey: boolean): void {

        let icon = new WebFontIcon(parent);
        icon.setEnabled(false);
        icon.addClasses("mdi", "mdi-chevron-double-" + (toRight === true ? "right" : "left"));

        let element = icon.getElement();
        element.css("line-height", JoinRowsDialog.ICON_SIZE + "px");
        element.css("color", "#888");
        element.css("font-size", "18px");

        widgets.setGridData(icon, JoinRowsDialog.ICON_SIZE, JoinRowsDialog.ICON_SIZE);

        let keys = <XList>this.getList(keysPlan, false);
        let keyElements = keys.getElements();
        let columnElements = columns.getElements();

        icon.onSelection(() => {
            if (left === true) {
                if (toKey === true) {
                    columnElements.remove(this.selectedLeftColumn);
                    keyElements.add(this.selectedLeftColumn);
                } else {
                    keyElements.remove(this.selectedLeftKey);
                    columnElements.add(this.selectedLeftKey);
                }
            } else {
                if (toKey === true) {
                    columnElements.remove(this.selectedRightColumn);
                    keyElements.add(this.selectedRightColumn);
                } else {
                    keyElements.remove(this.selectedRightKey);
                    columnElements.add(this.selectedRightKey);
                }
            }
            this.updatePageComplete();
        });

        if (left === true) {
            if (toKey === true) {
                this.leftColumnToKeyIcon = icon;
            } else {
                this.leftKeyToColumnIcon = icon;
            }
        } else {
            if (toKey === true) {
                this.rightColumnToKeyIcon = icon;
            } else {
                this.rightKeyToColumnIcon = icon;
            }
        }
    }

    private createKeysPart(parent: Composite, implicit: boolean, columns: XList,
        keysPlan: ParameterPlan, label: string, left: boolean): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "table-join-dialog-keys-part");

        let layout = widgets.setGridLayout(composite, 1, 0, 0, 0, 0);
        layout.marginRight = 1;

        let layoutData = widgets.setGridData(composite, true, JoinRowsDialog.ITEM_HEIGHT * 4);
        layoutData.verticalAlignment = webface.CENTER;

        dialogs.createLabelGridHorizontal(composite, label);
        this.createKeyListPart(composite, columns, keysPlan, left);

    }

    private createKeyListPart(parent: Composite, columns: XList, keysPlan: ParameterPlan, left: boolean): void {

        let viewer = new ListViewer(parent);
        viewer.setLabelProvider(new ColumnLabelProvider());
        viewer.setContentProvider(new ColumnContentProvider());
        widgets.setGridData(viewer, true, JoinRowsDialog.ITEM_HEIGHT * 3);

        let keys = <XList>this.getList(keysPlan, false);
        let keyElements = keys.getElements();
        viewer.setInput(keys);

        viewer.addListener(webface.MouseDoubleClick, <Listener>{
            handleEvent: (event: Event) => {

                let element = <XText><any>event.item;
                keyElements.remove(element);

                let columnElements = columns.getElements();
                columnElements.add(element);

                this.updatePageComplete();

            }
        });

        viewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                if (!selection.isEmpty()) {
                    if (left === true) {
                        this.selectedLeftKey = selection.getFirstElement();
                        this.leftKeyToColumnIcon.setEnabled(true);
                    } else {
                        this.selectedRightKey = selection.getFirstElement();
                        this.rightKeyToColumnIcon.setEnabled(true);
                    }
                } else {
                    if (left === true) {
                        this.leftKeyToColumnIcon.setEnabled(false);
                    } else {
                        this.rightKeyToColumnIcon.setEnabled(false);
                    }
                }
            }
        });

        this.addNotificationCallback(keys, (notification: Notification) => {
            viewer.refresh();
        });
    }

    private createSpace(parent: Composite): void {
        let label = new Label(parent);
        widgets.css(label, "line-height", JoinRowsDialog.ITEM_HEIGHT + "px");
        widgets.setGridData(label, true, JoinRowsDialog.ITEM_HEIGHT);
    }

    private createTypePart(parent: Composite): void {

        let composite = new Composite(parent);
        widgets.addClass(composite, "padand-join-rows-dialog-type-part");
        widgets.setGridLayout(composite, 2, 0, 0, 0, 0);
        widgets.setGridData(composite, true, JoinRowsDialog.ITEM_HEIGHT);

        dialogs.createLabelGridWidth(composite, "Join Type", JoinRowsDialog.LABEL_WIDTH);
        this.createJoinTypeCombo(composite);
    }

    private createJoinTypeCombo(parent: Composite): void {

        let combo = new Combo(parent);

        let plan = JoinRows.TYPE.getAssignedPlan();
        let assignable = plan.getAssignable();
        let request = new FormulaAssignableRequest(assignable);
        this.conductor.submit(request, (assignables: any[]) => {
            combo.setItems(assignables);
        });

        this.joinType = this.getText(JoinRows.TYPE);
        let selected = this.joinType.getValue();
        combo.setSelectionText(selected);

        combo.onChanged((text: string) => {
            this.joinType.setValue(text);
        });

        widgets.setGridData(combo, true, true);

    }

    public notifyChanged(notification: Notification): void {
        this.updatePageComplete();
    }

    public updatePageComplete(): void {

        this.setErrorMessage(null);
        this.okButton.setEnabled(false);

        let leftKeys = this.getList(JoinRows.LEFT_KEYS_PLAN, false);
        let rightKeys = this.getList(JoinRows.RIGHT_KEYS_PLAN, false)
        let leftElements = leftKeys.getElements();
        let rightElements = rightKeys.getElements();
        if (leftElements.size === 0 || rightElements.size === 0) {
            this.setErrorMessage("Please define a join key");
            return;
        }

        if (leftElements.size !== rightElements.size) {
            this.setErrorMessage("Join key count mismatch");
            return;
        }

        this.okButton.setEnabled(true);
    }

}

class ColumnContentProvider implements ContentProvider {

    public getElementCount(input: XList): number {
        let elements = input.getElements();
        return elements.size;
    }

    public getElement(input: XList, index: number): any {
        let elements = input.getElements();
        return elements.get(index);
    }

}

class ColumnLabelProvider implements LabelProvider {

    public getText(element: XText): string {
        return element.getValue();
    }

}

let factory = GuideDialogFactory.getInstance();
factory.register(JoinRows.FUNCTION_NAME, JoinRowsDialog);