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
import * as webface from "webface/webface";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import ScrollBar from "webface/widgets/ScrollBar";
import ScrollListener from "webface/widgets/ScrollListener";

import * as functions from "webface/util/functions";

import vegaEmbed from "vega-embed";
import { EmbedOptions } from "vega-embed";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";
import VegaliteEvent from "vegazoo/widgets/VegaliteEvent";

export default class VegaliteChart extends Control {

	private static SPACE = 14;
	private static SVG = "svg";
	private static SCROLL_COLOR = "#FFFFFF";
	private static HANDLE_BORDER_COLOR = "#FFFFFF";
	private static HANDLE_BACKGROUND_COLOR = "#888";

	private oneStep = 100;
	private leftPos = 0;
	private topPos = 0;
	private minLeft = 0;
	private minTop = 0;
	private spec: any = null;
	private viewport: JQuery = null;
	private xScroll: ScrollBar;
	private yScroll: ScrollBar;
	private onRender = (_root: VegaliteNode) => { };
	private onClick = (_event: VegaliteEvent) => { };

	constructor(parent: Composite, index?: number) {
		super(jQuery("<div>"), parent, index);
		this.element.addClass("vegazoo-vegalite-chart");
		this.createViewport(this.element);
		this.installXScroll(this.element);
		this.installYScroll(this.element);
		functions.bindMouseWheel(this.element, (_deltaX: number, deltaY: number): number => {
			let newTop = this.topPos + deltaY * this.oneStep;
			this.scrollToTop(newTop);
			return 0;
		});
	}

	private notifyClick(source: any): void {
		let event = new VegaliteEvent();
		event.type = webface.MouseClick;
		event.widget = this;
		event.item = source.target;
		event.data = {
			x: source.clientX - this.leftPos,
			y: source.clientY - this.topPos
		}
		this.onClick(event);
	}

	private createViewport(parent: JQuery): void {
		this.viewport = jQuery("<div>");
		this.viewport.addClass("vegazoo-vegalite-viewport");
		this.viewport.on("click", (eventObject: JQueryEventObject) => {
			this.notifyClick(eventObject);
		});
		parent.append(this.viewport);
	}

	private installXScroll(container: JQuery): void {
		this.xScroll = new ScrollBar(container, false, this.oneStep, <ScrollListener>{
			moved: (value: number, _stop: boolean) => {
				this.scrollToLeft(-value);
			}
		});
		this.css(this.xScroll, "horizontal", "left", "top");
	}

	private installYScroll(container: JQuery): void {
		this.yScroll = new ScrollBar(container, true, this.oneStep, <ScrollListener>{
			moved: (value: number, _stop: boolean) => {
				this.scrollToTop(-value);
			}
		});
		this.css(this.yScroll, "vertical", "top", "left");
	}

	private css(scroll: ScrollBar, type: string, orient: string, border: string): void {

		let element = scroll.getElement();
		element.addClass("vegazoo-vegalite-scroller-" + type);
		element.css("background-color", VegaliteChart.SCROLL_COLOR);
		element.css("border-" + border, "1px solid #E8E8E8");
		element.css(orient, 0);

		let handler = scroll.getHandlerElement();
		handler.css("background-color", VegaliteChart.HANDLE_BACKGROUND_COLOR);
		handler.css("border", "3px solid " + VegaliteChart.HANDLE_BORDER_COLOR);
		handler.css("border-radius", (VegaliteChart.SPACE / 2) + "px");

	}

	public scrollToLeft(left: number): void {
		if (left === this.leftPos) {
			return;
		}
		if (this.xScroll.isVisible()) {
			if (left < this.minLeft) {
				left = this.minLeft;
			} else if (left > 0) {
				left = 0;
			}
			this.xScroll.setValue(-left);
			this.viewport.css("left", left + "px");
			this.leftPos = left;
		}
	}

	public scrollToTop(top: number): void {
		if (top === this.topPos) {
			return;
		}
		if (this.yScroll.isVisible()) {
			if (top < this.minTop) {
				top = this.minTop;
			} else if (top > 0) {
				top = 0;
			}
			this.yScroll.setValue(-top);
			this.viewport.css("top", top + "px");
			this.topPos = top;
		}
	}

	public setSpec(spec: any): void {
		this.spec = spec;
	}

	public render(): void {

		if (this.spec === null) {
			return;
		}

		this.embed(() => {

			let children = this.element.children();
			let element = children[0];

			// X scroll
			let requiredWidth = element.clientWidth;
			let availableWidth = this.element.width();
			let xVisible = requiredWidth > availableWidth;
			if (xVisible) {
				this.minLeft = availableWidth - requiredWidth;
			} else {
				this.viewport.css("left", 0);
				this.xScroll.setValue(0);
				this.leftPos = 0;
			}
			this.xScroll.setRequired(requiredWidth);
			this.xScroll.setAvailable(availableWidth);
			this.xScroll.setVisible(xVisible);
			this.xScroll.prepare(requiredWidth, availableWidth, availableWidth, VegaliteChart.SPACE);

			// Y scroll
			let requiredHeight = element.clientHeight - VegaliteChart.SPACE;
			let availableHeight = this.element.height();
			let yVisible = requiredHeight > availableHeight;
			if (yVisible) {
				this.minTop = availableHeight - requiredHeight;
			} else {
				this.viewport.css("top", 0);
				this.yScroll.setValue(0);
				this.topPos = 0;
			}
			this.yScroll.setRequired(requiredHeight);
			this.yScroll.setAvailable(availableHeight);
			this.yScroll.setVisible(yVisible);
			this.yScroll.prepare(requiredHeight, availableHeight, VegaliteChart.SPACE, availableHeight);

			let root = this.createTree();
			this.onRender(root);

		});
	}

	private createTree(): VegaliteNode {

		// Root
		let frames = $(".mark-group.role-frame");
		let root: VegaliteNode = null;
		for (let i = 0; i < frames.length; i++) {
			let frame = frames[i];
			if ($(frame).parentsUntil(this.viewport).length === 2) {
				root = new VegaliteNode(this.viewport, frame);
				break;
			}
		}

		// Descendants
		let scopes = $(".mark-group.role-scope");
		let nodes: VegaliteNode[] = [root];
		for (let i = 0; i < scopes.length; i++) {
			let scope = scopes[i];
			let child = new VegaliteNode(this.viewport, scope);
			for (let n = 0; n < nodes.length; n++) {
				let node = nodes[n];
				let element = node.getElement();
				if ($(scope).parentsUntil(element).length === 2) {
					node.addChild(child);
					break;
				}
			}
			nodes.push(child);
		}
		return root;
	}

	private embed(callback: (result: any) => void): void {
		let chart = <HTMLElement>this.viewport[0];
		let options: EmbedOptions = {
			actions: false,
			mode: "vega-lite",
			renderer: <any>VegaliteChart.SVG,
		};
		vegaEmbed(chart, this.spec, options).then(callback);
	}

	public setSize(width: number, height: number): void {
		super.setSize(width, height);
		if (this.width > 0 && this.height > 0) {
			this.render();
		}
	}

	public setOnRender(callback: (root: VegaliteNode) => void): void {
		this.onRender = callback;
	}

	public setOnClick(callback: (event: VegaliteEvent) => void): void {
		this.onClick = callback;
	}

}
