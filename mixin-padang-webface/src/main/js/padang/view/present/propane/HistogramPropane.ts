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
import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import VisageType from "bekasi/visage/VisageType";
import VisageList from "bekasi/visage/VisageList";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageObject from "bekasi/visage/VisageObject";

import * as view from "padang/view/view";

import IsNull from "padang/functions/logical/IsNull";
import DateTime from "padang/functions/datetime/DateTime";

import Propane from "padang/view/present/propane/Propane";
import { BarFigure } from "padang/view/present/propane/Propane";
import PropaneFactory from "padang/view/present/propane/PropaneFactory";
import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import PropaneMenuPanel from "padang/view/present/propane/PropaneMenuPanel";

import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";

export default class HistogramPropane extends Propane {

	public static TICK_COLOR = "#3d83c9";

	private static VALUES = "values";
	private static EDGES = "edges";
	private static NULLS = "nulls";

	private chartPart: Composite = null;
	private figures = new Map<number, BarFigure>();
	private object: VisageObject = null;
	private state = new RangeState();
	private rangePart: Composite = null;
	private rangePanel: HistogramRangePanel = null;

	public setInitialProfile(object: VisageObject): void {
		this.object = object;
		view.dispose(this.nullPart);
		view.dispose(this.nullFigure);
		view.dispose(this.chartPart);
		view.dispose(this.rangePart);
		this.figures.clear();
	}

	public populateFigure(): void {

		this.rangePanel = new HistogramRangePanel(this.conductor, this.column, this.menuSet, this.state);

		let values = <VisageList>this.object.getField(HistogramPropane.VALUES);
		let edges = <VisageList>this.object.getField(HistogramPropane.EDGES);
		let nulls = this.object.getFieldObject(HistogramPropane.NULLS);
		let count = values.size();
		for (let i = 0; i < count; i++) {
			let value = values.getElementObject(i);
			this.maximum = Math.max(this.maximum, value);
		}
		this.maximum = Math.max(this.maximum, nulls);
		this.state.minimum = edges.getElementObject(0);
		this.state.maximum = edges.getElementObject(count);

		if (nulls > 0) {
			this.createNullFigure(this.composite, nulls);
			this.state.anull = true;
		}

		this.chartPart = new Composite(this.composite);
		view.addClass(this.chartPart, "padang-histogram-propane-chart-part");
		view.setAbsoluteLayout(this.chartPart);
		view.setGridData(this.chartPart, true, true);

		// Figure
		for (let i = 0; i < count; i++) {
			let value = values.getElementObject(i);
			let start = edges.getElementObject(i);
			let figure = this.createBarFigure(this.chartPart, i, value, 0, Propane.BAR_DOWN);
			view.css(figure, "border-left", "1px solid " + HistogramPropane.TICK_COLOR);
			this.figures.set(start, figure);
		}

		// Tick and Label
		for (let i = 0; i < count + 1; i++) {
			let label = <VisageNumber>edges.get(i);
			this.createBarTick(this.chartPart, i);
			this.createBarLabel(this.chartPart, i, label);
			this.state.subtype = label.getSubtype();
		}

		this.createRangePart(this.chartPart);
		this.composite.relayout();

	}

