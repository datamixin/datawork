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

import VisageValue from "bekasi/visage/VisageValue";

import * as view from "padang/view/view";
import TypeDecoration from "padang/view/TypeDecoration";

import * as anatomy from "padang/view/anatomy/anatomy";

import ScrollablePanel from "padang/panels/ScrollablePanel";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import ConstantSurface from "padang/view/present/surface/ConstantSurface";

import PrefaceLabelPanel from "padang/view/explain/PrefaceLabelPanel";

export abstract class ValueFieldExplainView extends ConductorView {

	public static ICON_WIDTH = 30;
	public static LIST_WIDTH = 140;
	public static MIN_VARIABLE_WIDTH = 48;

	private composite: Composite = null;
	private prefaceListPanel: ScrollablePanel = null;
	private examplePart: Composite = null;
	private examplePanel: SurfacePanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-value-field-explain-view");
		element.css("line-height", (anatomy.ITEM_HEIGHT - 2) + "px");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createHeaderPart(this.composite);
		this.createPrefacePart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {
		this.createHeaderControl(parent);
		let headerControl = this.getHeaderControl();
		view.setGridData(headerControl, true, anatomy.ITEM_HEIGHT + 10);
	}

	private createPrefacePart(parent: Composite): void {
		let composite = new Composite(parent);
		view.addClass(composite, "padang-value-field-explain-preface-part");
		view.css(composite, "border-top", "1px solid #D8D8D8");
		view.setGridLayout(composite, 2, 0, 0, 0, 0);
		view.setGridData(composite, true, true);
		this.createPrefaceListPart(composite);
		this.createExampleContentPart(composite);
	}

	protected abstract createHeaderControl(parent: Composite): void;

	protected abstract getHeaderControl(): Control;

	protected abstract adjustHeaderHeight(): number;

	public abstract setType(type: string): void;

	private createPrefaceListPart(parent: Composite): void {
		this.prefaceListPanel = new ScrollablePanel(5, 5);
		this.prefaceListPanel.createControl(parent);
		view.addClass(this.prefaceListPanel, "padang-value-field-explain-preface-list-part");
		view.css(this.prefaceListPanel, "background-color", "#FFF");
		view.css(this.prefaceListPanel, "border-right", "1px solid #D8D8D8");
		view.setGridData(this.prefaceListPanel, ValueFieldExplainView.LIST_WIDTH, true);
	}

	private createExampleContentPart(parent: Composite): void {
		this.examplePart = new Composite(parent);
		view.addClass(this.examplePart, "padang-value-field-explain-example-content-part");
		view.setGridLayout(this.examplePart, 1, 0, 0);
		view.setGridData(this.examplePart, true, true);
	}

	public setPrefaceNames(prefaces: Map<string, string>): void {
		for (let key of prefaces.keys()) {
			let type = prefaces.get(key);
			let panel = new PrefaceLabelPanel(this.conductor);
			this.prefaceListPanel.addPanel(panel);
			let icon = TypeDecoration.ICON_MAP[type];
			panel.setLabel(key);
			panel.setIcon(icon);
		}
		this.prefaceListPanel.relayout();
	}

	public setPrefaceExample(value: VisageValue): void {
		if (this.examplePanel !== null) {
			view.dispose(this.examplePanel);
		}
		let registry = SurfaceRegistry.getInstance();
		let surface = registry.get(value);
		this.examplePanel = surface.createPanel(this.conductor);
		this.examplePanel.createControl(this.examplePart);
		this.examplePanel.setValue(value);
		let layoutData = view.setGridData(this.examplePanel, true, true);
		layoutData.horizontalIndent = surface instanceof ConstantSurface ? 5 : 0;
		this.examplePart.relayout();
	}

	public setSelectedPreface(preface: string): void {
		let composite = <Composite>this.prefaceListPanel.getContent();
		let children = composite.getChildren();
		for (let child of children) {
			let data = child.getData();
			if (data instanceof PrefaceLabelPanel) {
				let label = data.getLabel();
				data.setSelected(label === preface);
			}
		}
	}

	public relayout(): void {
		let height = this.adjustHeaderHeight();
		let control = this.getHeaderControl();
		view.setGridData(control, true, height);
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.examplePart, index);
		view.setGridData(child, true, true);
		view.setControlData(child);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}

export default ValueFieldExplainView;

