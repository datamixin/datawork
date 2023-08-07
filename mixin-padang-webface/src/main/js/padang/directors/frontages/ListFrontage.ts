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
import Conductor from "webface/wef/Conductor";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorPanel from "webface/wef/ConductorPanel";

import VisageType from "bekasi/visage/VisageType";
import VisageList from "bekasi/visage/VisageList";
import VisageValue from "bekasi/visage/VisageValue";

import GridValuePanel from "padang/grid/GridValuePanel";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import GridContentProvider from "padang/grid/GridContentProvider";

import * as view from "padang/view/view";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";

import Frontage from "padang/directors/frontages/Frontage";
import FrontageRegistry from "padang/directors/frontages/FrontageRegistry";
import GridFrontagePanel from "padang/directors/frontages/GridFrontagePanel";
import TableColumnProperties from "padang/directors/frontages/TableColumnProperties";

import ListToTable from "padang/functions/list/ListToTable";

import ToolsetAction from "padang/view/toolbox/ToolboxAction";

import FrontagePanel from "padang/view/present/FrontagePanel";

import MultikeyProperties from "padang/util/MultikeyProperties";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import OutcomeVariableFormulaEnhanceRequest from "padang/requests/present/OutcomeVariableFormulaEnhanceRequest";

export default class ListFrontage extends Frontage {

    public createPresentPanel(conductor: Conductor, value: VisageValue): FrontagePanel {
        return new ListFrontagePanel(conductor, <VisageList>value);
    }

    public createToolsetActions(conductor: Conductor, properties: MultikeyProperties): ToolsetAction[] {
        let actions: ToolsetAction[] = [];
        actions.push(new ToolsetAction("To Table", "mdi-table-star", "Convert to table", () => {
            let formula = "=" + ListToTable.FUNCTION_NAME + "(" + Frontage.CURRENT_SYMBOL + ")";
            let request = new OutcomeVariableFormulaEnhanceRequest(formula);
            conductor.submit(request);
        }));
        return actions;
    }

}

export class ListFrontagePanel extends GridFrontagePanel {

    private list: VisageList = null;

    constructor(conductor: Conductor, list: VisageList) {
        super(conductor, <GridControlStyle>{ markerVisible: false },
            new ListContentProvider(list),
            new ListLabelExtender(conductor));
        this.list = list;
    }

    protected generateFooter(): string {
        let size = this.list.size();
        let text = size + " elements";
        return text;
    }

}

class ListContentProvider implements GridContentProvider {

    private list: VisageList = null;

    constructor(list: VisageList) {
        this.list = list;
    }

    public getColumnLabels(callback: (labels: GridColumnLabel[]) => void): void {
        let labels: DefaultColumnLabel[] = [];
        labels.push(new DefaultColumnLabel("Element", VisageType.UNKNOWN));
        callback(labels);
    }

    public getRowCount(callback: (count: number) => void): void {
        let size = this.list.size();
        callback(size);
    }

    public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
        callback: (map: Map<any, any[]>) => void): void {
        let map = new Map<any, any[]>();
        for (let i = rowStart; i < rowEnd; i++) {
            let element = this.list.get(i);
            map.set(i, [element]);
        }
        callback(map);
    }

}

class ListLabelExtender implements GridLabelExtender {

    private conductor: Conductor = null;
    private properties: TableColumnProperties = null;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
        this.properties = new TableColumnProperties(conductor);
    }

    public getColumnLabelPanel(): DefaultColumnLabelPanel {
        return new DefaultColumnLabelPanel(this.conductor);
    }

    public getColumnProperties(): TableColumnProperties {
        return this.properties;
    }

    public getCellValuePanel(): ListFrontageCellValuePanel {
        return new ListFrontageCellValuePanel(this.conductor);
    }

}

class ListFrontageCellValuePanel extends ConductorPanel implements GridValuePanel {

    private composite: Composite = null;
    private container: Composite = null;
    private type: string = null;
    private surfacePanel: SurfacePanel = null;

    constructor(conductor: Conductor) {
        super(conductor);
    }

    public createControl(parent: Composite, index: number): void {
        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-object-frontage-cell-value-panel");
        view.setGridLayout(this.composite, 2, 0, 0, 0, 0);
        this.createContainer(this.composite);
    }

    private createContainer(parent: Composite): void {
        this.container = new Composite(parent);
        view.setFillLayoutHorizontal(this.container);
        view.setGridData(this.container, true, true);
    }

    public setValue(rowPos: number, columnPos: number, value?: VisageValue): void {

        if (value !== undefined) {

            let type = value.xLeanName();
            if (type !== this.type) {

                // Dispose surface terakhir
                if (this.surfacePanel !== null) {
                    view.dispose(this.surfacePanel);
                }

                // Buat surface baru
                let registry = SurfaceRegistry.getInstance();
                let surface = registry.get(value);
                this.surfacePanel = surface.createPanel(this.conductor, false);
                this.surfacePanel.createControl(this.container);
                view.css(this.surfacePanel, "line-height", GridControlStyle.ROW_HEIGHT + "px");

                this.composite.relayout();
                this.container.relayout();
            }

            // Isi surface
            this.surfacePanel.setValue(value);

        }

    }

    public setSelected(selected: boolean): void {

    }

    public setProperty(name: string, value: any): void {

    }

    public delayValue(): void {

    }

    public getControl(): Control {
        return this.composite;
    }

}

let registry = FrontageRegistry.getInstance();
let frontage = new ListFrontage();
registry.register(VisageType.MIXINLIST, Frontage.DEFAULT, frontage);
registry.register(VisageList.LEAN_NAME, Frontage.DEFAULT, frontage);
