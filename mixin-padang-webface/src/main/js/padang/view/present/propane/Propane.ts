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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import VisageValue from "bekasi/visage/VisageValue";

import * as view from "padang/view/view";

import IsNull from "padang/functions/logical/IsNull";

import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import PropaneValuePanel from "padang/view/present/propane/PropaneValuePanel";

import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

export abstract class Propane extends ConductorPanel {

	public static BAR_DEFAULT_COLOR = "#c1e2ff";
	public static BAR_INSPECT_COLOR = "#ffdfaf";
	public static BAR_HEIGHT = 14;
	public static MARGIN_HEIGHT = 3;
	public static BAR_DOWN = Propane.BAR_HEIGHT / 2;

	protected column: string = null;
	protected type: string = null;
	protected menuSet: PropaneMenuSet = null;

	protected selections: BarFigure[] = [];
	protected maximum: number = 0;

	protected composite: Composite = null;
	protected nullPart: Composite = null;
	protected nullFigure: BarFigure = null;

	constructor(conductor: Conductor, column: string, type: string) {
		super(conductor);
		this.column = column;
		this.type = type;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent);
		view.addClass(this.composite, "padang-propane");
		view.addClass(this.composite, "padang-profile-" + this.type);
		view.setGridLayout(this.composite, 1, 0, 0, 0, Propane.MARGIN_HEIGHT);
	}

	protected getValueLabel(value: any): string {
		let registry = SurfaceRegistry.getInstance();
		let text = registry.getText(<any>value);
		return text;
	}

	protected createBarFigure(parent: Composite, index: number, value: number, gap: number,
		down: number, generic?: boolean): BarFigure {
		let figure = new BarFigure(this.maximum, value, generic);
		figure.createControl(parent);
		let control = figure.getControl();
		let top = index * Propane.BAR_HEIGHT + down;
		view.setAbsoluteData(control, 0, top, "100%", Propane.BAR_HEIGHT - gap);
		return figure;
	}

	protected setSelections(selections: BarFigure[]): void {
		for (let selection of this.selections) {
			selection.setSelected(false);
		}
		this.selections = [];
		for (let selection of selections) {
			selection.setSelected(true);
			this.selections.push(selection);
		}
	}

	public abstract setInitialProfile(value: VisageValue): void;

	public abstract populateFigure(): void;

	public setFormat(value: string): void {

	}

	protected createNullFigure(parent: Composite, count: number): void {

		this.nullPart = new Composite(parent);
		view.addClass(this.nullPart, "padang-propane-null-part");
		view.setAbsoluteLayout(this.nullPart);
		view.setGridData(this.nullPart, true, Propane.BAR_HEIGHT);

		// Figure
		this.nullFigure = this.createBarFigure(this.nullPart, 0, count, 1, 0);

		let action = new PropaneNullAction(this.column, this.menuSet);
		let panel = this.createValuePanel(this.nullPart, 0, "null", count, 0, action);
		panel.setOnSelection(() => {
			let values = new Map<string, any>();
			values.set(IsNull.FUNCTION_NAME, null);
			let request = new TabularColumnInspectApplyRequest(this.column, this.type, values);
			this.conductor.submit(request);
		});
		view.css(panel, "font-style", "italic");
		view.css(panel, "color", "#888");

	}

	protected createValuePanel(parent: Composite, index: number, key: string,
		count: number, down: number, action?: GroupAction): PropaneValuePanel {

		let panel = new PropaneValuePanel(this.conductor, action);
		panel.createControl(parent);
		panel.setCount(count);
		panel.setLabel(key);
		panel.updateHint();

		let top = index * Propane.BAR_HEIGHT + down;
		view.setAbsoluteData(panel, 0, top, "100%", Propane.BAR_HEIGHT - 1);
		return panel;
	}

	public abstract setInspectProfile(value: VisageValue): void;

	public abstract setSelectionValues(values: Map<string, any>): void;

	public setMenuSet(menuSet: PropaneMenuSet): void {
		this.menuSet = menuSet;
	}

	public adjustHeight(): number {
		let nullHeight = this.nullFigure === null ? 0 : Propane.BAR_HEIGHT;
		return view.getGridLayoutHeight(this.composite, [nullHeight]);
	}

	public getControl(): Control {
		return this.composite;
	}

}

export class BarFigure {

	private maximum: number = null;
	private value: number = null;
	private generic: boolean = false;

	private composite: Composite = null;
	private defaultPart: Composite = null;
	private inspectPart: Composite = null;
	private inspectFillLabel: Label = null;
	private inspectSpaceLabel: Label = null;
	private overlayPart: Composite = null;

	constructor(maximum: number, value: number, generic?: boolean) {
		this.maximum = maximum;
		this.value = value;
		this.generic = generic === undefined ? false : generic;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		view.setAbsoluteLayout(this.composite);
		this.createInitialPart(this.composite);
		this.createInspectPart(this.composite);
		this.createOverlayPart(this.composite);
	}

	private createInitialPart(parent: Composite): void {
		this.defaultPart = this.createrFigurePart(parent, "padang-propane-bar-figure-default-part");
		this.createBarFill(this.defaultPart, this.value, this.generic ? "#D8D8D8" : Propane.BAR_DEFAULT_COLOR);
		this.createBarFill(this.defaultPart, this.maximum - this.value, "tranparent");
	}

	private createInspectPart(parent: Composite): void {
		this.inspectPart = this.createrFigurePart(parent, "padang-propane-bar-figure-inspect-part");
		this.inspectFillLabel = this.createBarFill(this.inspectPart, 0, Propane.BAR_INSPECT_COLOR);
		this.inspectSpaceLabel = this.createBarFill(this.inspectPart, this.maximum, "tranparent");
	}

	private createOverlayPart(parent: Composite): void {
		this.overlayPart = this.createrFigurePart(parent, "padang-propane-bar-figure-overlay");
	}

	private createrFigurePart(parent: Composite, classname: string): Composite {
		let part = new Composite(parent);
		view.addClass(part, classname);
		view.setFillLayoutHorizontal(part, 0, 0, 0);
		view.setAbsoluteData(part, 0, 0, "100%", "100%");
		return part;
	}

	private createBarFill(parent: Composite, weight: number, color: string): Label {
		let label = new Label(parent);
		view.css(label, "background", color);
		view.setFillData(label, weight);
		return label;
	}

	public setInspectValue(value: number): void {
		view.setFillData(this.inspectFillLabel, value);
		view.setFillData(this.inspectSpaceLabel, this.maximum - value);
		this.inspectPart.relayout();
	}

	public setSelected(selected: boolean): void {
		view.setSelected(this.overlayPart, selected);
	}

	public getControl(): Control {
		return this.composite;
	}

}

export class PropaneNullAction extends GroupAction {

	private column: string = null;
	private menuSet: PropaneMenuSet = null;

	constructor(column: string, menuSet: PropaneMenuSet) {
		super();
		this.column = column;
		this.menuSet = menuSet;
	}

	public getActions(): Action[] {
		return this.menuSet.listNullActions(this.column);
	}

}

export default Propane;