	private createRangePart(parent: Composite): void {

		this.rangePart = new Composite(parent);
		view.setAbsoluteLayout(this.rangePart);
		view.setAbsoluteData(this.rangePart, 0, 0, "100%", "100%");

		let begin = 0;
		let max = this.createRangePanel(this.rangePart);
		this.state.full = max;
		let element = parent.getElement();
		let offset = element.offset();

		element.mousedown((event: JQueryMouseEventObject) => {

			let pos = this.calculatePos(offset, event);
			if (this.state.tail === null) {
				begin = pos;
			} else {
				begin = this.state.start;
			}
			this.state.brushing = true;

		});

		element.mousemove((event: JQueryMouseEventObject) => {

			if (this.state.showing === false) {
				this.rangePanel.setShow(true, false);
			}

			let pos = this.calculatePos(offset, event);
			if (this.state.brushing === true) {
				if (this.state.tail === null) {
					if (pos < begin) {
						this.state.start = pos;
						this.state.end = begin;
					} else {
						this.state.start = begin;
						this.state.end = pos;
					}
					this.rangePanel.repositionPanels();
				} else {
					if (this.state.tail === true) {
						this.state.end = pos - this.state.drift;
						if (this.state.end >= this.state.start) {
							this.rangePanel.repositionPanels();
						}
					} else {
						this.state.start = pos + this.state.drift;
						if (this.state.end >= this.state.start) {
							this.rangePanel.repositionPanels();
						}
					}
				}
			} else {
				if (this.state.start === this.state.end) {
					this.state.start = pos;
					this.state.end = pos;
					this.repositionRangePanel();
				}
			}

		});

		element.mouseup((event: JQueryMouseEventObject) => {
			let pos = this.calculatePos(offset, event);
			if (pos === begin && this.state.tail === null) {
				if (element[0] === event.currentTarget) {
					this.applyReset();
				}
			} else {
				this.applyBrushing();
			}
			this.state.tail = null;
			this.state.brushing = false;
		});

		element.hover(
			() => {
				if (this.state.end === this.state.start) {
					this.rangePanel.setShow(true, false);
				}
			},
			() => {
				if (this.state.end === this.state.start) {
					this.rangePanel.setShow(false, false);
				}
			}
		)

		$(document).mouseup(() => {
			if (this.state.brushing === true) {
				this.state.tail = null;
				this.state.brushing = false;
				this.applyBrushing();
			}
		});

	}

	private hideRange(): void {
		this.state.start = null;
		this.state.end = null;
		this.repositionRangePanel();
		this.rangePanel.setShow(false, false);
	}

	private applyBrushing(): void {

		let lessOpen = this.state.isLessOpen();
		let greaterOpen = this.state.isGreaterOpen();
		if (lessOpen === true && greaterOpen === true) {

			this.hideRange();
			this.applyReset();

		} else {

			let values = new Map<string, any>();
			let start = this.state.getStartValue();
			let end = this.state.getEndValue();
			if (lessOpen === true && greaterOpen === false) {

				values.set(TabularColumnInspectApplyRequest.LT, end);

			} else if (lessOpen === false && greaterOpen === true) {

				values.set(TabularColumnInspectApplyRequest.GE, start);

			} else {

				values.set(TabularColumnInspectApplyRequest.GE, start);
				values.set(TabularColumnInspectApplyRequest.LT, end);
			}

			let request = new TabularColumnInspectApplyRequest(this.column, this.type, values);
			this.conductor.submit(request);
		}

	}

	private applyReset(): void {
		let request = new TabularColumnInspectResetRequest();
		this.conductor.submit(request);
	}

	private calculatePos(offset: JQueryCoordinates, event: JQueryMouseEventObject): number {

		let max = this.state.full - Propane.BAR_DOWN + (this.state.tail === true ? this.state.drift : 0);
		let min = Propane.BAR_DOWN - (this.state.tail === false ? this.state.drift : 0);

		let adjust = this.state.anull === true ? HistogramPropane.BAR_HEIGHT : 0;
		let top = Math.min(max + adjust, event.clientY - offset.top);
		top = Math.max(top, min + adjust);
		return top - adjust;
	}

	private repositionRangePanel(): void {
		this.rangePanel.repositionPanels();
		this.rangePanel.relayout();
	}

	private createRangePanel(parent: Composite): number {

		let values = <VisageList>this.object.getField(HistogramPropane.VALUES);
		let size = values.size();
		let full = size * HistogramPropane.BAR_HEIGHT + Propane.BAR_DOWN * 2;

		this.rangePanel.createControl(parent);
		view.setAbsoluteData(this.rangePanel, 0, full, "100%", 0);
		this.rangePanel.createHandlers(parent, full);

		return full;

	}

	private createBarTick(parent: Composite, index: number): void {

		let label = new Label(parent);
		view.addClass(label, "padang-histogram-propane-bar-tick");
		view.css(label, "background", HistogramPropane.TICK_COLOR);

		let top = index * HistogramPropane.BAR_HEIGHT + Propane.BAR_DOWN;
		view.setAbsoluteData(label, 0, top, 3, 1);

	}

