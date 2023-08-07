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
import * as functions from "webface/functions";

import Conductor from "webface/wef/Conductor";

import Form from "webface/widgets/Form";
import Input from "webface/widgets/Input";
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import * as utils from "webface/util/functions";

import Selection from "webface/viewers/Selection";
import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import WebFontImage from "webface/graphics/WebFontImage";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

import * as widgets from "padang/widgets/widgets";

import UploadFileListRequest from "padang/requests/UploadFileListRequest";

export default class UploadFileSelectionDialog extends TitleAreaDialog {

	private static BASE_URL = utils.getParentURL("uploads/");

	private static HEADER_HEIGHT = 40;
	private static INIT_WIDTH = 640;
	private static INIT_HEIGHT = 480;
	private static FORM_WIDTH = 160;
	private static BUTTON_WIDTH = 100;

	private conductor: Conductor = null;
	private filesViewer: TableViewer = null;
	private selection: string = null;
	private fileInput: Input = null;
	private uploadButton: Button = null;
	private removeButton: Button = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(UploadFileSelectionDialog.INIT_WIDTH, UploadFileSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Upload File Dialog");
		this.setTitle("Upload File");
		this.setMessage("Please select a file");
	}

	protected createControl(parent: Composite): void {
		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 1, 10, 10);
		this.createHeaderPart(composite);
		this.createViewerPart(composite);
		this.refreshList();

	}

	private createHeaderPart(parent: Composite): void {
		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 4);
		widgets.setGridData(composite, true, UploadFileSelectionDialog.HEADER_HEIGHT);
		this.createCaptionLabel(composite);
		this.createUploadForm(composite);
		this.createRemoveButton(composite);
	}

	private createCaptionLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Uploaded Files");
		widgets.css(label, "line-height", UploadFileSelectionDialog.HEADER_HEIGHT + "px");
		widgets.setGridData(label, true, true);
	}

	private createUploadForm(parent: Composite): void {
		let form = new Form(parent);
		widgets.setGridLayout(form, 1, 0, 0, 0, 0);
		widgets.setGridData(form, UploadFileSelectionDialog.FORM_WIDTH, true,);
		this.createFileInput(form);
		this.createUploadButton(form);
	}

	private createFileInput(parent: Composite): void {
		this.fileInput = new Input(parent);
		this.fileInput.setType("file");
		this.fileInput.setName("file");
		this.fileInput.setVisible(false);
		this.fileInput.onChange((event: any) => {
			let file = event.target.files[0];
			if (file !== undefined) {
				this.uploadButton.setEnabled(false);
				let filename = file.name;
				var formData = new FormData();
				formData.append("file", file);
				$.ajax({
					url: UploadFileSelectionDialog.BASE_URL,
					type: "post",
					data: formData,
					contentType: false,
					processData: false,
					success: (response) => {
						if (response !== 0) {
							this.refreshList(filename);
						} else {
							this.setMessage("Fail upload file " + filename);
						}
						this.uploadButton.setEnabled(true);
						this.fileInput.setValue("");
					},
				});
			}
		});
		widgets.setGridData(this.fileInput, 0, 0);
	}

	private createUploadButton(parent: Composite): void {
		this.uploadButton = this.createButton(parent, "Upload File...", "mdi-cloud-upload-outline");
		widgets.addClass(this.uploadButton, "btn-primary");
		widgets.setGridData(this.uploadButton, true, true);
		this.uploadButton.onSelection(() => {
			let element = this.fileInput.getElement();
			element.click();
		});
	}

	private createRemoveButton(parent: Composite): void {
		this.removeButton = this.createButton(parent, "Remove", "mdi-trash-can-outline", "#888");
		this.removeButton.setEnabled(false);
		widgets.setGridData(this.removeButton, UploadFileSelectionDialog.BUTTON_WIDTH, true);
		this.removeButton.onSelection(() => {
			let dialog = new ConfirmationDialog();
			dialog.setPrompt("Remove uploaded file " + this.selection + "?");
			dialog.setWindowTitle("Uploaded File Remove");
			dialog.open((result: string) => {
				if (result === ConfirmationDialog.OK) {
					$.ajax({
						url: UploadFileSelectionDialog.BASE_URL + this.selection,
						type: "delete",
						success: (response) => {
							let removed = response["removed"];
							if (removed === true) {
								this.refreshList();
							}
						},
					});
				}
			});
		});
	}

	public createButton(parent: Composite, text: string, icon?: string, color?: string): Button {
		let button = new Button(parent);
		button.setText(text);
		let element = button.getElement();
		element.css("line-height", "28px");
		element.css("padding-top", 0);
		element.css("padding-bottom", 0);
		if (icon !== undefined) {
			let image = new WebFontImage("mdi", icon);
			let element = button.prependImage(image);
			element.css("font-size", "24px");
			element.css("line-height", "24px");
			if (color !== undefined) {
				element.css("color", color);
			}
		}
		return button;
	}

	private createViewerPart(parent: Composite): void {
		let style = <TableViewerStyle>{
			fullSelection: true
		}
		this.filesViewer = new TableViewer(parent, style);
		this.filesViewer.setContentProvider(new FileContentProvider(this.conductor));
		this.filesViewer.setLabelProvider(new FileLabelProvider(this.conductor));
		widgets.css(this.filesViewer, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.filesViewer, true, true);

		this.filesViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					let record = selection.getFirstElement();
					this.selection = record[FileLabelProvider.NAME];
				} else {
					this.selection = null;
				}
				this.removeButton.setEnabled(this.selection !== null);
				this.updatePageComplete();
			}
		});
	}

	private refreshList(filename?: string): void {
		let request = new UploadFileListRequest();
		this.conductor.submit(request, (files: any[]) => {
			this.filesViewer.setInput(files);
			if (filename === undefined) {
				if (files.length > 0) {
					this.setSelection(files[0]);
				}
			} else {
				for (let file of files) {
					if (file[FileLabelProvider.NAME] === filename) {
						this.setSelection(file);
						break;
					}
				}
			}
		});
	}

	private setSelection(filename: any): void {
		let selection = new Selection(filename);
		this.filesViewer.setSelection(selection);
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
		let basePath = UploadFileSelectionDialog.BASE_URL;
		return basePath + this.selection;
	}

}

abstract class BaseProvider {

	protected conductor: Conductor;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class FileContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: any[]): number {
		return input.length;
	}

	public getElement(input: any[], index: number): any {
		return input[index];
	}

}

class FileLabelProvider extends BaseProvider implements TableLabelProvider {

	public static NAME = "name";

	private columns = ["Name", "Modified", "Size"];
	private names = [FileLabelProvider.NAME, "modified", "size"];
	private widths = [320, 150, 100];

	public getColumnCount(_input: any): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: any, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: any, columnIndex: number): string {
		let name = this.names[columnIndex];
		let value = element[name];
		if (columnIndex === 1) {
			return functions.formatDate(value);
		} else if (columnIndex === 2) {
			return functions.formatNumber(value, "0 b");
		} else {
			return value;
		}
	}

	public getColumnWidth(_input: any, columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				return this.widths[columnIndex];
			}
		}
	}

}
