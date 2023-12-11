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

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import VisageError from "bekasi/visage/VisageError";
import VisageValue from "bekasi/visage/VisageValue";

import * as view from "padang/view/view";
import DefaultCellValuePanel from "padang/view/DefaultCellValuePanel";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";
import DefaultMarkerLabelPanel from "padang/view/DefaultMarkerLabelPanel";
import BufferedContentProvider from "padang/view/BufferedContentProvider";

import * as grid from "padang/grid/grid";
import GridControl from "padang/grid/GridControl";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";

import VisageMutation from "padang/visage/VisageMutation";

import Propane from "padang/view/present/propane/Propane";
import FrequencyPropane from "padang/view/present/propane/FrequencyPropane";

import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import TabularEventAdapter from "padang/view/TabularEventAdapter";

import InteractionFactory from "padang/interactions/InteractionFactory";

import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import DisplayHeaderPanel from "padang/view/present/DisplayHeaderPanel";
import TabularPresentMaker from "padang/view/present/TabularPresentMaker";
import TabularColumnProperties from "padang/view/present/TabularColumnProperties";
import TabularColumnHeaderPanel from "padang/view/present/TabularColumnHeaderPanel";

import TabularFocusStateRefreshRequest from "padang/requests/present/TabularFocusStateRefreshRequest";

export default class TabularPresentPanel extends ConductorPanel {

	private static HEADER_HEIGHT = 30;
	private static ITEM_HEIGHT = 24;

	private composite: Composite = null;
	private style = new TabularControlStyle();
	private maker: TabularPresentMaker = null;
	private properties: TabularColumnProperties = null;
	private menuSet: PropaneMenuSet = null;
	private headerPanel: DisplayHeaderPanel = null;
	private resultPart: Composite = null;
	private loadingPart: Composite = null;
	private mainLoadingLabel: Label = null;
	private secondaryLoadingLabel: Label = null;
	private gridControl: GridControl = null;
	private provider: BufferedContentProvider = null;
	private extender: TabularLabelExtender = null;

	constructor(conductor: Conductor, properties: TabularColumnProperties,
		maker: TabularPresentMaker, menuSet: PropaneMenuSet) {
		super(conductor);
		this.properties = properties;
		this.maker = maker;
		this.menuSet = menuSet;
		this.headerPanel = new DisplayHeaderPanel(conductor);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-tabular-present-panel");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createHeaderPanel(this.composite);
		this.createResultPart(this.composite);
	}

	private createHeaderPanel(parent: Composite): void {
		this.headerPanel.createControl(parent);
		view.css(this.headerPanel, "border-bottom", "1px solid " + grid.BORDER_COLOR);
		view.css(this.headerPanel, "line-height", TabularPresentPanel.HEADER_HEIGHT + "px");
		view.setGridData(this.headerPanel, true, TabularPresentPanel.HEADER_HEIGHT);
	}

	private createResultPart(parent: Composite): void {
		this.resultPart = new Composite(parent);
		view.addClass(this.resultPart, "padang-tabular-present-panel-result-part");
		view.setAbsoluteLayout(this.resultPart);
		view.setGridData(this.resultPart, true, true);
		this.createGridControl(this.resultPart);
		this.createLoadingPart(this.resultPart);
	}

	private createGridControl(parent: Composite): void {

		this.provider = new BufferedContentProvider(this.conductor);
		this.provider.setOnErrorRaised((error: VisageError) => {
			this.headerPanel.setError(error);
		});
		this.provider.setOnCountChanged((row: number, column: number) => {
			this.headerPanel.setRowColumn(row, column);
		});

		this.gridControl = new GridControl(parent, this.style);
		view.setAbsoluteData(this.gridControl, 0, 0, "100%", "100%");

		this.gridControl.setProvider(this.provider);
		this.gridControl.setAdapter(new TabularEventAdapter(this.conductor));

		this.extender = new TabularLabelExtender(this.conductor, this.properties, this.maker, this.menuSet);
		this.gridControl.setExtender(this.extender);

	}

	private createLoadingPart(parent: Composite): void {

		this.loadingPart = new Composite(parent);
		this.loadingPart.setVisible(false);

		view.setGridLayout(this.loadingPart, 1, 10, 10, 0, 0);

		view.addClass(this.loadingPart, "padang-tabular-present-panel-loading-part");
		view.css(this.loadingPart, "z-index", 3);
		view.css(this.loadingPart, "cursor", "progress");
		view.css(this.loadingPart, "font-style", "italic");
		view.css(this.loadingPart, "background-color", "rgba(255, 255, 255, 0.8)");
		view.css(this.loadingPart, "text-indent", TabularPresentPanel.ITEM_HEIGHT / 2 + "px");
		view.css(this.loadingPart, "line-height", TabularPresentPanel.ITEM_HEIGHT + "px");
		view.setAbsoluteData(this.loadingPart, 0, 0, "100%", this.style.headerHeight - 1);

		this.createMainLoadingLabel(this.loadingPart);
		this.createSecondaryLoadingLabel(this.loadingPart);
	}

	private createMainLoadingLabel(parent: Composite): void {
		this.mainLoadingLabel = new Label(parent);
		view.setGridData(this.mainLoadingLabel, true, TabularPresentPanel.ITEM_HEIGHT);
	}

	private createSecondaryLoadingLabel(parent: Composite): void {
		this.secondaryLoadingLabel = new Label(parent);
		view.setGridData(this.secondaryLoadingLabel, true, TabularPresentPanel.ITEM_HEIGHT);
	}

