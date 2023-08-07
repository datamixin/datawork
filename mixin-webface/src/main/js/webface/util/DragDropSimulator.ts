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
export let SIMULATE = "simulate";

type Point = {
	x: number,
	y: number
}

export type Progress = (dx: number, dy: number) => void;

export default class DragDropSimulator {

	private sourceHandle: Element = null;
	private targetHandle: Element = null;

	private deltaPixel = 5;
	private progress: Progress = () => { }

	constructor(sourceHandle: Element, targetHandle: Element, progress?: Progress) {

		this.sourceHandle = sourceHandle;
		this.targetHandle = targetHandle;

		this.progress = progress === undefined ? this.progress : progress;
	}

	public setDeltaPixel(pixel: number): void {
		this.deltaPixel = pixel;
	}

	public move(complete: () => void) {

		let sourcePoint = this.getMiddlePointHandle(this.sourceHandle);
		let targetPoint = this.getMiddlePointHandle(this.targetHandle);

		this.draggingXY(sourcePoint, targetPoint, complete);

	}

	private draggingXY(source: Point, target: Point, callback: () => void): void {

		let distanceX = Math.abs(target.x - source.x);
		let distanceY = Math.abs(target.y - source.y);

		let direction: Point = {
			x: target.x >= source.x ? 1 : -1,
			y: target.y >= source.y ? 1 : -1
		}

		let distance: Point = {
			x: distanceX,
			y: distanceY
		}

		this.doDragSource(distance, direction, callback);
	}

	private doDragSource(distance: Point, direction: Point, callback: () => void): void {

		if (distance.x > 0 || distance.x > 0) {

			let moveX = this.deltaPixel;
			if (distance.x < moveX) {
				moveX = distance.x;
			}

			let moveY = this.deltaPixel;
			if (distance.y < moveY) {
				moveY = distance.y;
			}

			this.dragSource(direction.x * moveX, direction.y * moveY);
			distance.x -= moveX;
			distance.y -= moveY;

			setTimeout(() => {
				this.doDragSource(distance, direction, callback);
			}, 50);

		} else {
			this.dropStop();
			callback();
		}

	}

	private getMiddlePointHandle(elementHandle: Element): Point {
		let targetRect = elementHandle.getBoundingClientRect();
		let targetX = targetRect.left + (targetRect.width / 2);
		let targetY = targetRect.top + (targetRect.height / 2);
		let pos: Point = {
			x: targetX,
			y: targetY
		}
		return pos;
	}

	private dropStop() {
		$(this.sourceHandle)[SIMULATE]("drop");
	}

	private dragSource(dx: number, dy: number) {
		this.progress(dx, dy);
		$(this.sourceHandle)[SIMULATE]("drag", { dx: dx, dy: dy });
	}

}