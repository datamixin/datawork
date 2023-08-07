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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePanel from "webface/wef/HeightAdjustablePanel";

import * as view from "padang/view/view";

import DesignHeaderPanel from "vegazoo/view/design/DesignHeaderPanel";
import AnyOfDefDesignView from "vegazoo/view/design/AnyOfDefDesignView";
import DesignCompositePanel from "vegazoo/view/design/DesignCompositePanel";

import TopLevelSpecViewSetRequest from "vegazoo/requests/design/TopLevelSpecViewSetRequest";
import TopLevelSpecViewSelectRequest from "vegazoo/requests/design/TopLevelSpecViewSelectRequest";

export abstract class TopLevelSpecDesignView extends AnyOfDefDesignView {

	public static BORDER_WIDTH = 2;

	private headerPanel: DesignHeaderPanel = null;
	private selectionPanel: TopLevelSpecViewSelectionPanel = null;
	private controlPanel = new DesignCompositePanel();

	constructor(conductor: Conductor) {
		super(conductor);
		this.selectionPanel = new TopLevelSpecViewSelectionPanel(conductor);
	}

	protected createHeaderPanel(parent: Composite): void {

		this.headerPanel = new DesignHeaderPanel(this.conductor);
		this.headerPanel.createControl(parent, 0);
		this.headerPanel.setText("Composition");

		let control = this.headerPanel.getControl();
		let layoutData = new GridData(true, DesignHeaderPanel.HEIGHT);
		control.setLayoutData(layoutData);

	}

	protected createControlPanel(parent: Composite): void {

		this.controlPanel.createControl(parent);
		let control = this.controlPanel.getControl();

		let layoutData = new GridData(true, DesignHeaderPanel.HEIGHT);
		control.setLayoutData(layoutData);

		this.controlPanel.addPanel(this.selectionPanel);

	}

	private adjustPanelHeight(panel: HeightAdjustablePanel): number {
		let height = panel.adjustHeight();
		let control = panel.getControl();
		let layoutData = <GridData>control.getLayoutData();
		layoutData.heightHint = height;
		return height;
	}

	public adjustHeight(): number {
		let headerHeight = this.adjustPanelHeight(this.headerPanel);
		let controlHeight = this.adjustPanelHeight(this.controlPanel);
		return headerHeight + controlHeight;
	}

	public setCurrentView(view: string): void {
		this.selectionPanel.setCurrentView(view);
	}

	public setViewMap(views: Map<string, string>): void {
		this.selectionPanel.setViewMap(views);
	}

}

class TopLevelSpecViewSelectionPanel extends ConductorPanel {

	public static MODE_ICONS = {};

	public static MODE_HEIGHT = 32;
	public static LABEL_WIDTH = 60;

	private currentView: string = null;
	private composite: Composite = null;
	private nameLabel: Label = null;
	private container: Composite = null;
	private modeIcons = new Map<string, WebFontIcon>();

	constructor(conductor: Conductor) {
		super(conductor);
		TopLevelSpecViewSelectionPanel.MODE_ICONS["vegazoo://XTopLevelUnitSpec"] = ["mdi-rectangle-outline"];
		TopLevelSpecViewSelectionPanel.MODE_ICONS["vegazoo://XTopLevelLayerSpec"] = ["mdi-layers-outline"];
		TopLevelSpecViewSelectionPanel.MODE_ICONS["vegazoo://XTopLevelVConcatSpec"] = ["mdi-view-stream"];
		TopLevelSpecViewSelectionPanel.MODE_ICONS["vegazoo://XTopLevelHConcatSpec"] = ["mdi-view-stream", "mdi-rotate-270"];
		TopLevelSpecViewSelectionPanel.MODE_ICONS["vegazoo://XTopLevelFacetSpec"] = ["mdi-view-grid"];
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-top-level-spec-view-selection-panel");

		let layout = new GridLayout(2, 2, 2, 0, 0);
		this.composite.setLayout(layout);

		this.createViewLabel(this.composite);
		this.createContainer(this.composite);

	}

	private createViewLabel(parent: Composite): void {

		this.nameLabel = new Label(parent);
		this.nameLabel.setText("View");

		let element = this.nameLabel.getElement();
		element.css("line-height", (TopLevelSpecViewSelectionPanel.MODE_HEIGHT - 8) + "px");

		let layoutData = new GridData(TopLevelSpecViewSelectionPanel.LABEL_WIDTH, true);
		layoutData.horizontalIndent = 6;
		this.nameLabel.setLayoutData(layoutData);

		this.nameLabel.onSelection(() => {
			let request = new TopLevelSpecViewSelectRequest(this.currentView);
			this.conductor.submit(request);
		});

	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let layout = new GridLayout(5, 0, 0, 5, 0);
		this.container.setLayout(layout)

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);

	}

	private createViewIcon(parent: Composite, name: string, label: string, paths: string[]): void {

		let icon = new WebFontIcon(parent);
		icon.addClass("mdi");
		for (let path of paths) {
			icon.addClass(path);
		}

		let element = icon.getElement();
		element.attr("title", label);
		element.addClass("vegazoo-top-level-spec-mode-icon");
		element.css("font-size", "24px");
		element.css("line-height", (TopLevelSpecViewSelectionPanel.MODE_HEIGHT - 8) + "px");

		icon.onSelection(() => {
			if (this.currentView === name) {
				let request = new TopLevelSpecViewSelectRequest(name);
				this.conductor.submit(request);
			} else {
				let request = new TopLevelSpecViewSetRequest(name);
				this.conductor.submit(request);
			}
		});

		let layoutData = new GridData(true, true);
		icon.setLayoutData(layoutData);

		this.modeIcons.set(name, icon);
	}

	public setCurrentView(view: string): void {

		let icon = this.modeIcons.get(view);
		let element = icon.getElement();
		element.addClass("selected");

		if (this.currentView !== null) {
			let icon = this.modeIcons.get(this.currentView);
			let element = icon.getElement();
			element.removeClass("selected");
		}
		this.currentView = view;
	}

	public setViewMap(modes: Map<string, string>): void {
		view.disposeChildren(this.container);
		for (let mode of modes.keys()) {
			let label = modes.get(mode);
			let paths = TopLevelSpecViewSelectionPanel.MODE_ICONS[mode];
			this.createViewIcon(this.container, mode, label, paths);
		}
		this.container.relayout();
		this.composite.relayout();
	}

	public adjustHeight(): number {
		this.container.relayout();
		return TopLevelSpecViewSelectionPanel.MODE_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}

export default TopLevelSpecDesignView;