	private createBarLabel(parent: Composite, index: number, value: VisageNumber): void {

		let label = new Label(parent);
		label.setData(value);
		view.addClass(label, "padang-histogram-propane-bar-label");
		this.updateLabelText(value, label);
		let height = HistogramPropane.BAR_HEIGHT;
		let element = label.getElement();
		element.css("font-size", "9px");
		element.css("text-overflow", "ellipsis");
		element.css("line-height", height + "px");
		element.css("color", "#888");

		let top = index * HistogramPropane.BAR_HEIGHT + Propane.BAR_DOWN;
		view.setAbsoluteData(label, 4, top - height / 2, "100%", height);

	}

	private updateLabelText(value: VisageNumber, label: Label): void {
		let result = value.getValue();
		let subtype = value.getSubtype();
		let formatted = VisageNumber.getFormatted(result, subtype, this.state.format);
		label.setText(formatted);
	}

	public setFormat(format: string): void {
		this.state.format = format;
		let children = this.chartPart.getChildren();
		for (let child of children) {
			if (child instanceof Label) {
				let data = child.getData();
				if (data instanceof VisageNumber) {
					this.updateLabelText(data, child);
				}
			}
		}
	}

	public setInspectProfile(object: VisageObject): void {
		if (object === null) {
			if (this.nullFigure !== null) {
				this.nullFigure.setInspectValue(0);
			}
			for (let key of this.figures.keys()) {
				let figure = this.figures.get(key);
				figure.setInspectValue(0);
			}
			this.hideRange();
		} else {
			let values = <VisageList>object.getField(HistogramPropane.VALUES);
			let edges = <VisageList>object.getField(HistogramPropane.EDGES);
			let nulls = object.getFieldObject(HistogramPropane.NULLS);
			for (let i = 0; i < edges.size() - 1; i++) {
				let start = edges.getElementObject(i);
				if (this.figures.has(start)) {
					let figure = this.figures.get(start);
					let value = values.getElementObject(i);
					figure.setInspectValue(value);
				}
			}
			if (this.nullFigure !== null) {
				this.nullFigure.setInspectValue(nulls);
			}
		}
	}

	public setSelectionValues(values: Map<string, any>): void {

		if (values.has(IsNull.FUNCTION_NAME)) {

			this.setSelections([this.nullFigure]);
			this.rangePanel.setShow(false, false);

		} else {

			let ge = values.get(TabularColumnInspectApplyRequest.GE);
			let lt = values.get(TabularColumnInspectApplyRequest.LT);
			if (ge !== undefined && lt !== undefined) {

				this.state.setStartValue(ge);
				this.state.setEndValue(lt);

			} else if (ge !== undefined) {

				this.state.setStartValue(ge);
				this.state.setEndValue(this.state.maximum);

			} else if (lt !== undefined) {

				this.state.setStartValue(this.state.minimum);
				this.state.setEndValue(lt);

			} else {
				this.hideRange();
			}

			this.setSelections([]);
			if (this.state.start < this.state.end) {
				this.repositionRangePanel();
				this.rangePanel.setShow(true, true);
			}
		}
	}

	public adjustHeight(): number {
		let height = super.adjustHeight();
		let list = <VisageList>this.object.getField(HistogramPropane.VALUES);
		let size = list.size();
		return height + size * (HistogramPropane.BAR_HEIGHT) + Propane.BAR_DOWN * 2;
	}

}


class RangeState {

	public minimum: number = null;
	public maximum: number
	public showing: boolean = null;
	public brushing: boolean = null;
	public start: number = null;
	public end: number = null;
	public full: number = null;
	public tail: boolean = null;
	public drift: number = null;
	public anull: boolean = false;
	public subtype: string = null;
	public format: string = null;

	public isLessOpen(): boolean {
		return this.start <= Propane.BAR_DOWN;
	}

	public isGreaterOpen(): boolean {
		return this.end >= this.full - Propane.BAR_DOWN;
	}

