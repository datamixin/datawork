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
import Map from "webface/util/Map";

import Panel from "webface/wef/Panel";
import SelectionPart from "webface/wef/SelectionPart";
import WidthAdjustablePart from "webface/wef/WidthAdjustablePart";
import DragParticipantPart from "webface/wef/DragParticipantPart";

import * as webface from "webface/webface";

import Action from "webface/action/Action";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import AbsoluteData from "webface/layout/AbsoluteData";

import WebFontImage from "webface/graphics/WebFontImage";

import ListSelectionDialog from "webface/dialogs/ListSelectionDialog";

import * as padang from "padang/padang";

import * as view from "padang/view/view";
import TabItemPart from "padang/view/TabItemPart";
import DropSpacePart from "padang/view/DropSpacePart";
import InsertDropSpaceGuide from "padang/view/InsertDropSpaceGuide";

export default class TabItemListPanel implements Panel, WidthAdjustablePart, DragParticipantPart, DropSpacePart {

    public static ICON_WIDTH = 24;
    public static LINE_COLOR = "#E0E0E0";

    private height = 30;
    private spacing = 5;
    private overtop = 0;

    private composite: Composite = null;
    private contentPart: Composite = null;
    private viewport: Composite = null;
    private itemsPart: Composite = null;
    private actionsListPart: Composite = null;
    private moreIcon: WebFontIcon = null;
    private selection: number = -1;
    private dropSpaceGuide: InsertDropSpaceGuide = null;

    private onDrop = (source: number, target: number) => { };
    private onSelection = (index: number) => { };

    constructor(height?: number, spacing?: number, overtop?: number) {
        this.height = height === undefined ? 30 : height;
        this.spacing = spacing === undefined ? 5 : spacing;
        this.overtop = overtop === undefined ? 0 : overtop;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-tab-list-panel");
        element.css("line-height", (this.height) + "px");

        view.setAbsoluteLayout(this.composite);
        this.createLinePart(this.composite);
        this.createContentPart(this.composite);
    }

    private createContentPart(parent: Composite): void {

        this.contentPart = new Composite(parent);

        view.setGridLayout(this.contentPart, 3, 0, 0, 0, 0);
        view.setAbsoluteData(this.contentPart, 0, 0, "100%", "100%");

        this.createViewport(this.contentPart);
        this.createActionsPart(this.contentPart);
        this.createMoreIcon(this.contentPart);

    }

    private createViewport(parent: Composite): void {

        this.viewport = new Composite(parent);

        let element = this.viewport.getElement();
        element.addClass("padang-tab-item-list-viewport");

        view.setAbsoluteLayout(this.viewport);
        view.setGridData(this.viewport, 0, true);

        this.createItemsPart(this.viewport);

    }

    private createItemsPart(parent: Composite): void {

        this.itemsPart = new Composite(parent);

        let element = this.itemsPart.getElement();
        element.addClass("padang-tab-item-list-items-part");

        view.setGridLayout(this.itemsPart, 1, this.spacing, 0, this.spacing, 0);
        view.setAbsoluteData(this.itemsPart, 0, webface.DEFAULT, "100%", this.height);

        this.createDropSpacePart(this.itemsPart);
    }

    private createLinePart(parent: Composite): void {
        let linePart = new Composite(parent);
        view.setGridLayout(linePart);
        view.addClass(linePart, "padang-tab-item-list-line-part");
        view.css(linePart, "border-bottom", "1px solid " + TabItemListPanel.LINE_COLOR);
        view.setAbsoluteData(linePart, 0, 0, "100%", "100%");
    }

    private createActionsPart(parent: Composite): void {

        this.actionsListPart = new Composite(parent);

        let element = this.actionsListPart.getElement();
        element.addClass("padang-tab-item-list-actions-part");

        view.setGridLayout(this.actionsListPart, 1, 5, 0, 0, 0);
        view.setGridData(this.actionsListPart, 0, true);
    }

    public refreshNames(names: string[], creator: (name: string) => TabItemPart): void {

        let children = this.itemsPart["children"];
        let size = children.length;

        let i = 0;
        for (i = 0; i < names.length; i++) {

            let name = names[i];

            // Jika current name sama dengan label continue
            if (i < children.length) {
                let part = <TabItemPart>children[i].getData();
                let model = part.getName();
                if (model === name) {
                    continue;
                }
            }

            // Column sudah ada tetapi di posisi yang berbeda
            let part: TabItemPart = null;
            if (size > 0) {
                for (var j = 0; j < children.length; j++) {
                    let child = <TabItemPart>children[j].getData();
                    let model = child.getName();
                    if (model === name) {
                        part = child;
                        break;
                    }
                }
            }

            if (part !== null) {

                // Rubah posisi child
                this.movePart(part, i);

            } else {

                // Column belum ada, maka buat baru
                part = creator(name);
                this.addPart(part, i);
            }
        }

        // Hapus child yang tersisa
        size = children.length;
        if (i < size) {
            let trash: TabItemPart[] = [];
            for (; i < size; i++) {
                let part = <TabItemPart>children[i].getData();
                trash.push(part);
            }
            for (i = 0; i < trash.length; i++) {
                let tobeRemove = trash[i];
                this.removePart(tobeRemove);
            }
        }
    }

