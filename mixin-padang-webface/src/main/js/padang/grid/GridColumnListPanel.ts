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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import AbsoluteData from "webface/layout/AbsoluteData";

import * as view from "padang/view/view";

import GridColumnPart from "padang/grid/GridColumnPart";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridColumnPanel from "padang/grid/GridColumnPanel";
import GridResizeStick from "padang/grid/GridResizeStick";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridColumnListPart from "padang/grid/GridColumnListPart";
import GridColumnProperties from "padang/grid/GridColumnProperties";
import GridCellConsolidator from "padang/grid/GridCellConsolidator";
import GridColumnRangeUnderline from "padang/grid/GridColumnRangeUnderline";
import GridDefaultColumnProperties from "padang/grid/GridDefaultColumnProperties";

export default class GridColumnListPanel implements GridColumnListPart {

    private style: GridControlStyle = null;
    private composite: Composite = null;
    private extender: GridLabelExtender = null;
    private container: Composite = null;
    private extraPanel: Panel = null;
    private consolidator = new GridCellConsolidator();
    private underline: GridColumnRangeUnderline = null;
    private resizeStick: GridResizeStick = null;
    private selectedPart: GridColumnPart = null;
    private properties: GridColumnProperties = new GridDefaultColumnProperties();

    constructor(style: GridControlStyle) {
        this.style = style;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-grid-column-list-panel");

        view.setAbsoluteLayout(this.composite);

        this.createContainer(this.composite);
        this.createResizeStick(this.composite);

    }

    private createContainer(parent: Composite): void {

        this.container = new Composite(parent);

        let element = this.container.getElement();
        element.addClass("padang-grid-column-list-present-container");
        element.addClass("line-height", this.style.headerHeight + "px");

        view.setAbsoluteLayout(this.container);
        view.setAbsoluteData(this.container, 0, 0, 0, this.style.headerHeight);

    }

    private createResizeStick(parent: Composite): void {

        this.resizeStick = new GridResizeStick(parent);
        this.resizeStick.setOnDragging((index: number, width: number) => {

            let children = this.container.getChildren();
            let panel = <GridColumnPanel>children[index].getData();
            panel.setWidth(width);
            this.adjustWidth();
            this.consolidator.columnsResized();

        });

        this.resizeStick.setOnDragstop((index: number, width: number): void => {

            let children = this.container.getChildren();
            let panel = <GridColumnPanel>children[index].getData();
            let label = panel.getLabel();
            let name = label.getLabel();
            this.properties.saveWidth(name, width);

        });

    }

    public setConsolidator(consolidator: GridCellConsolidator): void {
        this.consolidator = consolidator;
    }

    public setUnderline(underline: GridColumnRangeUnderline): void {
        this.underline = underline;
    }

    public setExtender(extender: GridLabelExtender): void {
        this.extender = extender;
        if (extender.getColumnProperties !== undefined) {
            this.properties = extender.getColumnProperties();
        }
        if (this.extender.getColumnExtraPanel !== undefined) {
            this.extraPanel = this.extender.getColumnExtraPanel();
            this.extraPanel.createControl(this.composite);
            view.setAbsoluteData(this.extraPanel, 0, 0, this.style.markerWidth, this.style.headerHeight);
        }
    }

    public refreshColumns(labels: GridColumnLabel[]): number {

        let changed = 0;
        let children = this.container["children"];
        let size = children.length;
        let removed: string[] = [];

        let i = 0;
        for (i = 0; i < labels.length; i++) {

            let label = labels[i];

            // Jika current column sama dengan label continue
            if (i < children.length) {
                let panel = <GridColumnPanel>children[i].getData();
                let model = panel.getLabel();
                if (model.equals(label)) {
                    continue;
                }
            }

            // Column sudah ada tetapi di posisi yang berbeda
            let panel: GridColumnPanel = null;
            if (size > 0) {
                for (var j = 0; j < children.length; j++) {
                    let child = <GridColumnPanel>children[j].getData();
                    let model = child.getLabel();
                    if (model.equals(label)) {
                        panel = child;
                        break;
                    }
                }
            }

            if (panel !== null) {

                // Rubah posisi column
                this.movePart(panel, i);
                changed++;

            } else {

                // Column belum ada, maka buat baru
                panel = this.createColumnPanel(label, removed);
                this.addPart(panel, i);
                changed++;
            }
        }

        // Hapus column yang tersisa
        children = this.container.getChildren();
        size = children.length;
        if (i < size) {
            let trash: Control[] = [];
            for (; i < size; i++)
                trash.push(children[i]);
            for (i = 0; i < trash.length; i++) {
                let tobeRemove = <GridColumnPanel>trash[i].getData();
                this.removePart(tobeRemove, removed);
                changed++;
            }
        }

        if (changed > 0) {
            this.consolidator.columnsResized();
        }
        return changed;

    }