	private getRealValue(point: number): number {
		let range = this.maximum - this.minimum;
		let current = point - Propane.BAR_DOWN;
		let span = this.full - 2 * Propane.BAR_DOWN;
		let scale = current / span;
		return (range * scale) + this.minimum;
	}

	public getStartValue(): number {
		return this.getRealValue(this.start);
	}

	public getEndValue(): number {
		return this.getRealValue(this.end);
	}

	public getViewValue(value: number): number {
		let delta = value - this.minimum;
		let range = this.maximum - this.minimum;
		let scale = delta / range;
		let span = this.full - 2 * Propane.BAR_DOWN;
		let offset = Math.round(span * scale);
		return offset + Propane.BAR_DOWN;
	}

	public setStartValue(value: number): void {
		this.start = this.getViewValue(value);
	}

	public setEndValue(value: number): void {
		this.end = this.getViewValue(value);
	}

}

abstract class HistogramMarkPanel extends ConductorPanel {

	protected column: string = null;
	protected menuSet: PropaneMenuSet = null;
	protected state: RangeState = null;

	constructor(conductor: Conductor, column: string, menuSet: PropaneMenuSet, state: RangeState) {
		super(conductor);
		this.column = column;
		this.menuSet = menuSet;
		this.state = state;
	}

}

class HistogramRangePanel extends HistogramMarkPanel {

	private composite: Composite = null;
	private headDragPanel: HistogramDragPanel = null;
	private tailDragPanel: HistogramDragPanel = null;
	private headInfoPanel: HistogramInfoPanel = null;
	private tailInfoPanel: HistogramInfoPanel = null;

	public createControl(parent: Composite) {

		this.composite = new Composite(parent);
		let element = this.composite.getElement();
		element.addClass("padang-histogram-range-panel");
		element.css("background-color", "rgb(255, 255, 255, 0.5");
		element.css("border", "1px solid " + HistogramPropane.TICK_COLOR);

		view.setAbsoluteLayout(this.composite);
	}

	public createHandlers(parent: Composite, top: number): void {
		this.headDragPanel = this.createDragPanel(parent, top - Propane.BAR_DOWN, false);
		this.tailDragPanel = this.createDragPanel(parent, top, true);
		this.headInfoPanel = this.createInfoPanel(parent, top, false);
		this.tailInfoPanel = this.createInfoPanel(parent, top, true);
		this.setShow(false, false);
	}

	private createDragPanel(parent: Composite, top: number, tail: boolean): HistogramDragPanel {
		let panel = new HistogramDragPanel(this.conductor, this.column, this.menuSet, this.state, tail);
		panel.createControl(parent);
		view.setAbsoluteData(panel, 0, top, "100%", Propane.BAR_DOWN);
		return panel;
	}

	private createInfoPanel(parent: Composite, top: number, tail: boolean): HistogramInfoPanel {
		let panel = new HistogramInfoPanel(this.conductor, this.column, this.menuSet, this.state, tail);
		panel.createControl(parent);
		let layoutData = view.setAbsoluteData(panel, webface.DEFAULT, top, "40%", Propane.BAR_DOWN * 2);
		layoutData.right = Propane.BAR_DOWN;
		return panel;
	}

