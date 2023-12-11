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
import Panel from "webface/wef/Panel";

import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import IconLabelPanel from "webface/ui/IconLabelPanel";

import DesignCompositePanel from "vegazoo/view/design/DesignCompositePanel";

export default class ViewSpecListPanel implements Panel {

    private static ADD_ICON_HEIGHT = 24;

    private composite: Composite = null;
    private containerPanel = new DesignCompositePanel();
    private addIconLabelPanel = new IconLabelPanel();
    private layerPanels: ViewSpecListItemPanel[] = [];
    private onAdd = () => { };
    private onSelect = (index: number) => { };
    private onRemove = (index: number) => { };

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-view-spec-list-panel");

        let layout = new GridLayout(1, 0, 0, 0, 5);
        this.composite.setLayout(layout);

        this.createContainerPanel(this.composite);
        this.createAddIconLabelPanel(this.composite);

    }

    private createContainerPanel(parent: Composite): void {

        this.containerPanel.createControl(parent);
        let control = this.containerPanel.getControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);
    }

    private createAddIconLabelPanel(parent: Composite): void {

        this.addIconLabelPanel = new IconLabelPanel();
        this.addIconLabelPanel.createControl(parent);
        this.addIconLabelPanel.setLabel("Add View");

        let control = this.addIconLabelPanel.getControl();
        let layoutData = new GridData(true, ViewSpecListPanel.ADD_ICON_HEIGHT);
        control.setLayoutData(layoutData);

        this.addIconLabelPanel.setCallback(() => {
            this.onAdd();
        });

    }

    public setLayerSelected(index: number, selected: boolean): void {
        let panel = this.layerPanels[index];
        panel.setSelected(selected);
    }

    public adjustHeight(): number {
        let layout = <GridLayout>this.composite.getLayout();
        let height = layout.marginHeight * 2 + layout.verticalSpacing;
        height += ViewSpecListPanel.ADD_ICON_HEIGHT;
        height += this.containerPanel.adjustHeight();
        return height;
    }

    public setOnAdd(callback: () => void): void {
        this.onAdd = callback;
    }

    public setOnSelect(callback: (index: number) => void): void {
        this.onSelect = callback;
    }

    public setOnRemove(callback: (index: number) => void): void {
        this.onRemove = callback;
    }

    public select(index: number): void {
        this.onSelect(index);
    }

    public remove(index: number): void {
        this.onRemove(index);
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {

        // Buat element view untuk menampung view
        let view = new ViewSpecListItemPanel(this, child);

        // Add di elements views
        this.layerPanels.splice(index, 0, view);

        // Add di panel
        this.containerPanel.addPanel(view, index);
    }

    public moveView(child: ConductorView, index: number): void {

        // Looping ke semua element panel
        for (let i = 0; i < this.layerPanels.length; i++) {
            let layerPanel = this.layerPanels[i];
            if (layerPanel.getView() === child) {

                // Move di element panels
                this.layerPanels.splice(i, 1);
                this.layerPanels.splice(index, 0, layerPanel);

                // Move di panel
                this.containerPanel.movePanel(layerPanel, index);
                break;
            }
        }
    }

    public removeView(child: ConductorView): void {

        // Looping ke semua element panel
        for (let i = 0; i < this.layerPanels.length; i++) {
            let layerPanel = this.layerPanels[i];
            if (layerPanel.getView() === child) {

                // Remove di element panels
                this.layerPanels.splice(i, 1);

                // Remove di panel
                this.containerPanel.removePanel(layerPanel);
                break;
            }
        }
    }

}

class ViewSpecListItemPanel implements Panel {

    private static LABEL_HEIGHT = 24;
    private static BORDER_WIDTH = 2;

    private panel: ViewSpecListPanel = null;
    private composite: Composite = null;
    private view: ConductorView = null;
    private menuIcon: WebFontIcon = null;

    constructor(panel: ViewSpecListPanel, view: ConductorView) {
        this.panel = panel;
        this.view = view;
    }

    public getView(): ConductorView {
        return this.view;
    }

