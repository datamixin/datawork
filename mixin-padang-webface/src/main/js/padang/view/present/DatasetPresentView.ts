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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";

import DatasetGuidePanel from "padang/panels/DatasetGuidePanel";

import SourcePresentView from "padang/view/present/SourcePresentView";
import ReceiptPresentView from "padang/view/present/ReceiptPresentView";

export default class DatasetPresentView extends ReceiptPresentView {

	private static SOURCE_WIDTH = 330;
	private static HEADER_HEIGHT = 40;

	private composite: Composite = null;
	private guidePanel: DatasetGuidePanel = null;
	private contentPart: Composite = null;
	private actionPart: Composite = null;
	private sourcePart: Composite = null;
	private displayPart: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		view.addClass(this.composite, "padang-dataset-present-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 10);

		this.createGuidePanel(this.composite);
		this.createContentPart(this.composite);

	}

	private createGuidePanel(parent: Composite): void {
		this.guidePanel = new DatasetGuidePanel(this.conductor);
		this.guidePanel.createControl(parent);
		view.setGridData(this.guidePanel, true, 0);
	}

	private createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);

		view.addClass(this.contentPart, "padang-dataset-present-content-part");
		view.setAbsoluteLayout(this.contentPart);
		view.setGridData(this.contentPart, true, true);

		this.createDisplayPart(this.contentPart);
		this.createActionPart(this.contentPart);

	}

	private createDisplayPart(parent: Composite): void {

		this.displayPart = new Composite(parent);

		view.addClass(this.displayPart, "padang-dataset-present-display-part");
		let layout = view.setGridLayout(this.displayPart, 1, 0, 0, 0, 0);
		layout.marginTop = 10;
		view.setAbsoluteData(this.displayPart, 0, 0, "100%", "100%");
	}

	private createActionPart(parent: Composite): void {

		this.actionPart = new Composite(parent);

		view.addClass(this.actionPart, "padang-dataset-present-action-part");
		view.setGridLayout(this.actionPart, 1, 0, 0, 0, 0);

		let layoutData = view.setAbsoluteData(this.actionPart);
		layoutData.top = 0;
		layoutData.right = 10;
		layoutData.width = DatasetPresentView.SOURCE_WIDTH;
		layoutData.height = DatasetPresentView.HEADER_HEIGHT;

		this.createSourcePart(this.actionPart);

	}

	private createSourcePart(parent: Composite): void {

		this.sourcePart = new Composite(parent);

		view.addClass(this.sourcePart, "padang-dataset-present-source-part");
		view.setGridLayout(this.sourcePart, 1, 0, 0, 0, 0);

		view.setGridData(this.sourcePart, DatasetPresentView.SOURCE_WIDTH, true);
	}

	public setShowGuide(show: boolean): void {
		view.grabVerticalExclusive(show === true ? this.guidePanel : this.contentPart);
		this.composite.relayout();
		if (show === true) {
			this.guidePanel.relayout();
		}
	}

	public relayout(): void {
		this.relayoutPart(this.sourcePart);
		this.relayoutPart(this.displayPart);
		this.contentPart.relayout();
	}

	private relayoutPart(parent: Composite): void {
		parent.relayout();
		let children = parent.getChildren();
		if (children.length > 0) {
			let child = children[0].getData();
			if (child !== null) {
				if (child.relayout !== undefined) {
					child.relayout();
				}
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		if (child instanceof SourcePresentView) {
			child.createControl(this.sourcePart, 0);
		} else {
			child.createControl(this.displayPart, 0);
		}
		view.setGridData(child, true, true);
	}

	public removeView(child: ConductorView): void {
		let control = child.getControl();
		control.dispose();
	}

}
