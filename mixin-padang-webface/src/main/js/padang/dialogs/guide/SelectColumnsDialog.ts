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
import * as util from "webface/model/util";

import ListPlan from "webface/plan/ListPlan";

import Conductor from "webface/wef/Conductor";

import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Selection from "webface/viewers/Selection";
import ListViewer from "webface/viewers/ListViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import Notification from "webface/model/Notification";

import XText from "sleman/model/XText";
import XList from "sleman/model/XList";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import InteractionPlan from "padang/plan/InteractionPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import SelectColumns from "padang/functions/dataset/SelectColumns";

export default class SelectColumnsDialog extends GuideDialog {

    public static ICON_SIZE = 24;
    public static BUTTON_WIDTH = 72;
    public static BUTTON_HEIGHT = 30;

    private static INIT_WIDTH = 540;
    private static INIT_HEIGHT = 420;

    private composite: Composite = null;
    private sourceList: NameListSupport = null;
    private viewers: ListViewer[] = [];
    private excludeList: XList = null;
    private includeList: XList = null;
    private includeViewer: ListViewer = null;
    private includeAll: WebFontIcon = null;
    private includeOne: WebFontIcon = null;
    private excludeAll: WebFontIcon = null;
    private excludeOne: WebFontIcon = null;
    private selectedInclude: XText = null;
    private selectedExclude: XText = null;
    private firstButton: Button = null;
    private prevButton: Button = null;
    private nextButton: Button = null;
    private lastButton: Button = null;

    constructor(conductor: Conductor, plan: InteractionPlan, options: Map<string, XExpression>) {
        super(conductor, plan, options);
        this.setDialogSize(SelectColumnsDialog.INIT_WIDTH, SelectColumnsDialog.INIT_HEIGHT);
        this.setTitle("Select Columns");
        this.setMessage("Please specify join table and keys");
    }

    protected createControl(parent: Composite): void {

        this.composite = new Composite(parent);
        widgets.setGridLayout(this.composite, 4);

        dialogs.createLabelGridHorizontal(this.composite, "Excludes");
        dialogs.createSpaceGridWidth(this.composite, SelectColumnsDialog.ICON_SIZE);
        dialogs.createLabelGridHorizontal(this.composite, "Includes");
        dialogs.createSpaceGridWidth(this.composite, SelectColumnsDialog.BUTTON_WIDTH);

        this.populateSelection();

        this.createExcludesPart(this.composite);
        this.createInExButtonPart(this.composite);
        this.createIncludesPart(this.composite);
        this.createMoveButtonPart(this.composite);
    }

    private populateSelection(): void {
        let factory = SlemanFactory.eINSTANCE;
        this.excludeList = factory.createXList();
        this.includeList = this.getList(SelectColumns.VALUES_PLAN);
    }

    private createExcludesPart(parent: Composite): void {

        let viewer = this.createViewer(parent, false);

        let listPlan = <ListPlan>SelectColumns.VALUES_PLAN.getAssignedPlan();
        let elementPlan = listPlan.getElement();
        this.sourceList = new NameListSupport(this.conductor, elementPlan);
        this.sourceList.load((names: string[]) => {

            let factory = SlemanFactory.eINSTANCE;
            let selections = this.includeList.getElements();
            if (selections.size === 0) {

                for (let name of names) {
                    let selected = factory.createXText(name);
                    selections.add(selected);
                }

            } else {

                let elements = this.excludeList.getElements();
                for (let name of names) {
                    let exists = false;
                    for (let selection of selections) {
                        let selected = <XText>selection;
                        if (selected.getValue() === name) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        let text = factory.createXText(name);
                        elements.add(text);
                    }
                }
            }

            viewer.setInput(this.excludeList);
            this.addContentAdapter(this.excludeList);
            this.refreshViewers();
        });

        widgets.setGridData(viewer, true, true);

    }