    public getItem(index: number): TabItemPart {
        let children = this.itemsPart.getChildren();
        return <TabItemPart><any>children[index].getData();
    }

    private createMoreIcon(parent: Composite): void {
        this.moreIcon = this.createIcon(parent, "mdi-dots-horizontal");
        this.moreIcon.onSelection(() => {
            let names = this.getItemNames();
            let dialog = new ListSelectionDialog();
            dialog.setWindowTitle("View List Dialog");
            dialog.setPrompt("Please select a view");
            dialog.setInput(names);
            dialog.setDoubleClickOK(true);
            dialog.open((result: string) => {
                if (result === ListSelectionDialog.OK) {
                    let view = <string>dialog.getFirstSelection();
                    let index = names.indexOf(view);
                    this.onSelection(index);
                }
            });
        });
    }

    private createIcon(parent: Composite, image: string): WebFontIcon {

        let icon = new WebFontIcon(parent);
        icon.addClasses("mdi", image);

        let element = icon.getElement();
        element.css("font-size", "24px");
        element.css("line-height", this.height + "px");
        element.css("cursor", "pointer");
        element.css("color", "#888");

        view.setGridData(icon, TabItemListPanel.ICON_WIDTH, true);

        return icon;

    }

    private createDropSpacePart(parent: Composite): void {
        this.dropSpaceGuide = new InsertDropSpaceGuide(parent, this, 5);
        this.dropSpaceGuide.setAcceptBorderColor("transparent");
    }

    public adjustWidth(): number {

        let tabsWidth = this.calculateTabsWidth();
        let actionsWidth = this.calculateActionsWidth();
        let required = tabsWidth;
        let visibled = required;
        let size = this.composite.computeSize();
        if (size.x > 0) {
            let layout = <GridLayout>this.composite.getLayout();
            let available = size.x;
            available -= actionsWidth;
            available -= 2 * layout.marginWidth;
            available -= 2 * layout.horizontalSpacing;
            let moreLayoutData = <GridData>this.moreIcon.getLayoutData();
            if (required > available) {
                visibled = available - TabItemListPanel.ICON_WIDTH;
                moreLayoutData.widthHint = TabItemListPanel.ICON_WIDTH;
            } else {
                moreLayoutData.widthHint = 0;
            }
            this.moreIcon.setVisible(required > available);

            let viewportData = <GridData>this.viewport.getLayoutData();
            viewportData.widthHint = visibled;

            let containerData = <AbsoluteData>this.itemsPart.getLayoutData();
            containerData.width = required;

            let actionsPartData = <GridData>this.actionsListPart.getLayoutData();
            actionsPartData.widthHint = actionsWidth;

            this.itemsPart.relayout();
            this.composite.relayout();

            this.setSelection(this.selection, true);

        }

        return visibled + actionsWidth;

    }

    private calculateTabsWidth(): number {
        let layout = <GridLayout>this.itemsPart.getLayout();
        let total = layout.marginWidth * 2;
        let children = this.itemsPart.getChildren();
        for (let i = 0; i < children.length; i++) {

            let child = children[i];
            let data = <WidthAdjustablePart>child.getData();
            let width = data.adjustWidth();
            let layoutData = new GridData(width, this.height);
            layoutData.verticalIndent = this.overtop;
            child.setLayoutData(layoutData);

            total += width;
            if (i > 0) {
                total += layout.horizontalSpacing;
            }

        }
        layout.numColumns = children.length;
        return total;
    }

    private calculateActionsWidth(): number {
        let layout = <GridLayout>this.actionsListPart.getLayout();
        let total = layout.marginWidth * 2;
        let children = this.actionsListPart.getChildren();
        for (let i = 0; i < children.length; i++) {

            let child = children[i];
            let width = TabItemListPanel.ICON_WIDTH;
            let layoutData = new GridData(width, this.height);
            child.setLayoutData(layoutData);

            total += width;
            if (i > 0) {
                total += layout.horizontalSpacing;
            }

        }
        layout.numColumns = children.length;
        return total;
    }

