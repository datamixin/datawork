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

import * as functions from "webface/util/functions";

import VisageError from "bekasi/visage/VisageError";

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";

import * as grid from "padang/grid/grid";
import GridControl from "padang/grid/GridControl";
import GridEventAdapter from "padang/grid/GridEventAdapter";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";

import DisplayHeaderPanel from "padang/view/present/DisplayHeaderPanel";

import MutationInstoreView from "padang/view/instore/MutationInstoreView";
import DataFormCellValuePanel from "padang/view/instore/DataFormCellValuePanel";
import DataFormContentProvider from "padang/view/instore/DataFormContentProvider";
import DataFormColumnLabelPanel from "padang/view/instore/DataFormColumnLabelPanel";
import DataFormMarkerLabelPanel from "padang/view/instore/DataFormMarkerLabelPanel";

import DataFormApplyRequest from "padang/requests/instore/DataFormApplyRequest";

export default class DataFormInstoreView extends MutationInstoreView {

	private static HEADER_HEIGHT = 32;

	private composite: Composite = null;
	private headerPanel: DisplayHeaderPanel = null;;
	private gridControl: GridControl = null;
	private provider: DataFormContentProvider = null;
	private extender: DataFormLabelExtender = null;

	constructor(conductor: Conductor) {
		super(conductor);
		this.headerPanel = new DisplayHeaderPanel(conductor);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-data-form-instore-view");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createHeaderPanel(this.composite);
		this.createGridControl(this.composite);
	}

	private createHeaderPanel(parent: Composite): void {
		this.headerPanel.createControl(parent);
		view.css(this.headerPanel, "line-height", DataFormInstoreView.HEADER_HEIGHT + "px");
		view.setGridData(this.headerPanel, true, DataFormInstoreView.HEADER_HEIGHT);
	}

	private createGridControl(parent: Composite): void {

		this.provider = new DataFormContentProvider(this.conductor);
		this.provider.setOnErrorRaised((error: VisageError) => {
			this.headerPanel.setError(error);
		});
		this.provider.setOnCountChanged((row: number, column: number) => {
			this.headerPanel.setRowColumn(row, column);
		});
		this.provider.setOnContentChanged((mutation: VisageMutation) => {
			this.mutate(mutation);
		});

		this.gridControl = new GridControl(parent);
		view.setGridData(this.gridControl, true, true);
		view.css(this.gridControl, "border", "1px solid #E8E8E8");

		this.gridControl.setProvider(this.provider);
		this.gridControl.setAdapter(new DataFormEventAdapter(this.conductor, this.provider));

		this.extender = new DataFormLabelExtender(this.conductor, this.provider);
		this.gridControl.setExtender(this.extender);
	}

	public refresh(): void {
		this.gridControl.refresh(() => { });
	}

	public setColumnWidth(name: string, width: number): void {
		let property = this.extender.getColumnProperties();
		property.applyWidth(name, width);
	}

	public mutate(mutation: VisageMutation): void {

		let rowCount = mutation.getRowCount();
		let columnCount = mutation.getColumnCount();
		this.headerPanel.setRowColumn(rowCount, columnCount);

		this.gridControl.mutate(mutation);
	}

	public onFullDeckOK(callback: () => void): void {
		let data = this.provider.getData();
		let types = this.provider.getTypes();
		let request = new DataFormApplyRequest(data, types);
		this.conductor.submit(request, callback);
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

abstract class ProviderBase {

	protected conductor: Conductor = null;
	protected provider: DataFormContentProvider = null;

	constructor(conductor: Conductor, provider: DataFormContentProvider) {
		this.conductor = conductor
		this.provider = provider;
	}

}

class DataFormLabelExtender extends ProviderBase implements GridLabelExtender {

	private properties = new DefaultColumnProperties(this.conductor);

	public getColumnLabelPanel(): DataFormColumnLabelPanel {
		return new DataFormColumnLabelPanel(this.provider);
	}

	public getColumnExtraPanel(): DataFormColumnExtraPanel {
		return new DataFormColumnExtraPanel(this.conductor, this.provider);
	}

	public getColumnProperties(): DefaultColumnProperties {
		return this.properties;
	}

	public getMarkerLabelPanel(): DataFormMarkerLabelPanel {
		return new DataFormMarkerLabelPanel(this.provider);
	}

	public getMarkerExtraPanel(): DataFormMarkerExtraPanel {
		return new DataFormMarkerExtraPanel(this.conductor, this.provider);
	}

	public getCellValuePanel(): DataFormCellValuePanel {
		return new DataFormCellValuePanel(this.provider);
	}

}

class DataFormEventAdapter extends ProviderBase implements GridEventAdapter {

	public getOnRowExpand(): () => boolean {
		return (): boolean => {
			return this.provider.appendRow();
		};
	}

}

class DataFormMarkerExtraPanel extends ProviderBase {

	private iconPanel = new IconPanel();

	public createControl(parent: Composite, index: number): void {
		this.iconPanel.createControl(parent);
		this.iconPanel.setIcon("mdi-table-row-plus-after");
		this.iconPanel.setOnSelection(() => {
			this.provider.appendRow();
		});
		view.css(this.iconPanel, "cursor", "pointer");
		view.css(this.iconPanel, "border-bottom", "1px solid " + grid.BORDER_COLOR);
		view.css(this.iconPanel, "line-height", GridControlStyle.ROW_HEIGHT + "px");
	}

	public getControl(): Control {
		return this.iconPanel.getControl();
	}

}


class DataFormColumnExtraPanel extends ProviderBase {

	private addIconPanel = new IconPanel();

	public createControl(parent: Composite, index: number): void {

		this.addIconPanel.createControl(parent);
		this.addIconPanel.setIcon("mdi-table-column-plus-after");
		view.css(this.addIconPanel, "cursor", "pointer");
		view.css(this.addIconPanel, "border-right", "1px solid " + grid.BORDER_COLOR);
		view.css(this.addIconPanel, "line-height", GridControlStyle.HEADER_HEIGHT + "px");

		this.addIconPanel.setOnSelection(() => {
			let keys = this.provider.selectColumnKeys();
			let key = functions.getIncrementedName("Column", keys);
			this.provider.appendColumn(key);
		});
	}

	public getControl(): Control {
		return this.addIconPanel.getControl();
	}

}
