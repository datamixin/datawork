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
import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageObject from "bekasi/visage/VisageObject";
import VisageStructure from "bekasi/visage/VisageStructure";

import GridValuePanel from "padang/grid/GridValuePanel";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import GridContentProvider from "padang/grid/GridContentProvider";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";

import Frontage from "padang/directors/frontages/Frontage";
import FrontageRegistry from "padang/directors/frontages/FrontageRegistry";

import ToolsetAction from "padang/view/toolbox/ToolboxAction";

import FrontagePanel from "padang/view/present/FrontagePanel";

import MultikeyProperties from "padang/util/MultikeyProperties";

import ObjectToTable from "padang/functions/object/ObjectToTable";
import ListMapToTable from "padang/functions/object/ListMapToTable";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import GridFrontagePanel from "padang/directors/frontages/GridFrontagePanel";
import TableColumnProperties from "padang/directors/frontages/TableColumnProperties";

import OutcomeCreateFromFieldRequest from "padang/requests/present/OutcomeCreateFromFieldRequest";
import OutcomeVariableFormulaEnhanceRequest from "padang/requests/present/OutcomeVariableFormulaEnhanceRequest";

export default class ObjectFrontage extends Frontage {

    public createPresentPanel(conductor: Conductor, value: VisageValue): FrontagePanel {
        return new ObjectFrontagePanel(conductor, <VisageObject>value);
    }

    public createToolsetActions(conductor: Conductor, properties: MultikeyProperties): ToolsetAction[] {
        let actions: ToolsetAction[] = [];
        actions.push(new ToolsetAction("To Table", "mdi-table-star", "Convert to table", () => {
            let formula = "=" + ObjectToTable.FUNCTION_NAME + "(" + Frontage.CURRENT_SYMBOL + ")";
            let request = new OutcomeVariableFormulaEnhanceRequest(formula);
            conductor.submit(request);
        }));
        actions.push(new ToolsetAction("To Table By Pivot", "mdi-table-pivot", "Convert list map to table", () => {
            let formula = "=" + ListMapToTable.FUNCTION_NAME + "(" + Frontage.CURRENT_SYMBOL + ")";
            let request = new OutcomeVariableFormulaEnhanceRequest(formula);
            conductor.submit(request);
        }));
        return actions;
    }

}

export class ObjectFrontagePanel extends GridFrontagePanel {

    private object: VisageObject = null;

    constructor(conductor: Conductor, object: VisageObject) {
        super(conductor, <GridControlStyle>{ markerVisible: false },
            new ObjectContentProvider(object),
            new ObjectLabelExtender(conductor, object));
        this.object = object;
    }

    protected generateFooter(): string {
        let names = this.object.fieldNames();
        let text = names.length + " fields";
        return text;
    }

}

class ObjectContentProvider implements GridContentProvider {

    private object: VisageObject = null;

    constructor(object: VisageObject) {
        this.object = object;
    }

    public getColumnLabels(callback: (labels: GridColumnLabel[]) => void): void {
        let labels: DefaultColumnLabel[] = [];
        labels.push(new DefaultColumnLabel("Key", VisageType.STRING));
        labels.push(new DefaultColumnLabel("Value", VisageType.UNKNOWN));
        callback(labels);
    }

    public getRowCount(callback: (count: number) => void): void {
        let names = this.object.fieldNames();
        callback(names.length);
    }

    public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
        callback: (map: Map<any, any[]>) => void): void {
        let map = new Map<any, any[]>();
        let names = this.object.fieldNames();
        for (let i = rowStart; i < rowEnd; i++) {
            let key = names[i];
            let text = new VisageText(key);
            let field = this.object.getField(key);
            map.set(i, [text, field]);
        }
        callback(map);
    }

}

class ObjectLabelExtender implements GridLabelExtender {

    private conductor: Conductor = null;
    private properties: TableColumnProperties = null;
    private provider: ObjectContentProvider = null;

    constructor(conductor: Conductor, object: VisageObject) {
        this.conductor = conductor;
        this.provider = new ObjectContentProvider(object);
        this.properties = new TableColumnProperties(conductor);
    }

    public getColumnLabelPanel(): DefaultColumnLabelPanel {
        return new DefaultColumnLabelPanel(this.conductor);
    }

    public getColumnProperties(): TableColumnProperties {
        return this.properties;
    }

    public getCellValuePanel(): ObjectFrontageCellValuePanel {
        return new ObjectFrontageCellValuePanel(this.conductor, this.provider);
    }

}

class ObjectFrontageCellValuePanel extends ConductorPanel implements GridValuePanel {

    private static MENU_WIDTH = 24;

    private provider: ObjectContentProvider = null;
    private composite: Composite = null;
    private container: Composite = null;
    private type: string = null;
    private rowPos: number = -1;
    private surfacePanel: SurfacePanel = null;
    private menuPanel = new MenuPanel();

    constructor(conductor: Conductor, provider: ObjectContentProvider) {
        super(conductor);
        this.provider = provider;
    }

    public createControl(parent: Composite, index: number): void {
        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-object-frontage-cell-value-panel");
        view.setGridLayout(this.composite, 2, 0, 0, 0, 0);
        this.createContainer(this.composite);
        this.createMenuPanel(this.composite);
    }

    private createContainer(parent: Composite): void {
        this.container = new Composite(parent);
        view.setFillLayoutHorizontal(this.container);
        view.setGridData(this.container, true, true);
    }

    private createMenuPanel(parent: Composite): void {
        this.menuPanel.createControl(parent);
        this.menuPanel.setActions([
            new ViewAction("New Outcone", () => {
                this.provider.getRowRange(this.rowPos, this.rowPos + 1, 0, 1, (map: Map<any, any[]>) => {
                    let keyValue = map.get(this.rowPos);
                    let key = (<VisageText>keyValue[0]).getValue();
                    let request = new OutcomeCreateFromFieldRequest(key);
                    this.conductor.submit(request);
                });
            })
        ]);
        view.setGridData(this.menuPanel, ObjectFrontageCellValuePanel.MENU_WIDTH, true);
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

                // Menu visibility
                let menuWidth = columnPos === 1 ? ObjectFrontageCellValuePanel.MENU_WIDTH : 0;
                menuWidth = value instanceof VisageStructure ? menuWidth : 0;
                view.setGridData(this.menuPanel, menuWidth, true);
                this.composite.relayout();
                this.container.relayout();
            }

            // Isi surface
            this.surfacePanel.setValue(value);

        }

        this.rowPos = rowPos;
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
let frontage = new ObjectFrontage();
registry.register(VisageType.MIXINOBJECT, Frontage.DEFAULT, frontage);
registry.register(VisageObject.LEAN_NAME, Frontage.DEFAULT, frontage);