	public repositionPanels(): void {

		let rangeData = view.getAbsoluteData(this.composite);
		rangeData.top = this.state.start;
		rangeData.height = this.state.end - this.state.start + 1;
		let color = HistogramPropane.TICK_COLOR;
		if (this.state.end === this.state.start) {

			view.css(this.composite, "border-top", "1px solid " + color);
			view.css(this.composite, "border-bottom", "0px");

		} else {

			let lessOpen = this.state.isLessOpen();
			let greaterOpen = this.state.isGreaterOpen();

			let open = "dotted";
			let close = "solid";
			view.css(this.composite, "border-top", "1px " + (lessOpen === true ? open : close) + " " + color);
			view.css(this.composite, "border-bottom", "1px  " + (greaterOpen === true ? open : close) + " " + color);
			view.css(this.headInfoPanel, "opacity", lessOpen === true ? 0 : 1);
			view.css(this.tailInfoPanel, "opacity", greaterOpen === true ? 0 : 1);
		}

		let headDragData = view.getAbsoluteData(this.headDragPanel);
		headDragData.top = this.state.start - Propane.BAR_DOWN + 1;

		let tailDragData = view.getAbsoluteData(this.tailDragPanel);
		tailDragData.top = this.state.end;

		let headInfoData = view.getAbsoluteData(this.headInfoPanel);
		let tailInfoData = view.getAbsoluteData(this.tailInfoPanel);

		let height = this.state.end - this.state.start;
		let halfRange = height / 2;
		let halfFigure = HistogramPropane.BAR_HEIGHT / 2;
		if (height === 0) {
			let center = this.state.start + halfRange;
			headInfoData.top = center - halfFigure;
			tailInfoData.top = headInfoData.top;
		} else {
			let drift = Math.max(0, halfFigure - halfRange);
			headInfoData.top = this.state.start - halfFigure - drift;
			tailInfoData.top = this.state.end - halfFigure + drift;
		}

		this.relayout();

		let startValue = this.state.getStartValue();
		this.headInfoPanel.setLabel(startValue);

		let endValue = this.state.getEndValue();
		this.tailInfoPanel.setLabel(endValue);

	}

	public setShow(show: boolean, handlers: boolean): void {
		show = this.state.start === null ? false : show;
		this.state.showing = show;
		view.css(this, "opacity", show === true ? 1 : 0);
		this.headInfoPanel.setShow(show);
		this.tailInfoPanel.setShow(show);
		if (show === false) {
			this.setShowDragPanels(false);
		} else {
			this.setShowDragPanels(handlers);
		}
	}

	public setShowDragPanels(show: boolean): void {
		this.headDragPanel.setShow(show);
		this.tailDragPanel.setShow(show);
	}

	public getHeadPanel(): HistogramDragPanel {
		return this.headDragPanel;
	}

	public getTailPanel(): HistogramDragPanel {
		return this.tailDragPanel;
	}

