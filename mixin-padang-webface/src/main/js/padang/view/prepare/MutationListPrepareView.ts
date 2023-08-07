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

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridLayout from "webface/layout/GridLayout";

import * as view from "padang/view/view";
import ElementPanel from "padang/view/ElementPanel";
import LabelIconPanel from "padang/view/LabelIconPanel";
import OnsideElementPanel from "padang/view/OnsideElementPanel";

import ScrollableListPanel from "padang/panels/ScrollableListPanel";

import MutationPrepareView from "padang/view/prepare/MutationPrepareView";

export default class MutationListPrepareView extends ConductorView implements HeightAdjustablePart {

	private static LABEL_HEIGHT = 32;

	private composite: Composite = null;
	private labelIconPanel = new LabelIconPanel();
	private listPanel = new ScrollableListPanel(MutationPrepareView.HEIGHT);

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-mutation-list-prepare-view");
		element.css("border-left", "1px solid #D8D8D8");

		let layout = new GridLayout(1, 10, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabelIconPanel(this.composite);
		this.createContainerPanel(this.composite);

	}

	private createLabelIconPanel(parent: Composite): void {

		this.labelIconPanel.createControl(parent);
		this.labelIconPanel.setLabel("Mutations");
		this.labelIconPanel.setIcon("mdi-menu");

		view.css(this.labelIconPanel, "line-height", MutationListPrepareView.LABEL_HEIGHT + "px");
		view.setGridData(this.labelIconPanel, true, MutationListPrepareView.LABEL_HEIGHT);

	}

	private createContainerPanel(parent: Composite): void {

		this.listPanel.createControl(parent);
		view.addClass(this.listPanel, "padang-mutation-list-outline-container-panel");
		this.listPanel.setOnNewPanel((child: ConductorView): ElementPanel => {

			// Buat element panel untuk menampung view
			let panel = new OnsideElementPanel(child, MutationPrepareView.HEIGHT);
			panel.setOnLabel((index: number) => {
				return index + 1;
			});
			return panel;
		});

		view.setGridData(this.listPanel, true, true);
	}

	public adjustHeight(): number {
		let height = view.getGridLayoutHeight(this.composite, [MutationListPrepareView.LABEL_HEIGHT]);
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