    public createControl(parent: Composite, index: number) {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("vegazoo-view-spec-list-item-panel");
        element.css("border", ViewSpecListItemPanel.BORDER_WIDTH + "px solid transparent");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createLayerLabel(this.composite);
        this.createMenuIcon(this.composite);
        this.createLayerView(this.composite);

        this.composite.onSelection(() => {
            let index = this.getIndex();
            this.panel.select(index);
        });

    }

    private createLayerLabel(parent: Composite): void {

        let label = new Label(parent);
        let count = this.getCount();
        let index = this.getIndex();
        label.setText("Item " + (index + 1) + " of " + count);

        let element = label.getElement();
        element.css("color", "#888");
        element.css("background-color", "#E0E0E0");
        element.css("font-style", "italic");
        element.css("text-indent", "8px");
        element.css("line-height", ViewSpecListItemPanel.LABEL_HEIGHT + "px");

        let layoutData = new GridData(true, ViewSpecListItemPanel.LABEL_HEIGHT);
        label.setLayoutData(layoutData);

    }

    private getCount(): number {
        let parent = this.composite.getParent();
        let children = parent.getChildren();
        return children.length;
    }

    private getIndex(): number {
        let parent = this.composite.getParent();
        let children = parent.getChildren();
        let index = children.indexOf(this.composite);
        return index;
    }

    private createMenuIcon(parent: Composite): void {

        this.menuIcon = new WebFontIcon(parent);
        this.menuIcon.addClasses("mdi", "mdi-menu-down");

        let size = ViewSpecListItemPanel.LABEL_HEIGHT;
        let element = this.menuIcon.getElement();
        element.css("color", "#888");
        element.css("background-color", "#E0E0E0");
        element.css("font-size", size + "px");
        element.css("line-height", size + "px");

        // Layout data
        let layoutData = new GridData(size, size);
        this.menuIcon.setLayoutData(layoutData);

        this.menuIcon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                let index = this.getIndex();
                let action = new ViewSpecListPopupAction(this.panel, index);
                action.open(event);
            }
        });

    }

    private createLayerView(parent: Composite): void {

        this.view.createControl(parent, 2);

        let control = this.view.getControl();
        let layoutData = new GridData(true, true);
        layoutData.horizontalSpan = 2;
        control.setLayoutData(layoutData);
    }

    public adjustHeight(): number {
        let layout = <GridLayout>this.composite.getLayout()
        let height = layout.marginHeight * 2 + layout.verticalSpacing;
        height += (<HeightAdjustablePart><any>this.view).adjustHeight();
        height += ViewSpecListItemPanel.LABEL_HEIGHT + ViewSpecListItemPanel.BORDER_WIDTH * 2;
        return height;
    }

    public setSelected(selected: boolean): void {
        let element = this.composite.getElement();
        element.css("border-color", selected === true ? "#80bdff" : "transparent");
    }

    public setReadOnly(state: boolean): void {
        this.menuIcon.setEnabled(!state);
    }

    public getControl(): Control {
        return this.composite;
    }

}

class ViewSpecListPopupAction extends PopupAction {

    private panel: ViewSpecListPanel = null;
    private index: number = null;

    constructor(panel: ViewSpecListPanel, index: number) {
        super();
        this.panel = panel;
        this.index = index;
    }

    public getActions(): Action[] {
        let actions: Action[] = [];
        actions.push(new ViewSpecListLayerRemoveAction(this.panel, this.index));
        return actions;
    }

}

class ViewSpecListLayerAction extends Action {

    protected panel: ViewSpecListPanel = null;
    protected index: number = null;

    constructor(panel: ViewSpecListPanel, index: number) {
        super();
        this.panel = panel;
        this.index = index;
    }

}

class ViewSpecListLayerRemoveAction extends ViewSpecListLayerAction {

    constructor(panel: ViewSpecListPanel, index: number) {
        super(panel, index);
    }

    public getText(): string {
        return "Remove";
    }

    public run(): void {
        this.panel.remove(this.index);
    }

}
