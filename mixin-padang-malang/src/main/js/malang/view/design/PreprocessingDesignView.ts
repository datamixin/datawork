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
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ListViewer from "webface/viewers/ListViewer";
import ListViewerStyle from "webface/viewers/ListViewerStyle";

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";

import PreprocessingModifyRequest from "malang/requests/design/PreprocessingModifyRequest";

export default class PreprocessingDesignView extends ConductorView {

	private static HEADER_HEIGHT = 24;
	private static BUTTON_WIDTH = 92;
	private static ITEM_HEIGHT = 24;
	private static SPACING = 5;

	private composite: Composite = null;
	private modifyButton: Button = null;
	private listViewer: ListViewer = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-preprocessing-design-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, PreprocessingDesignView.SPACING);

		this.createHeaderPart(this.composite);
		this.createListViewer(this.composite);

	}

	private createHeaderPart(parent: Composite): void {

		let headerPart = new Composite(parent);
		view.setGridLayout(headerPart, 2, 0, 0, 0, 0);
		view.setGridData(headerPart, true, PreprocessingDesignView.HEADER_HEIGHT)
		this.createHeaderLabel(headerPart);
		this.createHeaderButton(headerPart);
	}

	private createHeaderLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Preprocessing:");
		view.css(label, "line-height", PreprocessingDesignView.HEADER_HEIGHT + "px");
		view.setGridData(label, true, true);
	}

	private createHeaderButton(parent: Composite): void {
		this.modifyButton = new Button(parent);
		this.modifyButton.setText("Modify...");
		view.css(this.modifyButton, "line-height", "12px");
		view.setGridData(this.modifyButton, PreprocessingDesignView.BUTTON_WIDTH, true);
		this.modifyButton.onSelection(() => {
			let request = new PreprocessingModifyRequest();
			this.conductor.submit(request);
		});
	}

	private createListViewer(parent: Composite): void {
		this.listViewer = new ListViewer(parent, <ListViewerStyle>{
			mark: ListViewerStyle.NONE
		});
		view.addClass(this.listViewer, "malang-preprocessing-design-list-viewer");
		view.setGridData(this.listViewer, true, true);
	}

	public setMutationSteps(names: string[]): void {
		this.listViewer.setInput(names);
	}

	public setModifyEnabled(enabled: boolean): void {
		this.modifyButton.setEnabled(enabled);
	}

	public adjustHeight(): number {
		let input = <string[]>this.listViewer.getInput() || [];
		let labelHeight = PreprocessingDesignView.HEADER_HEIGHT;
		let listHeight = PreprocessingDesignView.ITEM_HEIGHT * Math.max(1, input.length);
		return labelHeight + PreprocessingDesignView.SPACING + listHeight + 2;
	}

	public getControl(): Control {
		return this.composite;
	}

}
