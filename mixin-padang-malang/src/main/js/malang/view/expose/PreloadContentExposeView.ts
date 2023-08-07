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

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import IconLabelPanel from "padang/view/IconLabelPanel";

import PreloadPanel from "malang/panels/PreloadPanel";

import PreloadContentEnrollRequest from "malang/requests/expose/PreloadContentEnrollRequest";

export default class PreloadContentExposeView extends ConductorView {

	private static HEADER_HEIGHT = 30;
	private static ICON_WIDTH = 24;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private namePanel: IconLabelPanel = null;
	private resultPart: Composite = null;
	private resultPanel: PreloadPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "malang-preload-result-expose-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createHeaderPart(this.composite);
		this.createResultPart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);
		view.setGridLayout(this.headerPart, 2, 5, 0);
		view.css(this.headerPart, "line-height", PreloadContentExposeView.HEADER_HEIGHT + "px");
		view.setGridData(this.headerPart, true, PreloadContentExposeView.HEADER_HEIGHT);

		this.createNamePanel(this.headerPart);
		this.createEnrollPanel(this.headerPart);
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel = new IconLabelPanel();
		this.namePanel.createControl(parent);
		view.setGridData(this.namePanel, true, true);
	}

	private createEnrollPanel(parent: Composite): void {
		let exportPanel = new IconPanel();
		exportPanel.createControl(parent);
		exportPanel.setIcon("mdi-export-variant");
		view.setGridData(exportPanel, PreloadContentExposeView.ICON_WIDTH, true);

		exportPanel.setOnSelection(() => {
			let request = new PreloadContentEnrollRequest();
			this.conductor.submit(request);
		});
	}

	private createResultPart(parent: Composite): void {
		this.resultPart = new Composite(parent);
		view.css(this.resultPart, "background", "#FFF");
		view.css(this.resultPart, "border-top", "1px solid #E8E8E8");
		view.setGridLayout(this.resultPart, 1, 5, 5, 0, 0);
		view.setGridData(this.resultPart, true, true);
	}

	public setIcon(icon: string): void {
		this.namePanel.setIcon(icon);
	}

	public setName(name: string): void {
		this.namePanel.setLabel(name);
	}

	public setResult(panel: PreloadPanel): void {
		view.dispose(this.resultPanel);
		panel.createControl(this.resultPart);
		view.setGridData(panel, true, true);
		this.resultPart.relayout();
		this.resultPanel = panel;
	}

	public getControl(): Control {
		return this.composite;
	}

}
