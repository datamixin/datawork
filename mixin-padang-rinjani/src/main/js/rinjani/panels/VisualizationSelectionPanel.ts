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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import Point from "webface/graphics/Point";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as widgets from "padang/widgets/widgets";

import GridLayout from "webface/layout/GridLayout";

import PlotListRequest from "rinjani/requests/PlotListRequest";
import PlotPreviewRequest from "rinjani/requests/PlotPreviewRequest";

export default class VisualizationSelectionPanel extends ConductorPanel {

	public static ITEM_HEIGHT = 24;

	private selectedName: string = null;
	private composite: Composite = null;
	private scrollable: Scrollable = null;
	private container: Composite = null;
	private updateComplete = () => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1, 0, 0);

		this.createFieldLabel(this.composite, "Visualization List");
		this.createScrollablePart(this.composite);
		this.initSelection();

	}

	private createFieldLabel(parent: Composite, text: string): void {
		let label = this.createLabel(parent, text);
		widgets.setGridData(label, true, VisualizationSelectionPanel.ITEM_HEIGHT);
	}

	private createLabel(parent: Composite, text: string): Label {
		let label = new Label(parent);
		label.setText(text);
		widgets.css(label, "line-height", VisualizationSelectionPanel.ITEM_HEIGHT + "px");
		return label;
	}

	private createScrollablePart(parent: Composite): void {

		this.scrollable = new Scrollable(parent);
		this.scrollable.setExpandHorizontal(true);

		widgets.css(this.scrollable, "border", "1px solid #D8D8D8");
		widgets.setGridData(this.scrollable, true, true);

		this.createContainerPart(this.scrollable);
	}

	private createContainerPart(parent: Scrollable): void {

		this.container = new Composite(parent);
		parent.setContent(this.container);

		widgets.setGridLayout(this.container, 4);
	}

	private initSelection(): void {
		let request = new PlotListRequest();
		this.conductor.submit(request, (names: string[]) => {

			let total = 0;
			let layout = <GridLayout>this.container.getLayout();
			for (let i = 0; i < names.length; i++) {

				let panel = new VisualizationPanel(this.conductor);
				panel.createControl(this.container);

				let control = panel.getControl();
				let width = VisualizationPanel.WIDTH;
				let height = VisualizationPanel.HEIGHT;
				widgets.setGridData(control, width, height);

				panel.setOnSelection((name: string) => {
					this.selectedName = name;
					let children = this.container.getChildren();
					for (let child of children) {
						let panel = <VisualizationPanel>child.getData();
						panel.setSelected(false);
					}
					panel.setSelected(true);
					this.updateComplete();
				})

				let name = names[i];
				panel.preview(name);

				if (i % layout.numColumns === 0) {
					total += layout.verticalSpacing;
					total += height;
				}
			}
			total += 2 * layout.marginHeight;
			this.scrollable.setMinHeight(total);
			this.updateComplete();
		});
	}

	public getSelection(): string {
		return this.selectedName;
	}

	public setOnComplete(complete: () => void): void {
		this.updateComplete = complete;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class VisualizationPanel extends ConductorPanel {

	public static WIDTH = 186;
	public static HEIGHT = 172;

	private composite: Composite = null;
	private nameLabel: Label = null;
	private onSelection = (_name: string) => { };

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.addClass(this.composite, "rinjani-visualization-selection-panel-item");
		widgets.setGridLayout(this.composite, 1, 5, 5, 0, 0);
		this.createNameLabel(this.composite);
		this.composite.onSelection(() => {
			let name = this.nameLabel.getText();
			this.onSelection(name);
		});
		this.composite.setData(this);
	}

	private createNameLabel(parent: Composite): void {
		this.nameLabel = new Label(parent);
		widgets.css(this.nameLabel, "line-height", VisualizationSelectionPanel.ITEM_HEIGHT + "px");
		widgets.setGridData(this.nameLabel, true, VisualizationSelectionPanel.ITEM_HEIGHT);
	}

	public preview(name: string): void {
		this.nameLabel.setText(name);
		let layout = widgets.getGridLayout(this.composite);
		let title = VisualizationSelectionPanel.ITEM_HEIGHT;
		let width = VisualizationPanel.WIDTH;
		let height = VisualizationPanel.HEIGHT - 2 * layout.marginHeight - layout.verticalSpacing - title;
		let size = new Point(width - 20, height - 20);
		let request = new PlotPreviewRequest(name, size);
		this.conductor.submit(request, (panel: ConductorPanel) => {
			panel.createControl(this.composite);
			let control = panel.getControl();
			widgets.setGridData(control, true, true);
			this.composite.relayout();
		});
	}

	public setOnSelection(callback: (name: string) => void): void {
		this.onSelection = callback;
	}

	public setSelected(state: boolean): void {
		if (state === true) {
			widgets.addClass(this.composite, "selected");
		} else {
			widgets.removeClass(this.composite, "selected");
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}