	private setLoading(state: boolean, message?: string): void {
		this.mainLoadingLabel.setText(message);
		this.setSecondaryLoadingMessage("");
		view.setVisible(this.loadingPart, state);
	}

	public refresh(callback: () => void): void {
		this.setLoadingProgress(true, "Refresh...");
		this.provider.clearBuffer();
		this.gridControl.refresh(() => {
			this.refreshProfiles(() => {
				callback();
			});
		});
	}

	public refreshRows(): void {
		this.provider.clearBuffer();
		this.gridControl.refreshRows(() => {
			let request = new TabularFocusStateRefreshRequest();
			this.conductor.submit(request);
		});
	}

	private refreshProfiles(callback: () => void): void {
		this.loadColumnLabels("Loading Profile...", "profiled",
			(name: string, type: string, callback: () => void) => {
				let properties = <TabularColumnProperties>this.extender.getColumnProperties();
				properties.loadProfile(name, type, callback);
			}, callback
		);
	}

	public refreshInspection(): void {
		this.loadColumnLabels("Inspect Profile...", "inspected",
			(name: string, type: string, callback: () => void) => {
				let properties = <TabularColumnProperties>this.extender.getColumnProperties();
				properties.loadInspectProfile(name, type, callback);
			}
		);
	}

	private loadColumnLabels(message: string, suffix: string,
		callback: (name: string, type: string, done: () => void) => void, complete?: () => void) {
		this.setLoadingProgress(true, message);
		this.provider.getColumnLabels((labels: DefaultColumnLabel[]) => {
			if (labels.length === 0) {
				this.setLoadingProgress(false);
			} else {
				let counter = 0;
				for (let label of labels) {
					let name = label.getLabel();
					let type = label.getType();
					callback(name, type, () => {
						counter++;
						let message = "Column " + name + " (" + counter + " of " + labels.length + ") " + suffix;
						this.setSecondaryLoadingMessage(message);
						if (counter === labels.length) {
							this.setLoadingProgress(false);
							if (complete !== undefined) {
								complete();
							}
						}
					});
				}
			}
		});
	}

	public setSecondaryLoadingMessage(message: string): void {
		this.secondaryLoadingLabel.setText(message);
	}

	public setLoadingProgress(state: boolean, message?: string): void {
		this.setLoading(state, message);
	}

	public setColumnWidth(name: string, width: number): void {
		let properties = this.extender.getColumnProperties();
		properties.applyWidth(name, width);
	}

	public setColumnFormat(name: string, format: string): void {
		let properties = this.extender.getColumnProperties();
		properties.applyProperty(name, TabularColumnProperties.FORMAT, format);
	}

	public setInspectProfile(column: string, profile: VisageValue): void {
		let properties = this.extender.getColumnProperties();
		properties.applyProperty(column, TabularColumnProperties.INSPECT_PROFILE, profile);
	}

	public setInspectSelection(column: string, values: Map<string, any>): void {
		let properties = this.extender.getColumnProperties();
		properties.applyProperty(column, TabularColumnProperties.INSPECT_SELECTIONS, values);
	}

	public mutate(mutation: VisageMutation): void {
		this.gridControl.mutate(mutation);
	}

	public setLeftOrigin(left: number): void {
		this.gridControl.setLeftOrigin(left);
	}

	public setTopOrigin(top: number): void {
		this.gridControl.setTopOrigin(top);
	}

	public setSelectedRow(index: number): void {
		this.gridControl.setSelectedRow(index);
	}

	public setSelectedCell(row: number, column: number): void {
		this.gridControl.setSelectedCell(row, column);
	}

	public setSelectedColumn(index: number): void {
		this.gridControl.setSelectedColumn(index);
	}

	public relayout(): void {
		this.gridControl.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class TabularControlStyle extends GridControlStyle {

	public headerHeight: number = Propane.BAR_HEIGHT * (FrequencyPropane.LIMIT + 4);

}

abstract class ConductorBase {

	protected conductor: Conductor = null;
	protected factory = InteractionFactory.getInstance();

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

}

class TabularLabelExtender extends ConductorBase implements GridLabelExtender {

	private maker: TabularPresentMaker = null;
	private properties: TabularColumnProperties = null;
	private menuSet: PropaneMenuSet = null;

	constructor(conductor: Conductor, properties: TabularColumnProperties,
		maker: TabularPresentMaker, menuSet: PropaneMenuSet) {
		super(conductor);
		this.properties = properties;
		this.maker = maker;
		this.menuSet = menuSet;
	}

	public getCornerSidePanel(): ConductorPanel {
		return this.maker.createCornerPanel();
	}

	public getColumnLabelPanel(): DefaultColumnLabelPanel {
		let titlePanel = this.maker.createTitlePanel();
		let contentPanel = new TabularColumnHeaderPanel(this.conductor, this.menuSet);
		return new DefaultColumnLabelPanel(this.conductor, titlePanel, contentPanel);
	}

	public getColumnProperties(): DefaultColumnProperties {
		return this.properties;
	}

	public getMarkerLabelPanel(): DefaultMarkerLabelPanel {
		return new DefaultMarkerLabelPanel(this.conductor);
	}

	public getCellValuePanel(): DefaultCellValuePanel {
		return new DefaultCellValuePanel(this.conductor);
	}

}

