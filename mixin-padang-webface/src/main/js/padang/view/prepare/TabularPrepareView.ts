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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";

import VisageValue from "bekasi/visage/VisageValue";
import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import TabularPart from "padang/view/TabularPart";

import TabularCornerPanel from "padang/view/prepare/TabularCornerPanel";
import DisplayPrepareView from "padang/view/prepare/DisplayPrepareView";
import TabularPropaneMenuSet from "padang/view/prepare/TabularPropaneMenuSet";
import TabularColumnTitlePanel from "padang/view/prepare/TabularColumnTitlePanel";

import TabularPresentPanel from "padang/view/present/TabularPresentPanel";
import TabularPresentMaker from "padang/view/present/TabularPresentMaker";
import TabularColumnProperties from "padang/view/present/TabularColumnProperties";

export default class TabularPrepareView extends DisplayPrepareView implements TabularPart {

	private composite: Composite = null;
	private presentPanel: TabularPresentPanel = null;

	constructor(conductor: Conductor) {
		super(conductor);
		this.preparePresentPanel();
	}

	private preparePresentPanel(): void {
		let menuSet = new TabularPropaneMenuSet(this.conductor);
		let properties = new TabularColumnProperties(this.conductor);
		let maker = new TabularPrepareMaker(this.conductor, properties);
		this.presentPanel = new TabularPresentPanel(this.conductor, properties, maker, menuSet);
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		this.composite.setData(this);
		view.addClass(this.composite, "padang-tabular-prepare-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createPresentPanel(this.composite);
	}

	private createPresentPanel(parent: Composite): void {
		this.presentPanel.createControl(parent);
		view.setGridData(this.presentPanel, true, true);
	}

	public refresh(callback: () => void): void {
		this.presentPanel.refresh(callback);
	}

	public refreshRows(): void {
		this.presentPanel.refreshRows();
	}

	public refreshInspection(): void {
		this.presentPanel.refreshInspection();
	}

	public mutate(mutation: VisageMutation): void {
		this.presentPanel.mutate(mutation);
	}

	public setLeftOrigin(left: number): void {
		this.presentPanel.setLeftOrigin(left);
	}

	public setTopOrigin(top: number): void {
		this.presentPanel.setTopOrigin(top);
	}

	public setSelectedRow(index: number): void {
		this.presentPanel.setSelectedRow(index);
	}

	public setSelectedCell(row: number, column: number): void {
		this.presentPanel.setSelectedCell(row, column);
	}

	public setSelectedColumn(index: number): void {
		this.presentPanel.setSelectedColumn(index);
	}

	public setColumnWidth(name: string, width: number): void {
		this.presentPanel.setColumnWidth(name, width);
	}

	public setColumnFormat(name: string, format: string): void {
		this.presentPanel.setColumnFormat(name, format);
	}

	public setInspectProfile(column: string, profile: VisageValue): void {
		this.presentPanel.setInspectProfile(column, profile);
	}

	public setLoadingInspection(state: boolean): void {
		this.presentPanel.setLoadingProgress(state);
	}

	public setInspectSelection(column: string, values: Map<string, any>): void {
		this.presentPanel.setInspectSelection(column, values);
	}

	public relayout(): void {
		this.presentPanel.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class TabularPrepareMaker extends TabularPresentMaker {

	private properties: TabularColumnProperties = null;

	constructor(conductor: Conductor, properties: TabularColumnProperties) {
		super(conductor);
		this.properties = properties;
	}

	public createCornerPanel(): TabularCornerPanel {
		return new TabularCornerPanel(this.conductor);
	}

	public createTitlePanel(): TabularColumnTitlePanel {
		return new TabularColumnTitlePanel(this.conductor, this.properties);
	}

}
