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

import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import Selection from "webface/viewers/Selection";
import ListViewer from "webface/viewers/ListViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import DialogButtons from "webface/dialogs/DialogButtons";

import Credential from "padang/directors/credentials/Credential";

import CredentialComposerDialog from "padang/dialogs/CredentialComposerDialog";

import CredentialRemoveRequest from "padang/requests/CredentialRemoveRequest";
import CredentialNameListRequest from "padang/requests/CredentialNameListRequest";
import CredentialOptionsSaveRequest from "padang/requests/CredentialOptionsSaveRequest";
import CredentialOptionsLoadRequest from "padang/requests/CredentialOptionsLoadRequest";

import AssignableSelectionDialog from "padang/dialogs/AssignableSelectionDialog";

export default class CredentialManagerDialog extends AssignableSelectionDialog {

	private static BUTTON_HEIGHT = 30;
	private static BUTTONS_WIDTH = 92;

	private conductor: Conductor = null;
	private credential: Credential = null;
	private selectionOnly: boolean = false;

	private viewer: ListViewer = null;
	private selected: string = null;
	private addButton: Button = null;
	private modifyButton: Button = null;
	private removeButton: Button = null;

	constructor(conductor: Conductor, credential: Credential, selectionOnly?: boolean) {
		super();
		this.conductor = conductor;
		this.credential = credential;
		this.selectionOnly = selectionOnly === undefined ? false : selectionOnly;
		this.setDialogSize(480, 540);
		this.setWindowTitle("Credential Manager Dialog");
		this.setTitle("Credential Manager")
		this.setMessage("Please select or define a credential");
	}

	public createControl(parent: Composite): void {

		let composite = new Composite(parent);

		// Layout
		let layout = new GridLayout(2);
		composite.setLayout(layout);

		this.createViewerPart(composite);
		this.createButtonsPart(composite);
	}

	private createViewerPart(parent: Composite): void {

		this.viewer = new ListViewer(parent);
		this.viewer.setLabelProvider(new CredentialItemLabelProvider());
		this.viewer.addSelectionChangedListener(<SelectionChangedListener>{

			selectionChanged: (_event: SelectionChangedEvent) => {

				let selection = this.viewer.getSelection();
				this.modifyButton.setEnabled(false);
				this.removeButton.setEnabled(false);

				if (selection.isEmpty() === false) {

					let routineName = <CredentialItem>selection.getFirstElement();
					this.selected = routineName.getName();
					let input = <CredentialItem[]>this.viewer.getInput();

					this.modifyButton.setEnabled(true);
					this.removeButton.setEnabled(true);

					if (input.length === 1) {
						this.removeButton.setEnabled(false);
					}
				}
			}
		});

		let layoutData = new GridData(true, true);
		this.viewer.setLayoutData(layoutData);

		this.refreshList();
	}

	private refreshList(): void {

		let request = new CredentialNameListRequest();
		this.conductor.submit(request, (routines: string[]) => {

			let items: CredentialItem[] = [];
			let selection: Selection = null;
			for (let i = 0; i < routines.length; i++) {
				let routine = routines[i];
				let item = new CredentialItem(routine);
				items.push(item);
				if (routine === this.selected) {
					selection = new Selection([item]);
				}
			}
			this.viewer.setInput(items);
			if (selection !== null) {
				this.viewer.setSelection(selection);
			}
		});
	}

	private createButtonsPart(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(1, 0, 0);
		composite.setLayout(layout);

		let layoutData = new GridData(CredentialManagerDialog.BUTTONS_WIDTH, true);
		composite.setLayoutData(layoutData);

		this.createAddButtonPart(composite);
		this.createModifyButtonPart(composite);
		this.createRemoveButtonPart(composite);
	}

	private createAddButtonPart(parent: Composite): void {

		this.addButton = this.createButton(parent, "Add...");
		this.addButton.setEnabled(true);
		this.addButton.onSelection(() => {

			let dialog = new CredentialComposerDialog(this.credential);
			dialog.open((result: string) => {

				if (result === CredentialComposerDialog.OK) {

					let name = dialog.getName();
					let options = dialog.getOptions();
					let request = new CredentialOptionsSaveRequest(name, options);
					this.conductor.submit(request, () => {
						this.selected = name;
						this.refreshList();
					});
				}
			});
		});
	}

	private createModifyButtonPart(parent: Composite): void {

		this.modifyButton = this.createButton(parent, "Modify...");
		this.modifyButton.onSelection(() => {

			let request = new CredentialOptionsLoadRequest(this.selected);
			this.conductor.submit(request, (options: Map<string, any>) => {

				let dialog = new CredentialComposerDialog(this.credential, this.selected, options);
				dialog.open((result: string) => {

					if (result === CredentialComposerDialog.OK) {

						let name = dialog.getName();
						let options = dialog.getOptions();

						if (this.selected === name) {

							let request = new CredentialOptionsSaveRequest(name, options);
							this.conductor.submit(request, () => {
								this.refreshList();
							});

						} else {

							let request = new CredentialRemoveRequest(this.selected);
							this.conductor.submit(request, () => {

								let request = new CredentialOptionsSaveRequest(name, options);
								this.conductor.submit(request, () => {
									this.selected = name;
									this.refreshList();
								});
							})
						}
					}
				});

			});
		});
	}

	private createRemoveButtonPart(parent: Composite): void {

		this.removeButton = this.createButton(parent, "Remove");
		this.removeButton.onSelection(() => {

			let request = new CredentialRemoveRequest(this.selected);
			this.conductor.submit(request, () => {

				let input = <CredentialItem[]>this.viewer.getInput();
				let selection = new Selection([input[0]]);
				this.viewer.setSelection(selection);
				this.refreshList();
			});
		});
	}

	private createButton(parent: Composite, text: string): Button {

		let button = new Button(parent);
		button.setText(text);
		button.setEnabled(false);

		let layoutData = new GridData(true, CredentialManagerDialog.BUTTON_HEIGHT);
		button.setLayoutData(layoutData);

		return button;
	}

	public createButtons(buttons: DialogButtons): void {
		if (this.selectionOnly === true) {
			super.createButtons(buttons)
			this.okButton.setEnabled(true);
		} else {
			this.okButton = buttons.createOKButton();
			this.setDefaultButton(this.okButton);
		}
	}

	public getSelection(): string {
		return this.selected;
	}

}

class CredentialItem {

	private name: string = null;

	constructor(name: string) {
		this.name = name;
	}

	public getName(): string {
		return this.name;
	}

}

class CredentialItemLabelProvider implements LabelProvider {

	public getText(element: any): string {
		let name = <CredentialItem>element;
		return name.getName();
	}

}
