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
import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Composite from "webface/widgets/Composite";

import TreeViewer from "webface/viewers/TreeViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import TreeContentProvider from "webface/viewers/TreeContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import WebFontImage from "webface/graphics/WebFontImage";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import ReferenceNameListRequest from "padang/requests/ReferenceNameListRequest";

export default class PointerSelectionDialog extends TitleAreaDialog {

	private static INIT_WIDTH = 420;
	private static INIT_HEIGHT = 480;

	private conductor: Conductor = null;
	private viewer: TreeViewer = null;
	private selection: PointerElement = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(PointerSelectionDialog.INIT_WIDTH, PointerSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Pointer Dialog");
		this.setTitle("Result Pointer");
		this.setMessage("Please select a reference");
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(1, 10, 10, 10, 20);
		composite.setLayout(layout);

		this.createViewerPart(composite);
		this.initSelection();

	}

	private createViewerPart(parent: Composite): void {

		this.viewer = new TreeViewer(parent);
		this.viewer.setContentProvider(new PointerContentProvider(this.conductor));
		this.viewer.setLabelProvider(new PointerLabelProvider(this.conductor));
		this.viewer.setInput(this.conductor);

		let element = this.viewer.getElement();
		element.css("border", "1px solid #D8D8D8");

		let layoutData = new GridData(true, true);
		this.viewer.setLayoutData(layoutData);

		this.viewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				this.selection = null;
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					let element = selection.getFirstElement();
					if (!(element instanceof GroupPointerElement)) {
						this.selection = element;
					}
				}
				this.updatePageComplete();
			}
		});
	}

	private initSelection(): void {

	}

	private updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		if (this.selection === null) {
			this.setErrorMessage("Please select a reference");
			return;
		}

		this.okButton.setEnabled(true);
	}

	public getLiteral(): string {
		return this.selection.getLiteral();
	}

}

abstract class BaseProvider {

	protected conductor: Conductor;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class PointerContentProvider extends BaseProvider implements TreeContentProvider {

	public getElements(conductor: Conductor, callback: (elements: any[]) => void): void {
		let request = new ReferenceNameListRequest([]);
		this.conductor.submit(request, (names: string[]) => {
			let elements: PointerElement[] = [];
			for (let name of names) {
				let literal = "=`" + name + "`"
				elements.push(new LocalPointerElement(conductor, name, literal));
			}
			elements.push(new FolderPointerElement(conductor));
			callback(elements);
		});
	}

	public hasChildren(element: PointerElement, callback: (state: boolean) => void): void {

	}

	public getChildren(parentElement: PointerElement, callback: (elements: any[]) => void): void {

	}

}

class PointerLabelProvider extends BaseProvider implements LabelProvider {

	public getText(element: PointerElement): string {
		return element.getLabel();
	}

	public getImage(element: PointerElement): WebFontImage {
		let icon = element.getIcon();
		return new WebFontImage("mdi", icon);
	}

	public getImageColor(element: PointerElement): string {
		return "#888";
	}

}

abstract class PointerElement {

	protected conductor: Conductor = null;
	protected label: string = null;
	protected literal: string = null;
	protected icon: string = null;
	protected usable: boolean = false;

	constructor(conductor: Conductor, label: string, literal: string, icon: string, usable: boolean) {
		this.conductor = conductor;
		this.label = label;
		this.literal = literal;
		this.icon = icon;
	}

	public getLabel(): string {
		return this.label;
	}

	public getLiteral(): string {
		return this.literal;
	}

	public getIcon(): string {
		return this.icon;
	}

	public isSelectable(): boolean {
		return false;
	}

	abstract hasChildren(callback: (state: boolean) => void): void;

	abstract getChildren(callback: (elements: any[]) => void): void;

}

class LocalPointerElement extends PointerElement {

	constructor(conductor: Conductor, name: string, label: string) {
		super(conductor, name, label, "mdi-variable", true);
	}

	public hasChildren(callback: (state: boolean) => void): void {
		callback(true);
	}

	public getChildren(callback: (elements: any[]) => void): void {

	}

}

abstract class GroupPointerElement extends PointerElement {

}

class FolderPointerElement extends GroupPointerElement {

	constructor(conductor: Conductor) {
		super(conductor, "Workspace", "workspace", "mdi-folder-outline", false);
	}

	public hasChildren(callback: (state: boolean) => void): void {
		callback(true);
	}

	public getChildren(callback: (elements: any[]) => void): void {

	}

}
