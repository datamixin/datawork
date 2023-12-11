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
import ObjectDefCustomView from "vegazoo/view/custom/ObjectDefCustomView";
import CustomNameTextPanel from "vegazoo/view/custom/CustomNameTextPanel";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNameComboPanel from "vegazoo/view/custom/CustomNameComboPanel";
import CustomNameSwitchPanel from "vegazoo/view/custom/CustomNameSwitchPanel";
import CustomNameNumberPanel from "vegazoo/view/custom/CustomNameNumberPanel";
import CustomNameTextPopupPanel from "vegazoo/view/custom/CustomNameTextPopupPanel";

import MarkDefSizeSetRequest from "vegazoo/requests/custom/MarkDefSizeSetRequest";
import MarkDefTicksSetRequest from "vegazoo/requests/custom/MarkDefTicksSetRequest";
import MarkDefColorSetRequest from "vegazoo/requests/custom/MarkDefColorSetRequest";
import MarkDefPointSetRequest from "vegazoo/requests/custom/MarkDefPointSetRequest";
import MarkDefTooltipSetRequest from "vegazoo/requests/custom/MarkDefTooltipSetRequest";
import MarkDefBaselineSetRequest from "vegazoo/requests/custom/MarkDefBaselineSetRequest";
import MarkDefFontSizeSetRequest from "vegazoo/requests/custom/MarkDefFontSizeSetRequest";

export default class MarkDefCustomView extends ObjectDefCustomView {

	private pointPanel = new CustomNameSwitchPanel("Point");
	private tooltipPanel = new CustomNameSwitchPanel("Tooltip");
	private xPanel = new CustomNameTextPopupPanel("X");
	private yPanel = new CustomNameTextPopupPanel("Y");
	private baselinePanel = new CustomNameComboPanel("Baseline", ["alphabetic", "top", "middle", "bottom"]);
	private textPanel = new CustomNameTextPanel("Text");
	private fontSizePanel = new CustomNameNumberPanel("Font Size");
	private colorPanel = new CustomNameTextPanel("Color");
	private sizePanel = new CustomNameNumberPanel("Size");
	private ticksPanel = new CustomNameSwitchPanel("Ticks");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createPointPanel(panel);
		this.createTooltipPanel(panel);
		this.createBaselinePanel(panel);
		this.createFontSizePanel(panel);
		this.createColorPanel(panel);
		this.createSizePanel(panel);
		this.createTicksPanel(panel);
	}

	private createPointPanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.pointPanel);
		this.pointPanel.onSelection((state: boolean) => {
			let request = new MarkDefPointSetRequest(state);
			this.conductor.submit(request);
		});
	}

	private createTooltipPanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.tooltipPanel);
		this.tooltipPanel.onSelection((state: boolean) => {
			let request = new MarkDefTooltipSetRequest(state);
			this.conductor.submit(request);
		});
	}

	private createBaselinePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.baselinePanel);
		this.baselinePanel.onSelection((value: string) => {
			let request = new MarkDefBaselineSetRequest(value);
			this.conductor.submit(request);
		});
	}

	private createFontSizePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.fontSizePanel);
		this.fontSizePanel.onCommit((newNumber: number) => {
			let request = new MarkDefFontSizeSetRequest(newNumber);
			this.conductor.submit(request);
		});
	}

	private createColorPanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.colorPanel);
		this.colorPanel.onCommit((newColor: string) => {
			let request = new MarkDefColorSetRequest(newColor);
			this.conductor.submit(request);
		});
	}

	private createSizePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.sizePanel);
		this.sizePanel.onCommit((newSize: number) => {
			let request = new MarkDefSizeSetRequest(newSize);
			this.conductor.submit(request);
		});
	}

	private createTicksPanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.ticksPanel);
		this.ticksPanel.onSelection((ticks: boolean) => {
			let request = new MarkDefTicksSetRequest(ticks);
			this.conductor.submit(request);
		});
	}

	public setPoint(point: boolean): void {
		this.pointPanel.setValue(point);
	}

	public setTooltip(tooltip: boolean): void {
		this.tooltipPanel.setValue(tooltip);
	}

	public setX(x: string): void {
		this.xPanel.setValue(x);
	}

	public setY(y: string): void {
		this.yPanel.setValue(y);
	}

	public setBaseline(baseline: string): void {
		this.baselinePanel.setValue(baseline);
	}

	public setText(text: string): void {
		this.textPanel.setValue(text);
	}

	public setFontSize(fontSize: number): void {
		this.fontSizePanel.setValue(fontSize);
	}

	public setColor(color: string): void {
		this.colorPanel.setValue(color);
	}

	public setSize(size: number): void {
		this.sizePanel.setValue(size);
	}

}
