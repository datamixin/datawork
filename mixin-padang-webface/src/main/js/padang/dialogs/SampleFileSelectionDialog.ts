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

import * as functions from "webface/util/functions";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import VisageType from "bekasi/visage/VisageType";
import VisageTable from "bekasi/visage/VisageTable";
import VisageColumn from "bekasi/visage/VisageColumn";
import VisageRecord from "bekasi/visage/VisageRecord";

import * as widgets from "padang/widgets/widgets";

import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

export default class SampleFileSelectionDialog extends TitleAreaDialog {

	private static LIST_WIDTH = 240;
	private static ITEM_HEIGHT = 24;
	private static INIT_WIDTH = 640;
	private static INIT_HEIGHT = 480;

	private static BASE_URL = functions.getParentURL("samples/");

	private conductor: Conductor = null;
	private listViewer: TableViewer = null;
	private sampleViewer: TableViewer = null;
	private selection: FileElement = null;
	private selectionTable: VisageTable = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(SampleFileSelectionDialog.INIT_WIDTH, SampleFileSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Sample File Dialog");
		this.setTitle("Sample File");
		this.setMessage("Please select a file");
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(2, 10, 10);
		composite.setLayout(layout);

		this.createTitleText(composite, "Sample Files", SampleFileSelectionDialog.LIST_WIDTH);
		this.createTitleText(composite, "File Content", true);
		this.createListViewerPart(composite);
		this.createSampleViewerPart(composite);
		this.initSelection();

	}

	private createTitleText(parent: Composite, text: string, width: number | boolean): void {
		let label = new Label(parent);
		label.setText(text);
		widgets.setGridData(label, width, SampleFileSelectionDialog.ITEM_HEIGHT);
	}

	private createListViewerPart(parent: Composite): void {

		let style = <TableViewerStyle>{
			fullSelection: true
		}
		this.listViewer = new TableViewer(parent, style);
		this.listViewer.setContentProvider(new FileContentProvider(this.conductor));
		this.listViewer.setLabelProvider(new FileLabelProvider(this.conductor));

		let element = this.listViewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(SampleFileSelectionDialog.LIST_WIDTH, true);
		this.listViewer.setLayoutData(layoutData);

		this.listViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					this.selection = selection.getFirstElement();
					this.updateSampleContent();
				} else {
					this.selection = null;
				}
				this.updatePageComplete();
			}
		});
	}

	private createSampleViewerPart(parent: Composite): void {

		this.sampleViewer = new TableViewer(parent);
		this.sampleViewer.setContentProvider(new SampleContentProvider(this.conductor));
		this.sampleViewer.setLabelProvider(new SampleLabelProvider(this.conductor));

		let element = this.sampleViewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(true, true);
		this.sampleViewer.setLayoutData(layoutData);

	}

	private initSelection(): void {
		let filename = SampleFileSelectionDialog.BASE_URL + "_files.csv";
		let request = new SampleFileContentRequest(filename);
		this.conductor.submit(request, (text: string) => {
			let lines = text.split("\n");
			let elements: FileElement[] = [];
			let counter = 0;
			for (let line of lines) {
				if (counter > 0) {
					let fields = line.split(";");
					let category = fields[0];
					let title = fields[1];
					let filePath = fields[2];
					let options = fields[3];
					let element = new FileElement(this.conductor, category, title, filePath, options);
					elements.push(element);
				}
				counter++;
			}
			this.listViewer.setInput(elements);
		});
	}

	private updateSampleContent(): void {
		let filename = SampleFileSelectionDialog.BASE_URL + this.selection.getFilePath();
		let request = new SampleFileContentRequest(filename);
		this.conductor.submit(request, (text: string) => {
			this.selectionTable = new VisageTable();
			let lines = text.split("\n");
			let counter = 0;
			for (let line of lines) {
				let fields = line.split(",");
				if (counter === 0) {
					let columns: VisageColumn[] = [];
					for (let field of fields) {
						let column = new VisageColumn(field);
						column.setType(VisageType.STRING);
						columns.push(column);
					}
					this.selectionTable.setColumns(columns)
				} else {
					let values: string[] = [];
					for (let field of fields) {
						values.push(field);
					}
					this.selectionTable.addRecord(values);
				}
				counter++;
			}
			this.sampleViewer.setInput(this.selectionTable);
		});
	}

	private updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		if (this.selection === null) {
			this.setErrorMessage("Please select a file");
			return;
		}

		this.okButton.setEnabled(true);
	}

	public getFilePath(): string {
		let basePath = SampleFileSelectionDialog.BASE_URL;
		let filePath = this.selection.getFilePath();
		return basePath + filePath;
	}

	public getOptions(): string {
		return this.selection.getOptions();
	}

	public getTable(): VisageTable {
		return this.selectionTable;
	}

}

abstract class BaseProvider {

	protected conductor: Conductor;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class FileContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: FileElement[]): number {
		return input.length;
	}

	public getElement(input: FileElement[], index: number): any {
		return input[index];
	}

}

class FileLabelProvider extends BaseProvider implements TableLabelProvider {

	private columns = ["Category", "Title"];

	public getColumnCount(_input: any): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: any, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: FileElement, columnIndex: number): string {
		if (columnIndex === 0) {
			return element.getCategory();
		} else if (columnIndex === 1) {
			return element.getTitle();
		} else {
			return null;
		}
	}

	public getColumnWidth(_input: any, columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				return columnIndex === 0 ? 80 : 140;
			}
		}
	}

}

class FileElement {

	protected conductor: Conductor = null;
	protected category: string = null;
	protected title: string = null;
	protected filePath: string = null;
	protected options: string = null;

	constructor(conductor: Conductor, category: string, title: any, filePath: string, options: string) {
		this.conductor = conductor;
		this.category = category;
		this.title = title;
		this.filePath = filePath;
		this.options = options;
	}

	public getCategory(): string {
		return this.category;
	}

	public getTitle(): string {
		return this.title;
	}

	public getFilePath(): string {
		return this.filePath;
	}

	public getOptions(): string {
		return this.options;
	}

}

class SampleContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: VisageTable): number {
		return input.recordCount();
	}

	public getElement(input: VisageTable, index: number): any {
		return input.getRecord(index);
	}

}

class SampleLabelProvider extends BaseProvider implements TableLabelProvider {

	public getColumnCount(input: VisageTable): number {
		let columns = input.getColumns();
		return columns.length;
	}

	public getColumnTitle(input: VisageTable, columnIndex: number): string {
		let columns = input.getColumns();
		let column = columns[columnIndex];
		return column.getKey();
	}

	public getColumnText(element: VisageRecord, columnIndex: number): any {
		return element.get(columnIndex);
	}

}

