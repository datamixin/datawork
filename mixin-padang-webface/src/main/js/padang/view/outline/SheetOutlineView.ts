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

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import ObjectMap from "webface/util/ObjectMap";

import ConductorView from "webface/wef/ConductorView";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import MessageDialog from "webface/dialogs/MessageDialog";
import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import ViewAction from "padang/view/ViewAction";
import ViewPopupAction from "padang/view/ViewPopupAction";

import * as outline from "padang/view/outline/outline";

import SheetSelectRequest from "padang/requests/outline/SheetSelectRequest";
import SheetRemoveRequest from "padang/requests/outline/SheetRemoveRequest";
import SheetNameSetRequest from "padang/requests/outline/SheetNameSetRequest";
import SheetNameListRequest from "padang/requests/outline/SheetNameListRequest";
import SheetDuplicateRequest from "padang/requests/outline/SheetDuplicateRequest";
import SheetPointedCountRequest from "padang/requests/outline/SheetPointedCountRequest";
import SheetNameValidationRequest from "padang/requests/outline/SheetNameValidationRequest";

import SheetDragAreaRequest from "padang/requests/outline/SheetDragAreaRequest";
import SheetDragSourceDragRequest from "padang/requests/outline/SheetDragSourceDragRequest";
import SheetDragSourceStopRequest from "padang/requests/outline/SheetDragSourceStopRequest";
import SheetDragSourceStartRequest from "padang/requests/outline/SheetDragSourceStartRequest";

export default class SheetOutlineView extends ConductorView {

	public static ICON_WIDTH = 30;

	private composite: Composite = null;
	private iconPanel = new IconPanel();
	private namePanel = new LabelTextPanel();
	private menuPanel = new IconPanel();

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-sheet-outline-view");
		element.css("text-align", "center");
		element.css("line-height", (outline.SHEET_HEIGHT - 2) + "px");
		element.tooltip();

		view.setGridLayout(this.composite, 3, 0, 0, 0, 0);

		this.composite.onSelection(() => {
			let request = new SheetSelectRequest();
			this.conductor.submit(request);
		});

		this.createImagePanel(this.composite);
		this.createNamePanel(this.composite);
		this.createMenuPanel(this.composite);
		this.createDragSource(this.composite);
	}

	private createImagePanel(parent: Composite): void {
		this.iconPanel.createControl(parent);
		view.setGridData(this.iconPanel, SheetOutlineView.ICON_WIDTH, true);
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel.createControl(parent);
		this.namePanel.onCommit((newText: string, oldText: string) => {
			let request = new SheetNameValidationRequest(newText);
			this.conductor.submit(request, (message: string) => {
				if (message === null) {
					let request = new SheetNameSetRequest(newText);
					this.conductor.submit(request);
				} else {
					MessageDialog.openError("Name Error", message, () => {
						this.namePanel.setText(oldText);
						this.namePanel.setShowEdit(true);
					});
				}
			});
		});
		view.setGridData(this.namePanel, true, true);
		let label = this.namePanel.getLabelControl();
		view.css(label, "text-overflow", "ellipsis");
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		this.menuPanel.setVisible(false);
		this.menuPanel.setIcon("mdi-menu-down");
		this.menuPanel.setOnSelection((event: Event) => {
			let action = new ViewPopupAction([
				new ViewAction("Duplicate", () => {
					let request = new SheetDuplicateRequest();
					this.conductor.submit(request);
				}, "mdi-content-duplicate"),
				new ViewAction("Remove", () => {
					let request = new SheetNameListRequest();
					this.conductor.submit(request, (names: string[]) => {
						if (names.length === 1) {
							let message = "A project must be containing at least one sheet";
							MessageDialog.openError("Remove Error", message);
						} else {
							let request = new SheetPointedCountRequest();
							this.conductor.submit(request, (count: number) => {
								if (count === 0) {
									let request = new SheetRemoveRequest();
									this.conductor.submit(request);
								} else {
									let dialog = new ConfirmationDialog();
									dialog.setWindowTitle("Sheet Remove Problem");
									dialog.setPrompt("There is " + count + " field using this sheet.\n" +
										"Removing this sheet will cause error, are you sure?")
									dialog.open((result: string) => {
										if (result === ConfirmationDialog.OK) {
											let request = new SheetRemoveRequest();
											this.conductor.submit(request);
										}
									});
								}
							});
						}
					});
				}, "mdi-playlist-remove"),
			]);
			action.open(event);
		});
		view.setGridData(this.menuPanel, SheetOutlineView.ICON_WIDTH, true);
	}

	private createDragSource(control: Control): void {

		// Request drag area
		let request = new SheetDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			let handle = this.namePanel.getControl();
			source.setHandle(handle);

			let helper = new CloneDragHelper(control, {
				border: "1px solid transparent",
			});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any, ui: any) => {

				let request = new SheetDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new SheetDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((event: any, ui: any) => {

				let request = new SheetDragSourceStopRequest();
				this.conductor.submit(request);

			});

			source.applyTo(control);

		});

	}

	public setTooltip(tooltip: string): void {
		let element = this.composite.getElement();
		element.attr("title", tooltip);
	}

	public setIcon(icon: string): void {
		let image = outline.TYPE_ICONS[icon];
		this.iconPanel.setIcon(image);
	}

	public setName(text: string): void {
		this.namePanel.setText(text);
	}

	public setSelected(selected: boolean): void {
		view.setSelected(this.composite, selected);
		this.menuPanel.setVisible(selected);
	}

	public adjustHeight(): number {
		return outline.SHEET_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