    private createViewer(parent: Composite, include: boolean): ListViewer {
        let viewer = new ListViewer(parent);
        viewer.setLabelProvider(new ColumnLabelProvider());
        viewer.setContentProvider(new ColumnContentProvider());
        viewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                if (!selection.isEmpty()) {
                    if (include === true) {
                        this.selectedInclude = selection.getFirstElement();
                        this.excludeOne.setEnabled(true);
                    } else {
                        this.selectedExclude = selection.getFirstElement();
                        this.includeOne.setEnabled(true);
                    }
                } else {
                    if (include === true) {
                        this.excludeOne.setEnabled(false);
                    } else {
                        this.includeOne.setEnabled(false);
                    }
                }
            }
        });
        this.viewers.push(viewer);
        return viewer;
    }

    private createInExButtonPart(parent: Composite): void {

        let composite = new Composite(parent);
        widgets.setGridLayout(composite, 1, 0, 0);
        widgets.setGridData(composite, SelectColumnsDialog.ICON_SIZE, true);
        this.includeAll = this.createIcon(composite, this.excludeList, true, true);
        this.includeOne = this.createIcon(composite, this.excludeList, true, false);
        this.excludeOne = this.createIcon(composite, this.includeList, false, false);
        this.excludeAll = this.createIcon(composite, this.includeList, false, true);

    }

    private createIcon(parent: Composite, list: XList, inc: boolean, all: boolean): WebFontIcon {

        let icon = new WebFontIcon(parent);
        icon.setEnabled(false);
        icon.addClasses("mdi", "mdi-chevron-" + (all ? "triple" : "double") + "-" + (inc ? "right" : "left"));

        let element = icon.getElement();
        element.css("line-height", SelectColumnsDialog.ICON_SIZE + "px");
        element.css("color", "#888");
        element.css("font-size", "18px");

        widgets.setGridData(icon, SelectColumnsDialog.ICON_SIZE, SelectColumnsDialog.ICON_SIZE);

        let elements = list.getElements();
        icon.onSelection(() => {
            if (all === true) {
                let list = elements.toArray();
                for (let element of list) {
                    elements.remove(element);
                }
            } else {
                if (inc === true) {
                    elements.remove(this.selectedExclude);
                } else {
                    elements.remove(this.selectedInclude);
                }
            }
            this.updatePageComplete();
        });
        return icon;

    }

    private createIncludesPart(parent: Composite): void {

        this.includeViewer = this.createViewer(parent, true);
        this.includeViewer.setInput(this.includeList);
        widgets.setGridData(this.includeViewer, true, true);

    }

    private createMoveButtonPart(parent: Composite): void {

        let composite = new Composite(parent);
        widgets.setGridLayout(composite, 1, 0, 0);
        widgets.setGridData(composite, SelectColumnsDialog.BUTTON_WIDTH, true);
        this.firstButton = this.createButton(composite, "First", -3);
        this.prevButton = this.createButton(composite, "Prev", -1);
        this.nextButton = this.createButton(composite, "Next", +2);
        this.lastButton = this.createButton(composite, "Last", +3);

        this.includeViewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                this.firstButton.setEnabled(false);
                this.prevButton.setEnabled(false);
                this.nextButton.setEnabled(false);
                this.lastButton.setEnabled(false);
                if (!selection.isEmpty()) {
                    let element = selection.getFirstElement();
                    let elements = this.includeList.getElements();
                    if (elements.size > 1) {
                        let index = elements.indexOf(element);
                        if (index === 0) {
                            this.nextButton.setEnabled(true);
                            this.lastButton.setEnabled(true);
                        } else if (index === elements.size - 1) {
                            this.firstButton.setEnabled(true);
                            this.prevButton.setEnabled(true);
                        } else {
                            this.firstButton.setEnabled(true);
                            this.prevButton.setEnabled(true);
                            this.nextButton.setEnabled(true);
                            this.lastButton.setEnabled(true);
                        }
                    }
                }
            }
        });
    }

    private createButton(parent: Composite, text: string, move: number): Button {
        let button = new Button(parent);
        button.setText(text);
        widgets.setGridData(button, true, SelectColumnsDialog.BUTTON_HEIGHT);
        button.onSelection(() => {
            let elements = this.includeList.getElements();
            if (move === -3) {
                elements.move(this.selectedInclude, 0);
            } else if (move === +3) {
                elements.move(this.selectedInclude, elements.size);
            } else {
                let index = elements.indexOf(this.selectedInclude);
                elements.move(this.selectedInclude, index + move);
            }
            let selection = new Selection(this.selectedInclude);
            this.includeViewer.setSelection(selection);
        });
        return button;

    }

    private refreshViewers(): void {
        for (let viewer of this.viewers) {
            viewer.refresh();
        }
        let excludeAll = this.includeList.getElementCount() > 0;
        let includeAll = this.excludeList.getElementCount() > 0;
        this.excludeAll.setEnabled(excludeAll);
        this.includeAll.setEnabled(includeAll);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let notifier = notification.getNotifier();
        if (eventType === Notification.REMOVE) {
            let element = <XText>notification.getOldValue();
            element = <XText>util.copy(element);
            if (notifier === this.includeList) {
                let elements = this.excludeList.getElements();
                elements.add(element);
            } else {
                let elements = this.includeList.getElements();
                elements.add(element);
            }
            this.refreshViewers();
        } else if (eventType === Notification.MOVE) {
            this.refreshViewers();
        }
        this.updatePageComplete();
    }

    public updatePageComplete(): void {
        this.setErrorMessage(null);
        let elements = this.includeList.getElements();
        if (elements.size === 0) {
            this.setErrorMessage("Please add column to select");
            return;
        }
        this.okButton.setEnabled(true);
    }

}

class ColumnContentProvider implements ContentProvider {

    public getElementCount(input: XList): number {
        return input.getElementCount();
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
factory.register(SelectColumns.FUNCTION_NAME, SelectColumnsDialog);