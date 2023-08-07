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

import Point from "webface/graphics/Point";
import Layout from "webface/widgets/Layout";
import Control from "webface/widgets/Control";
import Scrolled from "webface/widgets/Scrolled";
import Composite from "webface/widgets/Composite";
import ScrollManager from "webface/widgets/ScrollManager";
import ScrolledContent from "webface/widgets/ScrolledContent";
import ScrolledViewPort from "webface/widgets/ScrolledViewPort";

import FillLayout from "webface/layout/FillLayout";

export default class Scrollable extends Composite implements Scrolled {

	private control: Control;
	private content: CompositeScrolledContent;
	private viewPort: ScrolledViewPort;
	private scrollManager: ScrollManager;

	private expandVertical = false;
	private expandHorizontal = false;

	private minWidth: number = webface.DEFAULT;
	private minHeight: number = webface.DEFAULT;

	constructor(parent: Composite | JQuery, index?: number) {
		super(parent, index);

		// Element
		this.element.addClass("scrolled");
		this.element.addClass("scrollable");
		this.element.css("overflow", "hidden");
		this.element.css("position", "absolute");

		// Scroll manager
		this.scrollManager = new ScrollManager(this);
		this.viewPort = this.scrollManager.getViewPort();
		let viewElement = this.viewPort.getElement();
		viewElement.css("position", "absolute");

		this.content = new CompositeScrolledContent(viewElement);
		this.content.setLayout(new FillLayout());
	}

	public setContent(control: Control): void {
		this.control = control;
	}

	/**
	 * Specify the minimum width and height at which the Scrollable 
	 * will begin scrolling the content with the horizontal scroll bar.

	 * @param width
	 * @param height
	 */
	public setMinSize(width: number, height: number): void {

		if (this.minWidth === width && this.minHeight === height) {
			return;
		}
		this.minWidth = Math.max(0, width);
		this.minHeight = Math.max(0, height);
		this.relayout();
	}

	/**
	 * Specify the minimum width at which the ScrolledComposite will begin 
	 * scrolling the content with the horizontal scroll bar.
	 * 
	 * @param height
	 */
	public setMinWidth(width: number): void {
		this.setMinSize(width, this.minHeight);
	}

	/**
	 * Specify the minimum height at which the ScrolledComposite will begin 
	 * scrolling the content with the vertical scroll bar.
	 * 
	 * @param width
	 */
	public setMinHeight(height: number): void {
		this.setMinSize(this.minWidth, height);
	}

	public getMinHeight(): number {
		return this.minHeight;
	}

	public getMinWidth(): number {
		return this.minWidth;
	}

	/**
	 * When defined true it's mean content is fit (not everflow) horizontally and
	 * horizontal scroll bar doesn't to be visible.
	 * @param state
	 */
	public setExpandHorizontal(state: boolean): void {
		if (this.expandHorizontal !== state) {
			this.expandHorizontal = state;
		}
	}

	public getExpandHorizontal(): boolean {
		return this.expandHorizontal;
	}

	/**
	 * When defined true it's mean content is fit (not everflow) vertically and
	 * vertically scroll bar doesn't to be visible.
	 * @param state
	 */
	public setExpandVertical(state: boolean): void {
		if (this.expandVertical !== state) {
			this.expandVertical = state;
		}
	}

	public getExpandVertical(): boolean {
		return this.expandVertical;
	}

	public getScrolledElement(): JQuery {
		return this.element;
	}

	public getScrolledContent(): ScrolledContent {
		return this.content;
	}

	public relayout(): void {

		if (this.control === null || this.control === undefined) return;

		// Default gunakan ukuran control (Method 1)
		let size = this.control.computeSize();
		let width = size.x - 2;
		let height = size.y - 2;

		// Gunakan min size jika di berikan (Method 2)
		if (this.minWidth !== webface.DEFAULT) {
			width = this.minWidth;
		}
		if (this.minHeight !== webface.DEFAULT) {
			height = this.minHeight;
		}

		// Lihat setting expand
		let scrollableSize = this.getClientArea();
		if (this.expandHorizontal) {
			width = scrollableSize.x;
		}

		if (this.expandVertical) {
			height = scrollableSize.y;
		}

		if (width === 0 || height === 0) return;

		if (width > scrollableSize.x) {
			height -= ScrollManager.SCROLL_SPACE;
		}
		if (height > scrollableSize.y) {
			width -= ScrollManager.SCROLL_SPACE;
		}

		this.content.setSize(width, height);

		this.scrollManager.layout();
	}

	public setOrigin(point: Point): void {
		this.setOriginLeft(point.x);
		this.setOriginTop(point.y);
	}

	public setOriginLeft(left: number): void {
		this.content.setLeft(left);
		let horizontalBar = this.scrollManager.getHorizontalScrollBar();
		horizontalBar.setValue(-left);

	}

	public setOriginTop(top: number): void {
		this.content.setTop(top);
		let verticalBar = this.scrollManager.getVerticalScrollBar();
		verticalBar.setValue(-top);
	}

	public getOrigin(): Point {
		let left = this.content.getLeft();
		let top = this.content.getTop();
		return new Point(left, top);
	}

	public getOriginTop(): number {
		return this.content.getTop();
	}

	public getOriginLeft(): number {
		return this.content.getLeft();
	}

	public setLayout(layout: Layout): void {
		// Layout tidak dapat diberikan dari luar
	}

	public getLayout(): Layout {
		return this.content.getLayout();
	}

	protected addControl(control: Control, index?: number): void {
		this.content["addControl"](control, index);
	}

	protected removeControl(control: Control): void {
		this.content["removeControl"](control);
	}

	public getChildren(): Control[] {
		return this.content.getChildren();
	}

	protected indexOfControl(control: Control): number {
		return this.content["indexOfControl"](control);
	}

	public moveControl(control: Control, index: number) {
		this.content.moveControl(control, index);
	}

}

class CompositeScrolledContent extends Composite implements ScrolledContent {

	constructor(parent: JQuery) {

		let element = jQuery("<div>");
		element.addClass("composite-scrollable-content");
		element.css("position", "absolute");
		element.css("overflow", "hidden");
		parent.append(element);

		super(element);
	}

	private getNumberDefault(text: string): number {
		let value = parseInt(text);
		if (isNaN(value)) {
			return 0;
		} else {
			return value;
		}
	}

	public setLeft(left: number): void {
		this.element.css("left", left);
	}

	public getLeft(): number {
		return this.getNumberDefault(this.element.css("left"));
	}

	public setTop(top: number): void {
		this.element.css("top", top);
	}

	public getTop(): number {
		return this.getNumberDefault(this.element.css("top"));
	}

	public getWidth(): number {
		return this.element.width();
	}

	public getHeight(): number {
		return this.element.height();
	}

	public getElement(): JQuery {
		return this.element;
	}
}
