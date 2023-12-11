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

import ConductorPanel from "webface/wef/ConductorPanel";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import PreloadEntryPanel from "malang/view/expose/PreloadEntryPanel";

export default class PreloadGroupPanel extends ConductorPanel {

	public static LABEL_HEIGHT = 24;

	private composite: Composite = null;
	private labelPanel: LabelPanel = null;
	private container: Composite = null;

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-preload-group-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createLabelPanel(this.composite);
		this.createContainer(this.composite);
	}

	private createLabelPanel(parent: Composite): void {
		this.labelPanel = new LabelPanel(5);
		this.labelPanel.createControl(parent);
		this.labelPanel.setTextColor("#888");
		this.labelPanel.setFontStyle("italic");
		view.setGridData(this.labelPanel, true, PreloadGroupPanel.LABEL_HEIGHT);
		view.css(this.labelPanel, "line-height", (PreloadGroupPanel.LABEL_HEIGHT - 2) + "px");
		view.css(this.labelPanel, "border-bottom", "1px dashed #CCC");
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "malang-preload-group-panel-container");
		view.setGridLayout(this.container, 1, 0, 5, 0, 0);
		view.setGridData(this.container, true, true);
	}

	public setLabel(text: string): void {
		this.labelPanel.setText(text);
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		return height + PreloadGroupPanel.LABEL_HEIGHT;
	}

	public getPanels(): PreloadEntryPanel[] {
		let panels: PreloadEntryPanel[] = [];
		let children = this.container.getChildren();
		for (let child of children) {
			let data = child.getData();
			if (data instanceof PreloadEntryPanel) {
				panels.push(data);
			}
		}
		return panels;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addPanel(child: PreloadEntryPanel, index?: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, PreloadGroupPanel.LABEL_HEIGHT);
	}

}