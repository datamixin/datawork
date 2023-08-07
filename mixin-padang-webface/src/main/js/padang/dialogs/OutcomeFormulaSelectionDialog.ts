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

import DialogButtons from "webface/dialogs/DialogButtons";
import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import VisageValue from "bekasi/visage/VisageValue";

import * as widgets from "padang/widgets/widgets";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";
import OutcomeFormulaResultRequest from "padang/requests/OutcomeFormulaResultRequest";

export default class OutcomeFormulaSelectionDialog extends TitleAreaDialog {

	public static EDIT = "Edit";

	public static LIST_WIDTH = 320;
	public static ITEM_HEIGHT = 24;
	public static INIT_WIDTH = 720;
	public static INIT_HEIGHT = 540;

	private conductor: Conductor = null;
	private formulaViewer: TableViewer = null;
	private resultPart: Composite = null;
	private surfacePanel: SurfacePanel = null;
	private selected: FormulaEntry = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(OutcomeFormulaSelectionDialog.INIT_WIDTH, OutcomeFormulaSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Outcome Formula Selection Dialog");
		this.setTitle("Outcome Result Selection");
		this.setMessage("Please select an outcome result");
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(2, 10, 10);
		composite.setLayout(layout);

		this.createFieldLabel(composite, "Recommended", OutcomeFormulaSelectionDialog.LIST_WIDTH);
		this.createFieldLabel(composite, "Example Result", true);
		this.createListViewerPart(composite);
		this.createDetailViewerPart(composite);
		this.initSelection();

	}

	protected createButtons(buttons: DialogButtons): void {
		buttons.createCompleteButton(OutcomeFormulaSelectionDialog.EDIT, "btn-success");
		super.createButtons(buttons);
	}

	private createFieldLabel(parent: Composite, text: string, width: number | boolean): void {
		let label = this.createLabel(parent, text);
		widgets.setGridData(label, width, OutcomeFormulaSelectionDialog.ITEM_HEIGHT);
	}

	private createLabel(parent: Composite, text: string): Label {
		let label = new Label(parent);
		label.setText(text);
		widgets.css(label, "line-height", OutcomeFormulaSelectionDialog.ITEM_HEIGHT + "px");
		return label;
	}

	private createListViewerPart(parent: Composite): void {

		let style = <TableViewerStyle>{
			fullSelection: true
		}
		this.formulaViewer = new TableViewer(parent, style);
		this.formulaViewer.setContentProvider(new FormulaContentProvider(this.conductor));
		this.formulaViewer.setLabelProvider(new FormulaLabelProvider(this.conductor));

		let element = this.formulaViewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(OutcomeFormulaSelectionDialog.LIST_WIDTH, true);
		this.formulaViewer.setLayoutData(layoutData);

		this.formulaViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					this.selected = <FormulaEntry>selection.getFirstElement();
					this.updateResultContent();
				} else {
					this.selected = null;
				}
				this.updatePageComplete();
			}
		});
	}

	private createDetailViewerPart(parent: Composite): void {

		this.resultPart = new Composite(parent);

		let element = this.resultPart.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layout = new GridLayout(1, 0, 0);
		this.resultPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.resultPart.setLayoutData(layoutData);

	}

	private initSelection(): void {
		let request = new OutcomeFormulaListRequest();
		this.conductor.submit(request, (names: Map<string, string>) => {
			this.formulaViewer.setInput(names);
		});
	}

	public getSelection(): string {
		if (this.selected === null) {
			return null;
		} else {
			return this.selected.formula;
		}
	}

	private updateResultContent(): void {
		let request = new OutcomeFormulaResultRequest(this.selected.formula);
		this.conductor.submit(request, (value: VisageValue) => {
			if (this.surfacePanel !== null) {
				let control = this.surfacePanel.getControl();
				control.dispose();
			}
			let registry = SurfaceRegistry.getInstance();
			let leanName = value.xLeanName();
			let surface = registry.getByLeanName(leanName);
			this.surfacePanel = surface.createPanel(this.conductor);
			this.surfacePanel.createControl(this.resultPart);
			this.surfacePanel.setValue(value);
			let control = this.surfacePanel.getControl();
			let layoutData = new GridData(true, true);
			control.setLayoutData(layoutData);
			this.resultPart.relayout();
		});
	}

	private updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		if (this.selected === null) {
			this.setErrorMessage("Please select a routine");
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

class FormulaContentProvider extends BaseProvider implements ContentProvider {

	public getElementCount(input: Map<string, string>): number {
		return input.size;
	}

	public getElement(input: Map<string, string>, index: number): any {
		let counter = 0;
		for (let key of input.keys()) {
			let value = input.get(key);
			if (counter++ === index) {
				return new FormulaEntry(key, value);
			}
		}
		return null;
	}

}

class FormulaLabelProvider extends BaseProvider implements TableLabelProvider {

	private columns = ["Name", "Formula"];

	public getColumnCount(_input: any): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: any, columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: FormulaEntry, columnIndex: number): string {
		if (columnIndex === 0) {
			return element.name;
		} else {
			return element.formula;
		}
	}

	public getColumnWidth(_input: any, columnIndex: number): TableColumnWidth {
		return <TableColumnWidth>{
			getWidth: () => {
				if (columnIndex === 0) {
					return 140;
				} else {
					return 180;
				}
			}
		}
	}

}

class FormulaEntry {

	constructor(
		public name: string,
		public formula: string
	) {
	}

}