	public relayout(): void {
		let parent = this.composite.getParent();
		parent.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

abstract class HistogramSidePanel extends HistogramMarkPanel {

	protected tail: boolean = false;

	constructor(conductor: Conductor, column: string, menuSet: PropaneMenuSet, state: RangeState, tail: boolean) {
		super(conductor, column, menuSet, state);
		this.tail = tail;
	}

}

class HistogramDragPanel extends HistogramSidePanel {

	private composite: Composite = null;
	private icon: WebFontIcon = null;
	private show = false;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		view.setAbsoluteLayout(this.composite);
		view.css(this.composite, "cursor", "ns-resize");

		this.createIcon(this.composite);

		let element = this.composite.getElement();
		element.mousedown((event: JQueryEventObject) => {
			if (this.show === true) {
				this.state.tail = this.tail;
				let top = event.offsetY + 1;// Border
				this.state.drift = this.tail === true ? top : Propane.BAR_DOWN - top;
			}
		});
	}

	public createIcon(parent: Composite): void {

		this.icon = new WebFontIcon(parent);
		this.icon.addClasses("mdi", "mdi-dots-horizontal");
		this.icon.addClasses("padang-histogram-range-handler-panel");
		view.css(this.icon, "font-size", "16px");
		view.css(this.icon, "background", "#C8C8C8");
		view.css(this.icon, "line-height", Propane.BAR_DOWN + "px");
		view.css(this.icon, "border", "1px solid " + HistogramPropane.TICK_COLOR);
		let radius = (Propane.BAR_DOWN / 2) + "px";
		if (this.tail === true) {
			view.css(this.icon, "border-bottom-left-radius", radius);
			view.css(this.icon, "border-bottom-right-radius", radius);
		} else {
			view.css(this.icon, "border-top-left-radius", radius);
			view.css(this.icon, "border-top-right-radius", radius);
		}
		let layoutData = view.setAbsoluteData(this.icon, "35%", 0, HistogramPropane.BAR_HEIGHT, Propane.BAR_DOWN);
		layoutData.transform = "translate(-50%,0)";

	}

	public setShow(show: boolean): void {
		this.show = show;
		view.css(this.composite, "opacity", show === true ? 0.75 : 0);
		view.css(this.icon, "opacity", show === true ? 1 : 0);
	}

	public getTail(): boolean {
		return this.tail;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class HistogramInfoPanel extends HistogramSidePanel {

	private composite: Composite = null;
	private valueLabel: Label = null;
	private menuPanel: PropaneMenuPanel = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		let layout = view.setGridLayout(this.composite, 2, 0, 0, 0, 0);
		layout.marginRight = 0;

		let element = this.composite.getElement();
		element.css("padding-left", "4px");
		element.css("padding-right", "4px");
		element.css("background", "rgb(255, 255, 255, 0.75)");
		element.css("line-height", ((HistogramPropane.BAR_HEIGHT) - 2) + "px");
		element.css("border", "1px solid " + HistogramPropane.TICK_COLOR);

		element.mousedown((event: JQueryEventObject) => {
			event.stopPropagation();
		});

		element.mouseup((event: JQueryEventObject) => {
			event.stopPropagation();
		});

		this.createValueLabel(this.composite);

		let actions = this.menuSet.hasHistogramActions();
		if (actions === true) {
			this.createMenuPanel(this.composite);
		}
	}

	private createValueLabel(parent: Composite): void {
		this.valueLabel = new Label(parent);
		let element = this.valueLabel.getElement();
		element.css("text-indent", "3px");
		element.css("font-size", "10px");
		view.setGridData(this.valueLabel, true, true);
	}

	private createMenuPanel(parent: Composite): void {
		let action = new HistogramActionGroup(this.column, this.state, this.menuSet, this.tail);
		this.menuPanel = new PropaneMenuPanel(this.conductor, action);
		this.menuPanel.createControl(parent);
		view.setGridData(this.menuPanel, 24, true);
	}

	public setLabel(value: number): void {
		let text = VisageNumber.getFormatted(value, this.state.subtype, this.state.format);
		this.valueLabel.setText(text);
	}

	public setShow(show: boolean): void {
		if (this.tail === true) {
			show = this.state.isGreaterOpen() ? false : show;
		} else {
			show = this.state.isLessOpen() ? false : show;
		}
		view.css(this.composite, "opacity", show === true ? 1 : 0);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class HistogramActionGroup extends GroupAction {

	private column: string = null;
	private state: RangeState = null;
	private menuSet: PropaneMenuSet = null;
	private tail: boolean = null;

	constructor(column: string, state: RangeState, menuSet: PropaneMenuSet, tail: boolean) {
		super();
		this.column = column;
		this.state = state;
		this.menuSet = menuSet;
		this.tail = tail;
	}

	public getActions(): Action[] {
		let end: any = this.state.getEndValue();
		let start: any = this.state.getStartValue();
		if (VisageType.isTemporal(this.state.subtype)) {
			let endLiteral = VisageNumber.getFormatted(end, this.state.subtype)
			let startLiteral = VisageNumber.getFormatted(start, this.state.subtype)
			end = DateTime.FUNCTION_NAME + "(\"" + endLiteral + "\")";
			start = DateTime.FUNCTION_NAME + "(\"" + startLiteral + "\")";
		}
		if (this.tail === true) {
			start = this.state.isLessOpen() === true ? null : start;
			return this.menuSet.listEndActions(this.column, start, end);
		} else {
			end = this.state.isGreaterOpen() === true ? null : end;
			return this.menuSet.listStartActions(this.column, start, end);
		}
	}

}

let factory = PropaneFactory.getInstance();
factory.register(VisageType.INT32, <any>HistogramPropane);
factory.register(VisageType.INT64, <any>HistogramPropane);
factory.register(VisageType.FLOAT32, <any>HistogramPropane);
factory.register(VisageType.FLOAT64, <any>HistogramPropane);
factory.register(VisageType.DATETIME, <any>HistogramPropane);
factory.register(VisageType.DATETIME64, <any>HistogramPropane);
factory.register(VisageType.TIMESTAMP, <any>HistogramPropane);
factory.register(VisageType.DATE, <any>HistogramPropane);
