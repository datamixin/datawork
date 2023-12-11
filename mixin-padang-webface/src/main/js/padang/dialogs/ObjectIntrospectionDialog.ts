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
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";

import XPointer from "sleman/model/XPointer";
import SlemanCreator from "sleman/model/SlemanCreator";

import WebFontImage from "webface/graphics/WebFontImage";

import TreeViewer from "webface/viewers/TreeViewer";
import TableViewer from "webface/viewers/TableViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import PixelColumnWidth from "webface/viewers/PixelColumnWidth";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import TreeContentProvider from "webface/viewers/TreeContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import FormulaParser from "bekasi/FormulaParser";

import VisageList from "bekasi/visage/VisageList";
import VisageType from "bekasi/visage/VisageType";
import VisageBrief from "bekasi/visage/VisageBrief";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import VisageValue from "bekasi/visage/VisageValue";

import * as widgets from "padang/widgets/widgets";

import Example from "padang/functions/system/Example";
import BriefValueList from "padang/functions/system/BriefValueList";

import { getIconOrSymbol } from "padang/view/TypeDecoration";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import FormulaEvaluateRequest from "padang/requests/FormulaEvaluateRequest";

export default class ObjectIntrospectionDialog extends TitleAreaDialog {

	private static TREE_WIDTH = 240;
	private static ITEM_HEIGHT = 24;
	private static INIT_WIDTH = 640;
	private static INIT_HEIGHT = 560;
	private static BRIEF_HEIGHT = 160;

	private formula: string = null;
	private conductor: Conductor = null;
	private treeViewer: TreeViewer = null;
	private briefViewer: TableViewer = null
	private examplePart: Composite = null;
	private surfacePanel: SurfacePanel = null;
	private selection: BriefElement = null;

	constructor(conductor: Conductor, formula: string) {
		super();
		this.conductor = conductor;
		this.formula = formula;
		this.setDialogSize(ObjectIntrospectionDialog.INIT_WIDTH, ObjectIntrospectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Object Introspection Dialog");
		this.setTitle("Object Structure");
		this.setMessage("Please select a property");
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 2, 10, 10, 5, 0);

		this.createTitleText(composite, "Structure", ObjectIntrospectionDialog.TREE_WIDTH);
		this.createTitleText(composite, "Content", true);
		this.createStructurePart(composite);
		this.createContentPart(composite);

	}

	private createTitleText(parent: Composite, text: string, width: number | boolean): Label {
		let label = new Label(parent);
		label.setText(text);
		widgets.css(label, "line-height", ObjectIntrospectionDialog.ITEM_HEIGHT + "px");
		widgets.setGridData(label, width, ObjectIntrospectionDialog.ITEM_HEIGHT);
		return label;
	}

	private createStructurePart(parent: Composite): void {

		this.treeViewer = new TreeViewer(parent);
		this.treeViewer.setContentProvider(new ObjectContentProvider(this, this.formula));
		this.treeViewer.setLabelProvider(new ObjectLabelProvider());

		widgets.css(this.treeViewer, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.treeViewer, ObjectIntrospectionDialog.TREE_WIDTH, true);

		this.treeViewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					this.selection = selection.getFirstElement();
					this.updateBriefContent();
					this.updateExampleContent();
				} else {
					this.selection = null;
				}
				this.updatePageComplete();
			}
		});

		let parser = new FormulaParser();
		let expression = parser.parse(this.formula);
		this.getBriefValueList(expression, (list: VisageList) => {
			this.treeViewer.setInput(list)
		});
	}

	private updateBriefContent(): void {
		this.briefViewer.setInput(this.selection.brief);
	}

	private updateExampleContent(): void {
		let creator = SlemanCreator.eINSTANCE;
		let call = creator.createCall(Example.FUNCTION_NAME, this.selection.pointer);
		let literal = "=" + call.toLiteral();
		let request = new FormulaEvaluateRequest(literal);
		this.conductor.submit(request, (value: VisageValue) => {
			widgets.dispose(this.surfacePanel);
			let registry = SurfaceRegistry.getInstance();
			let surface = registry.get(value);
			let panel = surface.createPanel(this.conductor, true);
			panel.createControl(this.examplePart);
			widgets.css(panel, "text-align", "left");
			widgets.css(panel, "border", "1px solid #D8D8D8");
			panel.setValue(value);
			widgets.setGridData(panel, true, true);
			this.examplePart.relayout();
			this.surfacePanel = panel;
		});

	}

	private createContentPart(parent: Composite): void {

		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 1, 0, 0);
		widgets.setGridData(composite, true, true);

		this.createBriefViewer(composite);
		this.createExamplePart(composite);
	}

	private createBriefViewer(parent: Composite): void {

		let style = <TableViewerStyle>{
			headerVisible: false
		}
		this.briefViewer = new TableViewer(parent, style);
		this.briefViewer.setContentProvider(new BriefContentProvider());
		this.briefViewer.setLabelProvider(new BriefLabelProvider());

		widgets.css(this.briefViewer, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.briefViewer, true, ObjectIntrospectionDialog.BRIEF_HEIGHT);

	}

	private createExamplePart(parent: Composite): void {
		this.examplePart = new Composite(parent);
		widgets.setGridLayout(this.examplePart, 1, 0, 0, 0, 0);
		widgets.setGridData(this.examplePart, true, true);
		this.createTitleText(this.examplePart, "Example", true);
	}

	public getBriefValueList(pointer: XPointer, callback: (list: VisageList) => void): void {
		let creator = SlemanCreator.eINSTANCE;
		let call = creator.createCall(BriefValueList.FUNCTION_NAME, pointer);
		let literal = "=" + call.toLiteral();
		let request = new FormulaEvaluateRequest(literal);
		this.conductor.submit(request, callback);
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

}