    private createColumnPanel(label: GridColumnLabel, removed: string[]): GridColumnPanel {

        let panel = new GridColumnPanel(this.style, label, this.extender);

        let name = label.getLabel();
        this.properties.remove(name);
        removed.push(name);
        this.properties.loadWidth(name, (width: number) => {
            panel.setWidth(width);
            this.adjustWidth();
        });

        this.properties.loadProperty(name, (name: string, value: any) => {
            panel.setProperty(name, value);
        });

        return panel;
    }

    public getColumnCount(): number {
        let children = this.container.getChildren();
        return children.length;
    }

    public getColumnLabel(index: number): string {
        let children = this.container.getChildren();
        let child = children[index].getData();
        let part = <GridColumnPart><any>child;
        let label = part.getLabel();
        return label.getLabel();
    }

    public loadProperty(index: number, callback: (name: string, value: any) => void): void {
        let label = this.getColumnLabel(index);
        this.properties.loadProperty(label, callback);
    }

    public getLayoutDataList(): AbsoluteData[] {
        let list: AbsoluteData[] = [];
        let children = this.container.getChildren();
        for (let child of children) {
            let layoutData = view.getAbsoluteData(child);
            list.push(layoutData);
        }
        return list;
    }

    public indicateHasSelection(column: number): AbsoluteData {
        if (column !== -1) {
            let children = this.container.getChildren();
            column = column >= children.length ? children.length - 1 : column;
            if (column >= 0 && column < children.length) {
                let part = <GridColumnPart>children[column].getData();
                let control = part.getControl();
                let layoutData = <AbsoluteData>control.getLayoutData();
                this.indicateSelection(<number>layoutData.left, <number>layoutData.width);
                return layoutData;
            }
        }
        return null;
    }

    public getFullWidth(): number {
        let layoutData = view.getAbsoluteData(this.container);
        return <number>layoutData.width;
    }

    public indicateSelection(left: number, width: number): void {
        this.underline.update(left, width);
        this.clearSelection();
    }

    public getExtraWidth(): number {
        if (this.extraPanel !== null) {
            let addIconData = view.getAbsoluteData(this.extraPanel);
            return <number>addIconData.width;
        }
        return 0;
    }

    public adjustWidth(): number {

        // Container
        let children = this.container.getChildren();
        let left = 0;
        for (let child of children) {
            let part = <GridColumnPart>child.getData();
            let width = part.adjustWidth();
            let layoutData = view.getAbsoluteData(child);
            layoutData.left = left;
            layoutData.width = width;
            left += width;
        }
        let containerData = view.getAbsoluteData(this.container);
        containerData.width = left;

        // Extra panel
        if (this.extraPanel !== null) {
            let addIconData = view.getAbsoluteData(this.extraPanel);
            addIconData.left = left;
            left += <number>addIconData.width;
        }

        this.composite.relayout();
        this.container.relayout();
        this.resizeStick.updateChildren(this.container);

        return left;

    }

    private clearSelection(): void {
        if (this.selectedPart !== null) {
            this.selectedPart.setSelected(false);
        }
        this.selectedPart = null;
    }

    public getControl(): Control {
        return this.composite;
    }

    private addPart(child: GridColumnPart, index: number): void {

        child.createControl(this.container, index);
        child.setOnSelection((control: Control) => {

            let children = this.container.getChildren();
            let index = children.indexOf(control);
            this.consolidator.selectColumn(index, true);

            this.clearSelection();
            this.selectedPart = <GridColumnPart>control.getData();
            this.selectedPart.setSelected(true);

        });

        let minWidth = GridControlStyle.MIN_COLUMN_WIDTH;
        let layoutData = view.setAbsoluteData(child, 0, 0, minWidth, this.style.headerHeight);

        this.adjustWidth();
        this.consolidator.addColumn(layoutData, index);

        let label = child.getLabel();
        let name = label.getLabel();
        this.properties.setOnWidthChanged(name, (width: number) => {
            child.setWidth(width);
        });
        this.properties.addOnPropertyChanged(name, (name: string, value: any) => {
            child.setProperty(name, value);
            let control = child.getControl();
            let children = this.container.getChildren();
            let index = children.indexOf(control);
            this.consolidator.setProperty(index, name, value);
        });
    }

    private movePart(child: GridColumnPart, index: number): void {
        let control = child.getControl();
        this.container.moveControl(control, index);
    }

    private removePart(child: GridColumnPart, removed: string[]): void {

        let control = child.getControl();
        let children = this.container.getChildren();
        let index = children.indexOf(control);
        view.dispose(child);

        this.adjustWidth();
        this.consolidator.removeColumn(index);

        let label = child.getLabel();
        let name = label.getLabel();
        if (removed.indexOf(name) === -1) {
            this.properties.remove(name);
        }

    }

}
