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
export type Progress = (x: number, y: number) => void;

export default class PointerPosition {

	public static CLICKED = "clicked";

	private static instance: PointerPosition = null;
	private pointer: JQuery = null;

	constructor() {
		if (PointerPosition.instance) {
			throw new Error("Error: Instantiation failed: Use PointerPosition.getInstance() instead of new");
		}
		PointerPosition.instance = this;
		this.pointer = $(".bekasi-pointer");
	}

	public static getInstance(): PointerPosition {
		if (PointerPosition.instance === null) {
			PointerPosition.instance = new PointerPosition();
		}
		return PointerPosition.instance;
	}

	public show(): void {
		this.pointer.show();
	}

	public hide(): void {
		this.pointer.hide();
	}

	private getPointerRect(): DOMRect {
		let pointer = this.pointer[0];
		return pointer.getBoundingClientRect();
	}

	public moveTo(x: number, y: number, delay: number, callback: () => void): void {
		let targetRect = new DOMRect(x, y);
		let pointerRect = this.getPointerRect();
		this.doMoveTo(pointerRect, targetRect, delay, 1, 10, callback);
	}

	public centerTo(element: JQuery, delay: number, callback: () => void, progress?: Progress): void {
		let target = element[0];
		if (element.css("display") === "none") {
			callback();
		} else {
			let targetRect = target.getBoundingClientRect();
			let pointerRect = this.getPointerRect();
			this.doMoveTo(pointerRect, targetRect, delay, 1, 10, callback, progress);
		}
	}

	private doMoveTo(pointer: DOMRect, target: DOMRect, delay: number,
		current: number, steps: number, callback: () => void, progress?: Progress): void {
		setTimeout(() => {
			let pointerX = pointer.left + pointer.width / 2;
			let pointerY = pointer.top + pointer.height / 2;
			let targetX = target.left + target.width / 2;
			let targetY = target.top + target.height / 2;
			let factor = 1 - (current / steps);
			let left = targetX + ((pointerX - targetX) * factor);
			let top = targetY + ((pointerY - targetY) * factor);
			this.setOffset(left, top);
			if (progress !== undefined) {
				progress(left, top);
			}
			if (current < steps) {
				this.doMoveTo(pointer, target, delay, current + 1, steps, callback);
			} else {
				callback();
			}
		}, (delay / steps));
	}

	public setOffset(left: number, top: number): void {
		this.pointer.css("left", left);
		this.pointer.css("top", top);
	}

	public centerToCallback(element: JQuery, delay: number,
		callback: () => void, progress?: Progress): void {
		this.centerTo(element, delay / 2, () => {
			setTimeout(() => {
				let event = new MouseEvent("mouseenter", {
					bubbles: true,
					cancelable: true,
					view: window
				});
				element[0].dispatchEvent(event);
				callback();
			}, delay / 2);
		}, progress);
	}

	public clicked(callback: () => void): void {
		this.pointer.addClass(PointerPosition.CLICKED);
		setTimeout(() => {
			this.pointer.removeClass(PointerPosition.CLICKED);
			callback();
		}, 200);
	}

	public dragged(): void {
		this.pointer.addClass(PointerPosition.CLICKED);
	}

	public dropped(): void {
		this.pointer.removeClass(PointerPosition.CLICKED);
	}

}