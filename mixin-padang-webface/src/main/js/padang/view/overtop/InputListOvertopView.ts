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

import IconPanel from "padang/view/IconPanel";
import LabelPanel from "padang/view/LabelPanel";
import ElementPanel from "padang/view/ElementPanel";
import ElementListPanel from "padang/view/ElementListPanel";
import OnsideElementPanel from "padang/view/OnsideElementPanel";

import InputListAddRequest from "padang/requests/overtop/InputListAddRequest";

export default class InputListOvertopView extends ConductorView {

	private static EDIT_BORDER = 2;
	private static INPUT_HEIGHT = 30;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private listPanel = new ElementListPanel(InputListOvertopView.INPUT_HEIGHT, 5, 0, 0);
	private guidePanel = new LabelPanel();
	private addPanel = new IconPanel();

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "padang-input-list-overtop-view");
		view.css(this.composite, "border", InputListOvertopView.EDIT_BORDER + "px dotted transparent");
		view.css(this.composite, "line-height", InputListOvertopView.INPUT_HEIGHT + "px");
		view.setGridLayout(this.composite, 1, 10, 5, 0, 5);
		this.createHeaderPart(this.composite);
		this.createListPanel(this.composite);
	}

	private createHeaderPart(parent: Composite): void {
		let height = InputListOvertopView.INPUT_HEIGHT - InputListOvertopView.EDIT_BORDER * 2;
		this.headerPart = new Composite(parent);
		view.addClass(this.headerPart, "padang-input-list-overtop-header-part");
		view.css(this.headerPart, "line-height", height + "px");
		view.setGridLayout(this.headerPart, 2, 0, 0, 0);
		view.setGridData(this.headerPart, true, height);
		this.createGuidePanel(this.headerPart);
		this.createAddPanel(this.headerPart);
	}

	private createGuidePanel(parent: Composite): void {
		this.guidePanel.createControl(parent);
		this.guidePanel.setText("No custom input values");
		this.guidePanel.setFontStyle("italic");
		this.guidePanel.setTextColor("#888");
		view.setGridData(this.guidePanel, true, true);
	}

	private createAddPanel(parent: Composite): void {
		this.addPanel.createControl(parent);
		this.addPanel.setIcon("mdi-plus-circle-outline");
		this.addPanel.setOnSelection(() => {
			let request = new InputListAddRequest();
			this.conductor.submit(request);
		});
		view.setGridData(this.addPanel, InputListOvertopView.INPUT_HEIGHT, true);
	}

	private createListPanel(parent: Composite): void {
		this.listPanel.createControl(parent);
		this.listPanel.setOnNewPanel((child: ConductorView): ElementPanel => {

			// Buat element panel untuk menampung view
			let panel = new OnsideElementPanel(child, InputListOvertopView.INPUT_HEIGHT);
			panel.setOnLabel((index: number) => {
				return index + 1;
			});
			return panel;
		});
		view.setGridData(this.listPanel, true, true);
	}

	public adjustHeight(): number {
		let count = this.updateLabel();
		let height = this.listPanel.adjustHeight();
		return height + InputListOvertopView.INPUT_HEIGHT + 5 * 2 + (count > 0 ? 5 : 0);
	}

	private updateLabel(): number {
		let size = this.listPanel.getSize();
		this.guidePanel.setText(size + " custom input values");
		return size;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		this.listPanel.addView(child, index);
	}

	public moveView(child: ConductorView, index: number): void {
		this.listPanel.moveView(child, index);
	}

	public removeView(child: ConductorView): void {
		this.listPanel.removeView(child);
	}

}
