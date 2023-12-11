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
import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import RowData from "webface/layout/RowData";
import GridData from "webface/layout/GridData";
import RowLayout from "webface/layout/RowLayout";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";

import ConductorView from "webface/wef/ConductorView";

import InputDialog from "webface/dialogs/InputDialog";
import InputValidator from "webface/dialogs/InputValidator";

import WebFontImage from "webface/graphics/WebFontImage";

import ButtonMenuPanel from "bekasi/panels/ButtonMenuPanel";

import ProjectAddAction from "padang/actions/ProjectAddAction";

import BreadCrumbFindoutPanel from "padang/view/findout/BreadCrumbFindoutPanel";
import RunspaceItemFindoutView from "padang/view/findout/RunspaceItemFindoutView";

import RunspaceItemListDirectoryAddRequest from "padang/requests/findout/RunspaceItemListDirectoryAddRequest";
import RunspaceItemListNameValidationRequest from "padang/requests/findout/RunspaceItemListNameValidationRequest";

export default class RunspaceItemListFindoutView extends ConductorView {

	private static TITLE_HEIGHT = 20;
	private static HEADER_HEIGHT = 24;
	private static ITEM_WIDTH = 240;
	private static ITEM_HEIGHT = 120;
	private static BUTTON_MENU_WIDTH = 200;
	private static BUTTON_MENU_HEIGHT = 30;

	private folderId: string = null;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private breadCrumb: BreadCrumbFindoutPanel = null;
	private container: Composite = null;
	private scrollable: Scrollable = null;
	private childViews: RunspaceItemFindoutView[] = [];

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-runspace-item-list-findout-view");

		let layout = new GridLayout(1, 10, 10, 0, 0);
		this.composite.setLayout(layout);

		this.createAddButtons(this.composite);
		this.createTitleLabel(this.composite);
		this.createHeaderPart(this.composite);
		this.createContainer(this.composite);
	}

	private createAddButtons(parent: Composite): void {

		let buttonClass = "padang-runspace-item-list-add-project";
		let panel = new ButtonMenuPanel("Add Project...", "mdi-plus-circle-outline", "btn-primary", buttonClass);
		panel.createControl(parent);
		let control = panel.getControl();

		let width = RunspaceItemListFindoutView.BUTTON_MENU_WIDTH;
		let height = RunspaceItemListFindoutView.BUTTON_MENU_HEIGHT;
		let layoutData = new GridData(width, height);
		layoutData.horizontalAlignment = webface.END;
		control.setLayoutData(layoutData);

		panel.onButtonSelection(() => {
			let action = new ProjectAddAction(this.conductor, this.folderId);
			action.run();
		});

		panel.setMenuActions([
			new RunspaceItemListFindoutDirectoryAddAction(this.conductor)
		]);
	}

	private createTitleLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Project File List");

		let size = RunspaceItemListFindoutView.TITLE_HEIGHT;
		let element = label.getElement();
		element.addClass("padang-runspace-item-list-findout-title");
		element.css("line-height", size + "px");

		let layoutData = new GridData(true, size);
		label.setLayoutData(layoutData);

	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);

		let element = this.headerPart.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("color", "#888");
		element.addClass("padang-runspace-item-list-findout-header-part");

		let layoutData = new GridData(true, RunspaceItemListFindoutView.HEADER_HEIGHT);
		this.headerPart.setLayoutData(layoutData);

		let layout = new GridLayout(1, 5, 0, 0, 0);
		this.headerPart.setLayout(layout);

		this.createBreadCrumb(this.headerPart);
	}

	private createBreadCrumb(parent: Composite): void {

		this.breadCrumb = new BreadCrumbFindoutPanel(this.conductor);
		this.breadCrumb.createControl(parent);
		let control = this.breadCrumb.getControl();

		let element = control.getElement();
		element.css("line-height", RunspaceItemListFindoutView.HEADER_HEIGHT + "px");

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

	}

	private createContainer(parent: Composite): void {

		this.scrollable = new Scrollable(parent);
		this.scrollable.setExpandHorizontal(true);

		let element = this.scrollable.getElement();
		element.addClass("padang-runspace-item-list-findout-container");

		this.container = new Composite(this.scrollable);
		let layout = new RowLayout(webface.ROW, 10, 10);
		this.container.setLayout(layout);

		this.scrollable.setContent(this.container);

		let layoutData = new GridData(true, true);
		this.scrollable.setLayoutData(layoutData);
	}

	public setFolderId(folderId: string): void {
		this.folderId = folderId;
		this.breadCrumb.setFolderId(folderId);
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(view: RunspaceItemFindoutView, index: number): void {

		view.createControl(this.container, index);
		let control = view.getControl();

		let layoutData = new RowData(RunspaceItemListFindoutView.ITEM_WIDTH, RunspaceItemListFindoutView.ITEM_HEIGHT);
		control.setLayoutData(layoutData);

		this.childViews.push(view);
		this.layout();
	}

	public removeView(view: RunspaceItemFindoutView): void {

		let control = view.getControl();
		control.dispose();

		let index = this.childViews.indexOf(view);
		this.childViews.splice(index, 1);
		this.layout();
	}

	private layout(): void {

		this.container.relayout();
		let layout = <RowLayout>this.container.getLayout();

		let height = this.childViews.length * RunspaceItemListFindoutView.ITEM_HEIGHT;
		height += layout.marginHeight * 2;
		this.scrollable.setMinHeight(height);
		this.scrollable.relayout();
	}

}

class RunspaceItemListFindoutDirectoryAddAction extends BaseAction {

	public getText(): string {
		return "Add Directory";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-folder-outline");
	}

	public run(): void {

		// Jika untitled maka siapkan name validator untuk validasi nama baru
		let validator = <InputValidator>{
			validate: (name: string, callback: (message: string) => void) => {
				let request = new RunspaceItemListNameValidationRequest(name);
				this.conductor.submit(request, callback);
			}
		}

		// Tampilkan input name dialog untuk meminta nama baru
		let dialog = new InputDialog(validator);
		dialog.setWindowTitle("Directory Name");
		dialog.setPrompt("Please specify directory name");
		dialog.open((output: string) => {
			if (output === InputDialog.OK) {
				let newName = dialog.getValue();
				let request = new RunspaceItemListDirectoryAddRequest(newName);
				this.conductor.submit(request);
			}
		});
	}
} 
