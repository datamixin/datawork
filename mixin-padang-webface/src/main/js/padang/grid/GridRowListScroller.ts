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
import ScrollBar from "webface/widgets/ScrollBar";
import ScrollListener from "webface/widgets/ScrollListener";

import * as functions from "webface/util/functions";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridContentScroller from "padang/grid/GridContentScroller";

export default class GridRowListScroller implements GridContentScroller {

	private static SPACE = 14;
	private static SCROLL_COLOR = "#FFFFFF";
	private static HANDLE_BORDER_COLOR = "#FFFFFF";
	private static HANDLE_BACKGROUND_COLOR = "#888";

	private oneStep = 100;
	private style: GridControlStyle = null;
	private container: JQuery = null
	private position: GridScrollPosition = null;
	private xScroll: ScrollBar;
	private yScroll: ScrollBar;

	constructor(style: GridControlStyle, position: GridScrollPosition) {
		this.style = style;
		this.oneStep = style.rowHeight;
		this.position = position;
	}

	public installOn(container: JQuery): void {

		this.container = container;
		this.installXScroll(container);
		this.installYScroll(container);

		functions.bindMouseWheel(container, (_deltaX: number, deltaY: number): number => {
			let oldTop = this.position.getTop();
			let newTop = oldTop + deltaY * this.oneStep;
			this.scrollToTop(newTop);
			return 0;
		});
	}

	public scrollToLeft(left: number): void {
		if (left === this.position.getLeft()) {
			return;
		}
		let minLeft = this.position.getMinLeft();
		if (minLeft < 0) {
			if (left < minLeft) {
				left = minLeft;
			} else if (left > 0) {
				left = 0;
			}
			this.setLeftOrigin(left, true);
		}
	}

	public scrollToTop(top: number): void {
		if (top === this.position.getTop()) {
			return;
		}
		let minTop = this.position.getMinTop();
		if (minTop < 0) {
			if (top < minTop) {
				top = minTop;
			} else if (top > 0) {
				top = 0;
			}
			this.setTopOrigin(top, true);
		}
	}

	private installXScroll(container: JQuery): void {
		this.xScroll = new ScrollBar(container, false, this.oneStep, <ScrollListener>{
			moved: (value: number, _stop: boolean) => {
				this.scrollToLeft(-value);
			}
		});
		this.css(this.xScroll, "horizontal");
	}

	private installYScroll(container: JQuery): void {
		this.yScroll = new ScrollBar(container, true, this.oneStep, <ScrollListener>{
			moved: (value: number, _stop: boolean) => {
				this.scrollToTop(-value);
			}
		});
		this.css(this.yScroll, "vertical");
	}

	private css(scroll: ScrollBar, type: string): void {

		let element = scroll.getElement();
		element.addClass("padang-grid-row-list-scroller-" + type);
		element.css("background-color", GridRowListScroller.SCROLL_COLOR);
		element.css("z-index", "2");

		let handler = scroll.getHandlerElement();
		handler.css("background-color", GridRowListScroller.HANDLE_BACKGROUND_COLOR);
		handler.css("border", "3px solid " + GridRowListScroller.HANDLE_BORDER_COLOR);
		handler.css("border-radius", (GridRowListScroller.SPACE / 2) + "px");
	}

	public refreshSize(): void {

		let availableWidth = this.getAvailableWidth();
		let availableHeight = this.getAvailableHeight();

		let requiredWidth = this.getRequiredWidth();
		let requiredHeight = this.getRequiredHeight();

		this.xScroll.setVisible(requiredWidth > availableWidth);
		this.yScroll.setVisible(requiredHeight > availableHeight);

		this.position.setUsableWidth(availableWidth);
		this.position.setUsableHeight(availableHeight);

		let previousWidth = this.xScroll.getAvailable();
		this.xScroll.prepare(requiredWidth, availableWidth, availableWidth, GridRowListScroller.SPACE);
		if (requiredWidth < availableWidth || previousWidth < availableWidth) {
			this.scrollHorizontalEnd();
		}

		let previousHeight = this.yScroll.getAvailable();
		this.yScroll.prepare(requiredHeight, availableHeight, GridRowListScroller.SPACE, availableHeight);
		if (requiredHeight < availableHeight || previousHeight < availableHeight) {
			this.scrollVerticalEnd();
		}

	}

	public getAvailableWidth(): number {
		return this.container.width();
	}

	public getRequiredWidth(): number {
		let requiredWidth = this.position.getRequiredWidth();
		requiredWidth += this.position.getRequiredWidthExtra();
		return requiredWidth;
	}

	public getExtraWidth(): number {
		return this.position.getRequiredWidthExtra();
	}

	public getAvailableHeight(): number {
		return this.container.height();
	}

	public getRequiredHeight(): number {
		let requiredHeight = this.position.getRequiredHeight();
		requiredHeight += this.position.getRequiredHeightExtra();
		return requiredHeight;
	}

	public getExtraHeight(): number {
		return this.position.getRequiredHeightExtra();
	}

	public scrollHorizontalEnd(): void {
		let availableWidth = this.getAvailableWidth();
		let requiredWidth = this.getRequiredWidth();
		let leftPosition = this.position.getLeft();
		let newLeft = availableWidth - requiredWidth;
		if (this.position.getRequiredWidth() > 0) {
			if (requiredWidth <= availableWidth) {
				this.position.setLeft(0, true);
			} else if (leftPosition < newLeft) {
				this.scrollToLeft(newLeft);
			}
		}
	}

	public scrollVerticalEnd(): void {
		let availableHeight = this.getAvailableHeight();
		let requiredHeight = this.getRequiredHeight();
		let topPosition = this.position.getTop();
		let newTop = availableHeight - requiredHeight;
		if (this.position.getRequiredHeight() > 0) {
			if (requiredHeight <= availableHeight) {
				this.position.setTop(0, true);
			} else {
				if (topPosition < newTop) {
					this.scrollToTop(newTop);
				}
			}
		}
	}

	public setLeftOrigin(left: number, notify: boolean): void {
		this.xScroll.setValue(-left);
		this.position.setLeft(left, notify);
	}

	public setTopOrigin(top: number, notify: boolean): void {
		this.yScroll.setValue(-top);
		let drift = top % this.style.rowHeight;
		let newTop = top - drift - (drift === 0 ? 0 : this.style.rowHeight);
		this.position.setTop(newTop, notify);
	}

}