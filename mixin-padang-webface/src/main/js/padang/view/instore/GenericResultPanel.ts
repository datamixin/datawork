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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import VisageError from "bekasi/visage/VisageError";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridControl from "padang/grid/GridControl";
import GridLabelExtender from "padang/grid/GridLabelExtender";

import VisageMutation from "padang/visage/VisageMutation";

import DefaultCellValuePanel from "padang/view/DefaultCellValuePanel";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";
import BufferedContentProvider from "padang/view/BufferedContentProvider";

import DisplayHeaderPanel from "padang/view/present/DisplayHeaderPanel";

export default class GenericResultPanel extends ConductorPanel {

	private static HEADER_HEIGHT = 32;

	private composite: Composite = null;
	private headerPanel: DisplayHeaderPanel = null;;
	private gridControl: GridControl = null;
	private provider: BufferedContentProvider = null;
	private extender: SourceLabelExtender = null;

	constructor(conductor: Conductor) {
		super(conductor);
		this.headerPanel = new DisplayHeaderPanel(conductor);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-generic-result-panel");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createHeaderPanel(this.composite);
		this.createGridControl(this.composite);
	}

	private createHeaderPanel(parent: Composite): void {
		this.headerPanel.createControl(parent);
		view.css(this.headerPanel, "background-color", grid.SHADED_COLOR);
		view.css(this.headerPanel, "border-bottom", "1px solid " + grid.BORDER_COLOR);
		view.css(this.headerPanel, "line-height", GenericResultPanel.HEADER_HEIGHT + "px");
		view.setGridData(this.headerPanel, true, GenericResultPanel.HEADER_HEIGHT);
	}

	private createGridControl(parent: Composite): void {

		this.gridControl = new GridControl(parent);
		view.setGridData(this.gridControl, true, true);

		this.extender = new SourceLabelExtender(this.conductor);
		this.gridControl.setExtender(this.extender);

		this.provider = new BufferedContentProvider(this.conductor);
		this.provider.setOnErrorRaised((error: VisageError) => {
			this.headerPanel.setError(error);
		});
		this.provider.setOnCountChanged((rowCount: number, columnCount: number) => {
			this.headerPanel.setRowColumn(rowCount, columnCount);
		});
		this.gridControl.setProvider(this.provider);
	}

	public refresh(): void {
		this.provider.clearBuffer();
		this.headerPanel.setMessage("Loading result...");
		this.gridControl.refresh(() => {

		});
	}

	public mutate(mutation: VisageMutation): void {

		let rowCount = mutation.getRowCount();
		let columnCount = mutation.getColumnCount();
		this.headerPanel.setRowColumn(rowCount, columnCount);

		// Clear buffer untuk range mutation
		let start = mutation.getRowStart();
		let end = mutation.getRowEnd();
		this.provider.clearRowBuffer(start, end);

		this.gridControl.mutate(mutation);
	}

	public setError(error: VisageError): void {
		this.headerPanel.setError(error);
	}

	public relayout(): void {
		this.gridControl.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

abstract class ConductorBase {

	protected conductor: Conductor = null;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class SourceLabelExtender extends ConductorBase implements GridLabelExtender {

	private properties = new DefaultColumnProperties(this.conductor);

	public getColumnLabelPanel(): DefaultColumnLabelPanel {
		return new DefaultColumnLabelPanel(this.conductor);
	}

	public getColumnProperties(): DefaultColumnProperties {
		return this.properties;
	}

	public getCellValuePanel(): DefaultCellValuePanel {
		return new DefaultCellValuePanel(this.conductor);
	}

}
