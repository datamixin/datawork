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
import * as webface from "webface/webface";
import * as functions from "webface/functions";

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";
import SelectionPart from "webface/wef/SelectionPart";

import Label from "webface/widgets/Label";
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import InputDialog from "webface/dialogs/InputDialog";
import InputValidator from "webface/dialogs/InputValidator";
import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

import WebFontImage from "webface/graphics/WebFontImage";

import MessageDialog from "webface/dialogs/MessageDialog";

import RunspaceItemOpenRequest from "padang/requests/findout/RunspaceItemOpenRequest";
import RunspaceItemMoveRequest from "padang/requests/findout/RunspaceItemMoveRequest";
import RunspaceItemRenameRequest from "padang/requests/findout/RunspaceItemRenameRequest";
import RunspaceItemRemoveRequest from "padang/requests/findout/RunspaceItemRemoveRequest";
import RunspaceItemDuplicateRequest from "padang/requests/findout/RunspaceItemDuplicateRequest";
import RunspaceItemSelectionRequest from "padang/requests/findout/RunspaceItemSelectionRequest";
import RunspaceItemIsRemovableRequest from "padang/requests/findout/RunspaceItemIsRemovableRequest";
import RunspaceItemNameValidationRequest from "padang/requests/findout/RunspaceItemNameValidationRequest";

import RunspaceFolderSelectionDialog from "bekasi/dialogs/RunspaceFolderSelectionDialog";

export default class RunspaceItemFindoutView extends ConductorView implements SelectionPart {

	public static ICON_WIDTH = 24;
	public static ITEM_HEIGHT = 24;
	public static SETTINGS_WIDTH = 24;

	private composite: Composite = null;
	private nameLabel: Label = null;
	private settingsIcon: WebFontIcon = null;
	private snapshotImage: Label = null;
	private modifiedLabel: Label = null;
	private directory: boolean = false;
	private typeIcon: WebFontIcon = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-runspace-item-findout-view");

		let layout = new GridLayout(3);
		this.composite.setLayout(layout);

		this.createTypeIcon(this.composite);
		this.createNameLabel(this.composite);
		this.createSettingsIcon(this.composite);
		this.createSnapshotImage(this.composite);
		this.createModifiedLabel(this.composite);

		this.composite.onSelection(() => {
			this.select();
		});

