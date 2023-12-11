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

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import * as widgets from "padang/widgets/widgets";

import PlotListRequest from "rinjani/requests/PlotListRequest";
import PlotDetailRequest from "rinjani/requests/PlotDetailRequest";

export default class PlotSelectionPanel extends ConductorPanel {

	public static LIST_WIDTH = 260;
	public static ITEM_HEIGHT = 24;

	private selectedName: string = null;
	private composite: Composite = null;
	private listViewer: TableViewer = null;
	private detailViewer: TableViewer = null;
	private updateComplete = () => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 0, 0);

		this.createFieldLabel(this.composite, "Plot List", PlotSelectionPanel.LIST_WIDTH);
		this.createFieldLabel(this.composite, "Plot Detail", true);
		this.createListViewerPart(this.composite);
		this.createDetailViewerPart(this.composite);
		this.initSelection();

	}

	private createFieldLabel(parent: Composite, text: string, width: number | boolean): void {
		let label = this.createLabel(parent, text);
		widgets.setGridData(label, width, PlotSelectionPanel.ITEM_HEIGHT);
	}

	private createLabel(parent: Composite, text: string): Label {
		let label = new Label(parent);
		label.setText(text);
		widgets.css(label, "line-height", PlotSelectionPanel.ITEM_HEIGHT + "px");
		return label;
	}

	private createListViewerPart(parent: Composite): void {

		let style = <TableViewerStyle>{
			fullSelection: true
		}
		this.listViewer = new TableViewer(parent, style);
		this.listViewer.setContentProvider(new PlotContentProvider(this.conductor));
		this.listViewer.setLabelProvider(new PlotLabelProvider(this.conductor));

		widgets.css(this.listViewer, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.listViewer, PlotSelectionPanel.LIST_WIDTH, true);

		this.listViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					this.selectedName = selection.getFirstElement();
					this.updateDetailContent();
				} else {
					this.selectedName = null;
				}
				this.updateComplete();
			}
		});
	}

	private updateDetailContent(): void {
		let request = new PlotDetailRequest(this.selectedName);
		this.conductor.submit(request, (detail: Map<string, any>) => {
			this.detailViewer.setInput(detail);
		});
	}

	private createDetailViewerPart(parent: Composite): void {
		this.detailViewer = new TableViewer(parent);
		this.detailViewer.setContentProvider(new DetailContentProvider(this.conductor));
		this.detailViewer.setLabelProvider(new DetailLabelProvider(this.conductor));
		widgets.css(this.detailViewer, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.detailViewer, true, true);
	}

	private initSelection(): void {
		let request = new PlotListRequest();
		this.conductor.submit(request, (names: string[]) => {
			this.listViewer.setInput(names);
		});
	}

	public getSelection(): string {
		return this.selectedName;
	}

	public setOnComplete(complete: () => void): void {
		this.updateComplete = complete;
	}

	public getControl(): Control {
		return this.composite;
	}

}

abstract class BaseProvider {

	protected conductor: Conductor;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class PlotContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: string[]): number {
		return input.length;
	}

	public getElement(input: string[], index: number): any {
		return input[index];
	}

}

class PlotLabelProvider extends BaseProvider implements TableLabelProvider {

	private columns = ["Plot"];

	public getColumnCount(_input: any): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: any, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: string, _columnIndex: number): string {
		return element;
	}

	public getColumnWidth(_input: any, _columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				return 240;
			}
		}
	}

}

class DetailContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: Map<string, any>): number {
		return input.size;
	}

	public getElement(input: Map<string, any>, index: number): any {
		let entries: [string, any][] = [];
		for (let key of input.keys()) {
			let value = input.get(key);
			entries.push([key, value]);
		}
		return entries[index];
	}

}

class DetailLabelProvider extends BaseProvider implements TableLabelProvider {

	private columns = ["Property", "Value"];

	public getColumnCount(_input: Map<string, any>): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: Map<string, any>, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: any[], columnIndex: number): any {
		if (columnIndex === 0) {
			return element[0];
		} else {
			let value = element[1];
			return value;
		}
	}

	public getColumnWidth(_input: any, columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				return columnIndex === 0 ? 140 : 240;
			}
		}
	}

}

