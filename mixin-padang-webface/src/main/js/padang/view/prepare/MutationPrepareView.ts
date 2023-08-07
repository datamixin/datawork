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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import MessageDialog from "webface/dialogs/MessageDialog";
import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import LabelPanel from "padang/view/LabelPanel";
import ViewAction from "padang/view/ViewAction";
import ViewPopupAction from "padang/view/ViewPopupAction";

import MutationIndexRequest from "padang/requests/prepare/MutationIndexRequest";
import MutationCountRequest from "padang/requests/prepare/MutationCountRequest";
import MutationSelectRequest from "padang/requests/prepare/MutationSelectRequest";
import MutationRemoveRequest from "padang/requests/prepare/MutationRemoveRequest";
import MutationDialogOpenRequest from "padang/requests/prepare/MutationDialogOpenRequest";

export default class MutationPrepareView extends ConductorView {

	public static HEIGHT = 30;
	public static TYPE_WIDTH = 30;
	public static ICON_WIDTH = 24;

	private composite: Composite = null;
	private imagePanel = new IconPanel();
	private captionPanel = new LabelPanel();
	private errorPanel = new LabelPanel();
	private dialogPanel = new IconPanel();
	private dialogExists = false;
	private menuPanel = new IconPanel();

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-mutation-prepare-view");
		element.css("line-height", (MutationPrepareView.HEIGHT - 2) + "px");

		let layout = view.setGridLayout(this.composite, 5, 0, 0, 0, 0);
		layout.marginRight = 0;

		this.composite.onSelection(() => {
			let request = new MutationSelectRequest();
			this.conductor.submit(request);
		});

		this.createTypePanel(this.composite);
		this.createCaptionPanel(this.composite);
		this.createErrorPanel(this.composite);
		this.createDialogPanel(this.composite);
		this.createMenuPanel(this.composite);
	}

	private createTypePanel(parent: Composite): void {
		this.imagePanel.createControl(parent);
		view.setGridData(this.imagePanel, MutationPrepareView.TYPE_WIDTH, true);
	}

	private createCaptionPanel(parent: Composite): void {
		this.captionPanel.createControl(parent);
		view.css(this.captionPanel, "text-overflow", "ellipsis");
		view.setGridData(this.captionPanel, true, true);
	}

	private createErrorPanel(parent: Composite): void {
		this.errorPanel.createControl(parent);
		view.css(this.errorPanel, "color", "#C44");
		view.setGridData(this.errorPanel, 0, true);
	}

	private createDialogPanel(parent: Composite): void {
		this.dialogPanel.createControl(parent);
		this.dialogPanel.setVisible(false);
		this.dialogPanel.setIcon("mdi-open-in-app");
		this.dialogPanel.setOnSelection(() => {
			let request = new MutationDialogOpenRequest();
			this.conductor.submit(request);
		});
		view.setGridData(this.dialogPanel, 0, true);
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		this.menuPanel.setVisible(false);
		this.menuPanel.setIcon("mdi-menu-down");
		this.menuPanel.setOnSelection((event: Event) => {

			// Remove
			let removeAction = new ViewAction("Remove Selected", () => {
				let request = new MutationIndexRequest();
				this.conductor.submit(request, (index: number) => {
					if (index === 0) {
						let message = "Cannot remove first mutation";
						MessageDialog.openError("Remove Error", message);
					} else {
						let request = new MutationCountRequest();
						this.conductor.submit(request, (count: number) => {
							let remaining = count - 1 - index;
							if (remaining > 0) {
								let prompt = "Remove non last mutation may cause result unexpected";
								let dialog = new ConfirmationDialog();
								dialog.setPrompt(prompt);
								dialog.setWindowTitle("Remove Confirmation");
								dialog.open((result: string) => {
									if (result === MessageDialog.OK) {
										let request = new MutationRemoveRequest(false);
										this.conductor.submit(request);
									}
								});
							} else {
								let request = new MutationRemoveRequest(false);
								this.conductor.submit(request);
							}
						});
					}
				});
			}, "mdi-playlist-remove");

			// Cut Off
			let cutOffAction = new ViewAction("Remove With Cutoff", () => {
				let request = new MutationIndexRequest();
				this.conductor.submit(request, (index: number) => {
					if (index === 0) {
						let message = "Cannot remove first mutation";
						MessageDialog.openError("Remove Error", message);
					} else {
						let request = new MutationRemoveRequest(true);
						this.conductor.submit(request);
					}
				});
			}, "mdi-playlist-remove");

			// Count
			let request = new MutationCountRequest();
			this.conductor.submit(request, (count: number) => {
				let request = new MutationIndexRequest();
				this.conductor.submit(request, (index: number) => {
					if (index < count - 1) {
						let action = new ViewPopupAction([removeAction, cutOffAction]);
						action.open(event);
					} else {
						let action = new ViewPopupAction([removeAction]);
						action.open(event);
					}
				});
			});

		});
		view.setGridData(this.menuPanel, 0, true);
	}

	public setImage(image: string): void {
		this.imagePanel.setIcon(image);
	}

	public setCaption(text: string): void {
		this.captionPanel.setText(text);
		view.setGridData(this.captionPanel, true, true);
		view.setGridData(this.errorPanel, 0, true);
		this.composite.relayout();
	}

	public setError(message: string): void {
		this.errorPanel.setText(message);
		view.setGridData(this.captionPanel, 0, true);
		view.setGridData(this.errorPanel, true, true);
		this.composite.relayout();
	}

	public setDialogExists(exists: boolean): void {
		this.dialogExists = exists;
	}

	public setSelected(selected: boolean): void {
		view.setSelected(this.composite, selected);
		this.dialogPanel.setVisible(selected);
		this.menuPanel.setVisible(selected);
		view.setGridData(this.dialogPanel, this.dialogExists ? MutationPrepareView.ICON_WIDTH : 0, true);
		view.setGridData(this.menuPanel, selected ? MutationPrepareView.ICON_WIDTH : 0, true);
		this.composite.relayout();
	}

	public adjustHeight(): number {
		return MutationPrepareView.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
