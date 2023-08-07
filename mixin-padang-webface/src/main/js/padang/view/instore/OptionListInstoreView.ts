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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import ElementPanel from "padang/view/ElementPanel";
import ElementListPanel from "padang/view/ElementListPanel";
import OnsideElementPanel from "padang/view/OnsideElementPanel";

export default class OptionListInstoreView extends ConductorView implements HeightAdjustablePart {

	private static LABEL_HEIGHT = 32;

	private composite: Composite = null;
	private labelPanel = new LabelPanel();
	private listPanel = new ElementListPanel();

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-option-list-instore-view");
		element.css("line-height", OptionListInstoreView.LABEL_HEIGHT + "px");

		let layout = new GridLayout(1, 10, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabelIconPanel(this.composite);
		this.createContainerPanel(this.composite);

	}

	private createLabelIconPanel(parent: Composite): void {

		this.labelPanel.createControl(parent);
		this.labelPanel.setText("Options");
		view.setGridData(this.labelPanel, true, OptionListInstoreView.LABEL_HEIGHT);

	}

	private createContainerPanel(parent: Composite): void {

		this.listPanel.createControl(parent);
		view.addClass(this.listPanel, "padang-option-list-instore-container-panel");
		this.listPanel.setOnNewPanel((child: ConductorView): ElementPanel => {

			// Buat element panel untuk menampung view
			let panel = new OnsideElementPanel(child, OptionListInstoreView.LABEL_HEIGHT - 2);
			panel.setOnLabel((index: number) => {
				return index + 1;
			});
			return panel;
		});

		view.setGridData(this.listPanel, true, 0);
	}

	public adjustHeight(): number {
		let height = view.getGridLayoutHeight(this.composite, [OptionListInstoreView.LABEL_HEIGHT]);
		height += view.adjustGridDataHeight(this.listPanel);
		return height + 1;
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
