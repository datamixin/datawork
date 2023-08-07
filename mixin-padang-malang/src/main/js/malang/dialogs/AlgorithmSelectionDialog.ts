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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Label from "webface/widgets/Label";
import Composite from "webface/widgets/Composite";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

import AlgorithmListRequest from "malang/requests/AlgorithmListRequest";
import AlgorithmDetailRequest from "malang/requests/AlgorithmDetailRequest";

export default class AlgorithmSelectionDialog extends TitleAreaDialog {

	public static LIST_WIDTH = 260;
	public static ITEM_HEIGHT = 24;
	public static INIT_WIDTH = 720;
	public static INIT_HEIGHT = 540;

	private conductor: Conductor = null;
	private listViewer: TableViewer = null;
	private detailViewer: TableViewer = null;
	private selectedName: string = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(AlgorithmSelectionDialog.INIT_WIDTH, AlgorithmSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Algorithm Selection Dialog");
		this.setTitle("Algorithm Selection");
		this.setMessage("Please select an algorithm");
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(2, 10, 10);
		composite.setLayout(layout);

		this.createFieldLabel(composite, "Algorithm List", AlgorithmSelectionDialog.LIST_WIDTH);
		this.createFieldLabel(composite, "Algorithm Detail", true);
		this.createListViewerPart(composite);
		this.createDetailViewerPart(composite);
		this.initSelection();

	}

	private createFieldLabel(parent: Composite, text: string, width: number | boolean): void {
		let label = this.createLabel(parent, text);
		widgets.setGridData(label, width, AlgorithmSelectionDialog.ITEM_HEIGHT);
	}

	private createLabel(parent: Composite, text: string): Label {
		let label = new Label(parent);
		label.setText(text);
		widgets.css(label, "line-height", AlgorithmSelectionDialog.ITEM_HEIGHT + "px");
		return label;
	}

	private createListViewerPart(parent: Composite): void {

		let style = <TableViewerStyle>{
			fullSelection: true
		}
		this.listViewer = new TableViewer(parent, style);
		this.listViewer.setContentProvider(new AlgorithmContentProvider(this.conductor));
		this.listViewer.setLabelProvider(new AlgorithmLabelProvider(this.conductor));

		let element = this.listViewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(AlgorithmSelectionDialog.LIST_WIDTH, true);
		this.listViewer.setLayoutData(layoutData);

		this.listViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					this.selectedName = selection.getFirstElement();
					this.updateDetailContent();
				} else {
					this.selectedName = null;
				}
				this.updatePageComplete();
			}
		});
	}

	private createDetailViewerPart(parent: Composite): void {

		this.detailViewer = new TableViewer(parent);
		this.detailViewer.setContentProvider(new DetailContentProvider(this.conductor));
		this.detailViewer.setLabelProvider(new DetailLabelProvider(this.conductor));

		let element = this.detailViewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(true, true);
		this.detailViewer.setLayoutData(layoutData);

	}

	private initSelection(): void {
		let request = new AlgorithmListRequest();
		this.conductor.submit(request, (names: string[]) => {
			this.listViewer.setInput(names);
		});
	}

	public getSelection(): string {
		return this.selectedName;
	}

	private updateDetailContent(): void {
		let request = new AlgorithmDetailRequest(this.selectedName);
		this.conductor.submit(request, (detail: Map<string, any>) => {
			this.detailViewer.setInput(detail);
		});
	}

	private updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		if (this.selectedName === null) {
			this.setErrorMessage("Please select an algorithm");
			return;
		}

		this.okButton.setEnabled(true);
	}

}

abstract class BaseProvider {

	protected conductor: Conductor;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class AlgorithmContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: string[]): number {
		return input.length;
	}

	public getElement(input: string[], index: number): any {
		return input[index];
	}

}

class AlgorithmLabelProvider extends BaseProvider implements TableLabelProvider {

	private columns = ["Algorithm"];

	public getColumnCount(input: any): number {
		return this.columns.length;
	}

	public getColumnTitle(input: any, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: string, columnIndex: number): string {
		return element;
	}

	public getColumnWidth(input: any, columnIndex: number): TableColumnWidth {
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

	public getColumnCount(input: Map<string, any>): number {
		return this.columns.length;
	}

	public getColumnTitle(input: Map<string, any>, columnIndex: number): string {
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

	public getColumnWidth(input: any, columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				return columnIndex === 0 ? 140 : 260;
			}
		}
	}

}