class BriefElement {

	constructor(
		public pointer: XPointer,
		public brief: VisageBrief) { }

}

class ObjectContentProvider implements TreeContentProvider {

	private dialog: ObjectIntrospectionDialog = null;
	private formula: string = null;

	constructor(dialog: ObjectIntrospectionDialog, formula: string) {
		this.dialog = dialog;
		this.formula = formula;
	}

	private createElementList(parent: XPointer, list: VisageList, callback: (elements: any) => void): void {
		let values = list.getValues();
		let elements: BriefElement[] = [];
		for (let value of values) {
			let brief = <VisageBrief>value;
			let key = brief.getKey();
			let creator = SlemanCreator.eINSTANCE;
			let pointer = creator.createMember(parent, key);
			let element = new BriefElement(pointer, brief);
			elements.push(element);
		}
		callback(elements);
	}

	public getElements(list: VisageList, callback: (elements: any[]) => void): void {
		let parser = new FormulaParser();
		let expression = <XPointer>parser.parse(this.formula);
		this.createElementList(expression, list, callback);
	}

	public hasChildren(element: BriefElement, callback: (state: boolean) => void): void {
		let type = element.brief.getType();
		if (type === VisageType.MIXINLIST) {
			callback(false);
		} else {
			let children = element.brief.getChildren()
			callback(children > 0);
		}
	}

	public getChildren(parentElement: BriefElement, callback: (elements: any[]) => void): void {
		this.dialog.getBriefValueList(parentElement.pointer, (list: VisageList) => {
			this.createElementList(parentElement.pointer, list, callback);
		});
	}

}

class ObjectLabelProvider implements LabelProvider {

	public getText(element: BriefElement): string {
		return element.brief.getKey();
	}

	public getImage(element: BriefElement): WebFontImage {
		let type = element.brief.getType();
		if (VisageType.isTemporal(type)) {
			type = VisageType.DATETIME;
		}
		let icon = getIconOrSymbol(type);
		let image = new WebFontImage("mdi", icon);
		return image;
	}

	public getImageColor(_element: any): string {
		return "#888";
	}

}

class BriefContentProvider implements ContentProvider {

	private fields = {
		type: "Type",
		simple: "Simple",
		propose: "Propose",
		digest: "Digest",
		key: "Key",
		value: "Value"
	};

	public getElementCount(_brief: VisageBrief): number {
		return Object.keys(this.fields).length;
	}

	public getElement(brief: VisageBrief, index: number): any {
		let keys = Object.keys(this.fields);
		let key = keys[index];
		return [this.fields[key], brief[key]];
	}

}

class BriefLabelProvider implements TableLabelProvider {

	private columns = ["Name", "Value"];

	public getColumnCount(_input: any[]): number {
		return this.columns.length;
	}

	public getColumnTitle(_input: any[], columnIndex: number): string {
		return this.columns[columnIndex];
	}

	public getColumnText(element: any[], columnIndex: number): string {
		return element[columnIndex];
	}

	public getColumnWidth(_input: VisageBrief, columnIndex: number): TableColumnWidth {
		if (columnIndex === 0) {
			return new PixelColumnWidth(100);
		}
		return new PixelColumnWidth(200);
	}

}