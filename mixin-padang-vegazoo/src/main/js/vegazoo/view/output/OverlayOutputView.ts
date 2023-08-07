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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import * as view from "padang/view/view";

import OverlayResizeStrip from "vegazoo/view/output/OverlayResizeStrip";

import OverlayRemoveRequest from "vegazoo/requests/output/OverlayRemoveRequest";
import OverlayWidthSetRequest from "vegazoo/requests/output/OverlayWidthSetRequest";
import OverlayHeightSetRequest from "vegazoo/requests/output/OverlayHeightSetRequest";

export abstract class OverlayOutputView extends ConductorView {

	private static SPACE = 2;
	private static PADDING = 5;
	private boundingRect: DOMRect = null;
	private resizeStrip = new OverlayResizeStrip(OverlayOutputView.PADDING);
	private boundaryLines: JQuery[] = [];
	private menuPart: Composite = null;

	public createControl(_parent: Composite, _index: number): void {
		throw new Error("Overlay doesn't create a control'");
	}

	public getControl(): Control {
		throw new Error("Overlay doesn't have dedicated control'");
	}

	public applyBoundingRect(rect: DOMRect) {

		this.boundingRect = rect;
		this.clear(this.boundaryLines);
		this.remove(this.menuPart);

		this.resizeStrip.reset();
		this.resizeStrip.setWidthCallback((deltaX: number) => {
			let request = new OverlayWidthSetRequest(deltaX);
			this.conductor.submit(request);
		});
		this.resizeStrip.setHeightCallback((deltaY: number) => {
			let request = new OverlayHeightSetRequest(deltaY);
			this.conductor.submit(request);
		});

	}

	private clear(elements: JQuery[]): void {
		for (let element of elements) {
			element.remove();
		}
		elements.splice(0, elements.length);
	}

	private remove(target: Control | JQuery): void {
		if (target instanceof Control) {
			view.dispose(target);
		} else {
			if (target !== null) {
				target.remove();
			}
		}
	}

	public createResizeHandlers(chart: JQuery) {
		this.resizeStrip.setContainer(chart);
		let offset = chart.offset();
		let box = this.boundingRect;
		let rect = new DOMRect(box.x - offset.left, box.y - offset.top, box.width, box.height);
		this.resizeStrip.createHandlers(rect);
	}

	public createBoundaryLines(chart: JQuery): void {
		let rect = this.boundingRect;
		let space = OverlayOutputView.SPACE;
		let padding = OverlayOutputView.PADDING;
		let double = OverlayOutputView.PADDING * 2;
		this.createBoundaryLine(chart, rect.x - padding, rect.y - padding, rect.width + space + double, space);
		this.createBoundaryLine(chart, rect.x - padding, rect.y - padding, space, rect.height + double);
		this.createBoundaryLine(chart, rect.right + padding, rect.y - padding, space, rect.height + space + double);
		this.createBoundaryLine(chart, rect.x - padding, rect.bottom + padding, rect.width + space + double, space);
		this.createMenuPart(chart, rect.right - double + 2, rect.y - double - 4);
	}

	private createBoundaryLine(chart: JQuery, x: number, y: number, width: number, height: number): void {
		let offset = chart.offset();
		let line = jQuery("<div>");
		line.addClass("vegazoo-vegalite-chart-boundary-line");
		line.css("position", "absolute");
		line.css("left", x - offset.left);
		line.css("top", y - offset.top);
		line.width(width);
		line.height(height);
		chart.append(line);
		this.boundaryLines.push(line);
	}

	private createMenuPart(chart: JQuery, x: number, y: number): void {
		this.menuPart = this.createPart(chart, x, y);
		let icon = this.createIcon(this.menuPart, "mdi-menu-down");
		view.css(icon, "font-size", "24px");
		view.css(icon, "text-indent", "-0.75px");
		icon.onSelection((event: Event) => {
			let actions: BaseAction[] = [
				new RemoveAction(this.conductor)
			];
			let action = new OverlayOutputPopupAction(this.conductor, actions);
			action.open(event);
		});
	}

	private createPart(chart: JQuery, x: number, y: number): Composite {

		let offset = chart.offset();
		let container = jQuery("<div>");
		container.css("position", "absolute");
		container.css("left", x - offset.left);
		container.css("top", y - offset.top);
		container.css("z-index", 1);
		container.width(24);
		container.height(24);
		chart.append(container);

		let composite = new Composite(container);
		view.css(composite, "border", "2px solid transparent");
		view.css(composite, "border-radius", "12px");
		view.setFillLayoutHorizontal(composite);
		view.setVisible(composite, false);
		return composite;
	}

	private createIcon(parent: Composite, image: string): WebFontIcon {
		let icon = new WebFontIcon(parent);
		icon.addClasses("mdi", image);
		view.css(icon, "line-height", "20px");
		view.css(icon, "color", "#888");
		return icon;
	}

	public isInRange(x: number, y: number): boolean {
		let rect = this.boundingRect;
		let space = OverlayOutputView.SPACE;
		let padding = OverlayOutputView.PADDING;
		let inX = rect.left - padding <= x && x <= rect.right + padding + space;
		let inY = rect.top - padding <= y && y <= rect.bottom + padding + space;
		return inX && inY;
	}

	public setSelected(selected: boolean): void {
		for (let line of this.boundaryLines) {
			line.css("background-color", selected === true ? "#81bfff" : "transparent");
		}
		this.setIconVisible(this.menuPart, selected);
	}

	private setIconVisible(part: Composite, state: boolean): void {
		view.setVisible(part, state);
		view.css(part, "background-color", state === true ? "#FFF" : "transparent");
		view.css(part, "border-color", state === true ? "#81bfff" : "transparent");
	}

}

export default OverlayOutputView;

class OverlayOutputPopupAction extends BasePopupAction {

	private actions: BaseAction[] = [];

	constructor(conductor: Conductor, actions: BaseAction[]) {
		super(conductor);
		this.actions = actions;
	}

	public getActions(): BaseAction[] {
		return this.actions;
	}

}

class RemoveAction extends BaseAction {

	public getText(): string {
		return "Remove";
	}

	public run(): void {
		let request = new OverlayRemoveRequest();
		this.conductor.submit(request);
	}

}