    public getItemNames(): string[] {
        let children = this.itemsPart.getChildren();
        let names: string[] = [];
        for (let child of children) {
            let part = <TabItemPart>child.getData();
            let name = part.getName();
            names.push(name);
        }
        return names;
    }

    public setSelectionName(selection: string, state: boolean): void {
        let names = this.getItemNames();
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            if (name === selection) {
                this.setSelection(i, state);
            }
        }
    }

    public setSelection(selection: number, state: boolean): void {

        // Pilih part
        let children = this.itemsPart.getChildren();
        let lastChild = children[children.length - 1];
        let selectChild = children[selection];
        if (selectChild === undefined) {
            return;
        }
        let part = <SelectionPart><any>selectChild.getData();
        part.setSelected(state);

        // Atur left container
        let size = this.viewport.computeSize();
        let containerData = <AbsoluteData>this.itemsPart.getLayoutData();
        let available = size.x;
        let visibleLeft = Math.abs(<number>containerData.left);
        let visibleRight = visibleLeft + available;
        let selectElement = selectChild.getElement();
        let selectWidth = selectElement.outerWidth();
        let selectLeft = parseFloat(selectElement.css("left"));
        let selectRight = selectLeft + selectWidth;
        if (visibleLeft > selectLeft) {
            containerData.left = Math.floor(-selectLeft);
        } else if (visibleRight < selectRight) {
            containerData.left = Math.floor(available - selectRight);
        } else {
            let lastElement = lastChild.getElement();
            let lastWidth = lastElement.outerWidth();
            let lastLeft = parseFloat(lastElement.css("left"));
            let lastRight = lastLeft + lastWidth;
            let rightSpace = lastRight < visibleRight ? visibleRight - lastRight : 0;
            if (containerData.left < 0) {
                let proposedLeft = Math.floor(<number>containerData.left + rightSpace);
                containerData.left = proposedLeft > 0 ? 0 : proposedLeft;
            }
        }
        this.viewport.relayout();
        this.selection = selection;

    }

    public addAction(action: Action): void {
        let image = <WebFontImage>action.getImage();
        let classes = image.getClasses();
        let icon = this.createIcon(this.actionsListPart, classes[1]);
        icon.setData(action);
        icon.onSelection(() => {
            action.run();
        });
    }

    public setActionEnabled(action: Action, enabled: boolean): void {
        let children = this.actionsListPart.getChildren();
        for (let child of children) {
            let target = <Action>child.getData();
            if (target === action) {
                child.setEnabled(enabled);
            }
        }
    }

    public setOnSelection(callback: (index: number) => void): void {
        this.onSelection = callback;
    }

    public setOnDrop(callback: (source: number, target: number) => void): void {
        this.onDrop = callback;
    }

    public dragStart(accept: boolean): void {
        this.dropSpaceGuide.dragStart(accept);
    }

    public isInRange(x: number, y: number): boolean {
        return this.dropSpaceGuide.isInRange(x, y);
    }

    public showFeedback(data: Map<any>, x: number, y: number): void {
        return this.dropSpaceGuide.showFeedback(data, x, y);
    }

    public clearFeedback(data: Map<any>): void {
        this.dropSpaceGuide.clearFeedback(data);
    }

    public dragStop(): void {
        this.dropSpaceGuide.dragStop();
    }

    public verifyAccept(data: Map<any>, callback: (message: string) => void): void {
        callback(null); // Tidak perlu message dan bisa langsung ke dropObject
    }

    public dropObject(data: Map<any>): void {
        let sourcePosition = data.get(padang.SOURCE_POSITION);
        let targetPosition = data.get(padang.TARGET_POSITION);
        this.onDrop(sourcePosition, targetPosition);
    }

    public reset(): void {
        this.clearSelection();
        let children = this.itemsPart.getChildren();
        for (let child of children) {
            let part = <TabItemPart>child.getData();
            this.removePart(part);
        }
    }

    public clearSelection(): void {
        this.setSelection(this.selection, false);
        this.selection = -1;
    }

    public getControl(): Control {
        return this.composite;
    }

    public addPart(child: TabItemPart, index?: number): void {
        child.createControl(this.itemsPart, index);
        let control = child.getControl();
        control.setData(child);
    }

    public movePart(child: TabItemPart, index: number): void {
        let control = child.getControl();
        this.itemsPart.moveControl(control, index);
        this.itemsPart.relayout();
    }

    public removePart(child: TabItemPart): void {
        let control = child.getControl();
        control.dispose();
    }

}
