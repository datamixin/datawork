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
export default class OverlayResizeStrip {

	private container: JQuery = null;
	private border: string = "transparent";
	private padding: number = 1;
	private resizeHandlers: JQuery[] = [];
	private widthCallback = (_deltaX: number) => { };
	private heightCallback = (_deltaY: number) => { };

	constructor(padding: number, border?: string) {
		this.padding = padding;
		this.border = border ? border : this.border;
	}

	public setContainer(container: JQuery): void {
		this.container = container;
	}

	public reset() {
		for (let element of this.resizeHandlers) {
			element.remove();
		}
		this.resizeHandlers.splice(0, this.resizeHandlers.length);
	}

	public createHandlers(rect: DOMRect): void {
		this.createResizeHandler(rect, true);
		this.createResizeHandler(rect, false);
	}

	private createResizeHandler(rect: DOMRect, horizontal: boolean): void {
		let space = 4;
		let double = this.padding * 2;
		let resizeHandler = jQuery("<div>");
		resizeHandler.addClass("vegazoo-overlay-resize-handler");
		resizeHandler.css("position", "absolute");
		let dragOrientation = "x";
		if (horizontal === true) {
			resizeHandler.css("left", rect.right + this.padding - 1);
			resizeHandler.css("top", rect.top - this.padding);
			resizeHandler.css("cursor", "ew-resize");
			resizeHandler.css("border-right", "1px solid " + this.border);
			resizeHandler.width(space);
			resizeHandler.height(rect.height + double + space - 2);
		} else {
			resizeHandler.css("top", rect.bottom + this.padding - 1);
			resizeHandler.css("left", rect.left - this.padding);
			resizeHandler.css("cursor", "ns-resize");
			resizeHandler.css("border-bottom", "1px solid " + this.border);
			resizeHandler.width(rect.width + double + space - 1);
			resizeHandler.height(space);
			dragOrientation = "y";
		}
		this.container.append(resizeHandler);

		resizeHandler.draggable({

			axis: dragOrientation,

			start: () => {
				resizeHandler.css("background", "rgba(127, 128, 128, 0.5)");
			},

			stop: () => {

				let container = this.container[0].getBoundingClientRect();
				let offset = resizeHandler.offset();
				if (horizontal === true) {

					let deltaX = offset.left - rect.right - container.left - space;
					this.widthCallback(deltaX);

				} else {

					let deltaY = offset.top - rect.bottom - container.top - space;
					this.heightCallback(deltaY);

				}

				resizeHandler.css("background", "rgba(127, 128, 128, 0)");
			}

		});
		this.resizeHandlers.push(resizeHandler);
	}

	public setWidthCallback(callback: (deltaX: number) => void): void {
		this.widthCallback = callback;
	}

	public setHeightCallback(callback: (deltaY: number) => void): void {
		this.heightCallback = callback;
	}

}