		this.composite.addListener(webface.MouseDoubleClick, <Listener>{
			handleEvent: () => {
				let request = new RunspaceItemOpenRequest();
				this.conductor.submit(request);
			}
		});

	}

	private select(): void {
		let request = new RunspaceItemSelectionRequest();
		this.conductor.submit(request);
	}

	private createTypeIcon(parent: Composite): void {
		this.typeIcon = this.createIcon(parent, "mdi-file-alert-outline", RunspaceItemFindoutView.ICON_WIDTH);
	}

	private createNameLabel(parent: Composite): void {
		this.nameLabel = this.createLabel(parent, true, RunspaceItemFindoutView.ITEM_HEIGHT);
	}

	private createSettingsIcon(parent: Composite): void {

		this.settingsIcon = this.createIcon(parent, "mdi-menu", RunspaceItemFindoutView.SETTINGS_WIDTH);

		let element = this.settingsIcon.getElement();
		element.css("color", "#888");

		this.settingsIcon.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				this.select();
				let name = this.nameLabel.getText();
				let action = new RunspaceItemPopupAction(this.conductor, this.directory, name);
				action.open(event);
			}
		});

	}

	private createSnapshotImage(parent: Composite): void {
		this.snapshotImage = this.createLabel(parent, true, true);
		let layoutData = <GridData>this.snapshotImage.getLayoutData();
		layoutData.horizontalSpan = 3;
	}

	private createModifiedLabel(parent: Composite): void {
		this.modifiedLabel = this.createLabel(parent, true, RunspaceItemFindoutView.ITEM_HEIGHT);
		let layoutData = <GridData>this.modifiedLabel.getLayoutData();
		layoutData.horizontalSpan = 3;
		layoutData.horizontalIndent = 5;
	}

	private createIcon(parent: Composite, image: string, width: number): WebFontIcon {

		let icon = new WebFontIcon(parent);
		icon.addClasses("mdi", image);

		let element = icon.getElement();
		element.css("line-height", RunspaceItemFindoutView.ITEM_HEIGHT + "px");
		element.css("color", "#444");
		element.css("font-size", "24px");
		element.css("text-align", "left");

		let layoutData = new GridData(width, RunspaceItemFindoutView.ITEM_HEIGHT);
		icon.setLayoutData(layoutData);

		return icon;
	}

	private createLabel(parent: Composite, widthSpace: number | boolean, heightSpace: number | boolean): Label {

		let label = new Label(parent);

		let element = label.getElement();
		element.css("line-height", RunspaceItemFindoutView.ITEM_HEIGHT + "px");

		let layoutData = new GridData(widthSpace, heightSpace);
		label.setLayoutData(layoutData);

		return label;

	}

	public setSelected(selected: boolean): void {
		let element = this.composite.getElement();
		if (selected === true) {
			element.addClass("selected");
		} else {
			element.removeClass("selected");
		}
	}

	public setFileName(fileName: string): void {
		this.nameLabel.setText(fileName);
	}

	public setDirectory(directory: boolean): void {
		this.directory = directory;
		let element = this.typeIcon.getElement();
		if (directory === true) {
			this.typeIcon.addClass("mdi-folder");
			element.css("color", "#ffc774");
		} else {
			this.typeIcon.addClass("mdi-file-outline");
		}
	}

	public setIcon(icon: string): void {
		this.typeIcon.addClass(icon);
	}

	public setImage(image: string): void {
		this.snapshotImage.setText(image);
	}

	public setModified(modified: number): void {
		if (modified > 0) {
			let time = functions.formatDate(modified);
			this.modifiedLabel.setText(time);
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}

class RunspaceItemPopupAction extends BasePopupAction {

	private directory: boolean = false;
	private name: string = null;

	constructor(conductor: Conductor, directory: boolean, name: string) {
		super(conductor);
		this.directory = directory;
		this.name = name;
	}

	public getActions(): BaseAction[] {
		let actions: BaseAction[] = [];
		actions.push(new RenameRunspaceItemAction(this.conductor, this.name));
		actions.push(new MoveRunspaceItemAction(this.conductor));
		if (this.directory === false) {
			actions.push(new DuplicateRunspaceItemAction(this.conductor));
		}
		actions.push(new RemoveRunspaceItemAction(this.conductor));
		return actions;
	}

}

class MoveRunspaceItemAction extends BaseAction {

	public getText(): string {
		return "Move...";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-file-move-outline");
	}

	public run(): void {
		let dialog = new RunspaceFolderSelectionDialog(this.conductor);
		dialog.open((result: string) => {
			if (result === RunspaceFolderSelectionDialog.OK) {
				let folder = dialog.getFolder();
				let request = new RunspaceItemMoveRequest(folder);
				this.conductor.submit(request, (message: string) => {
					if (message !== null) {
						MessageDialog.openError("Item Move", message);
					}
				});
			}
		});
	}

}

class RenameRunspaceItemAction extends BaseAction {

	private originalName: string = null;

	constructor(conductor: Conductor, originalName: string) {
		super(conductor);
		this.originalName = originalName;
	}

	public getText(): string {
		return "Rename...";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-square-edit-outline");
	}

	public run(): void {

		// Jika untitled maka siapkan name validator untuk validasi nama baru
		let validator = <InputValidator>{
			validate: (name: string, callback: (message: string) => void) => {
				let request = new RunspaceItemNameValidationRequest(name);
				this.conductor.submit(request, callback);
			}
		}

		// Tampilkan input name dialog untuk meminta nama baru
		let dialog = new InputDialog(validator);
		dialog.setWindowTitle("Directory Name");
		dialog.setPrompt("Please specify item name");
		dialog.setInitialInput(this.originalName);
		dialog.open((output: string) => {
			if (output === InputDialog.OK) {
				let newName = dialog.getValue();
				let request = new RunspaceItemRenameRequest(newName);
				this.conductor.submit(request);
			}
		});
	}

}

class DuplicateRunspaceItemAction extends BaseAction {

	public getText(): string {
		return "Duplicate";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-content-copy");
	}

	public run(): void {

		let request = new RunspaceItemDuplicateRequest();
		this.conductor.submit(request, () => { });

	}

}

class RemoveRunspaceItemAction extends BaseAction {

	public getText(): string {
		return "Remove";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-close");
	}

	public run(): void {

		let request = new RunspaceItemIsRemovableRequest();
		this.conductor.submit(request, (message: any) => {

			if (message === true) {

				let dialog = new ConfirmationDialog();
				dialog.setPrompt("Are you sure want to remove this item?");

				dialog.open((output: string) => {

					if (output === ConfirmationDialog.OK) {

						// Request remove ke controller.
						let request = new RunspaceItemRemoveRequest();
						this.conductor.submit(request);
					}
				});

			} else {

				MessageDialog.openWarning("Item Remove", message);

			}
		});

	}

}