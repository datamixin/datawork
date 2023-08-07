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

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import ScrollablePanel from "padang/panels/ScrollablePanel";

import PreloadEntryPanel from "malang/view/expose/PreloadEntryPanel";
import PreloadGroupPanel from "malang/view/expose/PreloadGroupPanel";

export default class ModelExposeView extends ConductorView {

	public static PRELOAD_WIDTH = 240;

	private composite: Composite = null;
	private preloadListPanel: ScrollablePanel = null;
	private resultPart: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "malang-model-expose-view");
		view.setGridLayout(this.composite, 2, 0, 0, 0, 0);

		this.createPreloadPart(this.composite);
		this.createResultPart(this.composite);
	}

	private createPreloadPart(parent: Composite): void {
		let composite = new Composite(parent);
		view.addClass(composite, "malang-model-expose-preload-part");
		view.css(composite, "border-right", "1px solid #E8E8E8");
		view.setGridLayout(composite, 1, 0, 0, 0, 0);
		view.setGridData(composite, ModelExposeView.PRELOAD_WIDTH, true);
		this.createLabelPanel(composite);
		this.createPreloadListPart(composite);
	}

	private createLabelPanel(parent: Composite): void {
		let label = new LabelPanel();
		label.createControl(parent);
		label.setText("Preloads:");
		view.css(label, "text-indent", "5px");
		view.css(label, "line-height", PreloadEntryPanel.LABEL_HEIGHT + "px");
		view.setGridData(label, true, PreloadEntryPanel.LABEL_HEIGHT);
	}

	private createPreloadListPart(parent: Composite): void {
		this.preloadListPanel = new ScrollablePanel(5, 5);
		this.preloadListPanel.createControl(parent);
		view.css(this.preloadListPanel, "border-top", "1px solid #E8E8E8");
		view.css(this.preloadListPanel, "background-color", "#FFF");
		view.addClass(this.preloadListPanel, "malang-model-expose-preload-list-part");
		view.setGridData(this.preloadListPanel, true, true);
	}

	private createResultPart(parent: Composite): void {
		this.resultPart = new Composite(parent);
		view.addClass(this.resultPart, "malang-model-expose-preload-content-part");
		view.setGridLayout(this.resultPart, 1, 0, 0);
		view.setGridData(this.resultPart, true, true);
	}

	public setPreloadNames(groups: Map<string, Map<string, string>>): void {
		this.preloadListPanel.clear();
		for (let group of groups.keys()) {

			let container = new PreloadGroupPanel(this.conductor);
			this.preloadListPanel.addPanel(container);
			container.setLabel(group);

			let preloads = groups.get(group);
			for (let key of preloads.keys()) {
				let type = preloads.get(key);
				let panel = new PreloadEntryPanel(this.conductor);
				container.addPanel(panel);
				panel.setPreload(key);
				panel.setIcon(type);
			}
		}
		this.preloadListPanel.relayout();
	}

	public setSelectedPreload(preload: string): void {
		let composite = <Composite>this.preloadListPanel.getContent();
		let children = composite.getChildren();
		for (let child of children) {
			let data = child.getData();
			if (data instanceof PreloadGroupPanel) {
				let panels = data.getPanels();
				for (let panel of panels) {
					let label = panel.getLabel();
					panel.setSelected(label === preload);
				}
			}
		}
	}

	public relayout(): void {
		this.adjustWidth();
	}

	public adjustWidth(): number {
		let part = new GridCompositeAdjuster(this.composite);
		return part.adjustWidth();
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.resultPart, index);
		view.setGridData(child, true, true);
		view.setControlData(child);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
