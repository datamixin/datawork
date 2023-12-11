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
import Map from "webface/util/Map";

import Composite from "webface/widgets/Composite";

import * as padang from "padang/padang";

import DropSpacePart from "padang/view/DropSpacePart";
import DropSpaceGuide from "padang/view/DropSpaceGuide";
import DropSpaceScope from "padang/view/DropSpaceScope";
import InsertDropSpaceFeedback from "padang/view/InsertDropSpaceFeedback";

export default class InsertDropSpaceGuide extends DropSpaceGuide {

	protected horizontal: boolean = true;
	protected feedbackWidth: number = 5;

	private feedback: InsertDropSpaceFeedback = null;

	constructor(scope: DropSpaceScope | Composite, part: DropSpacePart, feedbackWidth?: number) {
		super(scope, part);
		this.feedbackWidth = feedbackWidth === undefined ? 5 : feedbackWidth;
	}

	public setHorizontal(horizontal: boolean): void {
		this.horizontal = horizontal;
	}

	protected getInsertIndexPos(x: number, y: number, callback: (index: number, pos: number) => void): void {

		let index = 0;
		let prevMax = 0;
		let nextMin = 0;
		let nextMax = 0;
		let childWidth = 0;
		let childHeight = 0;
		let parent = this.scope.getParentBoundingRect();
		let length = this.scope.getChildLength();
		for (index = 0; index <= length; index++) {

			let left = 0;
			let top = 0;

			if (length === 0) {

				left = parent.left;
				top = parent.top;

				childWidth = 0;
				childHeight = 0;

			} else if (index < length) {

				let current = this.scope.getChildRect(index);
				left = current.left - parent.left;
				top = current.top - parent.top;

				childWidth = current.width;
				childHeight = current.height;

			} else {

				let current = this.scope.getChildRect(length - 1);
				left = current.left - parent.left + current.width;
				top = current.top - parent.top + current.height;

				childWidth = 0;
				childHeight = 0;
			}

			let next = prevMax;
			if (this.horizontal === true) {
				next = left + childWidth / 2;
				let inX = x - parent.left;
				nextMax = left;
				if (inX >= prevMax && inX < next) {
					break;
				}
				nextMin = left + childWidth;
			} else {
				next = top + childHeight / 2;
				let inY = y - parent.top;
				nextMax = top;
				if (inY >= prevMax && inY < next) {
					break;
				}
				nextMin = top + childHeight;
			}

			prevMax = next;
		}

		// Posisikan feedback
		let pos = (nextMin + nextMax) / 2;
		if (index >= length) {
			index = length;
			pos += this.feedbackWidth / 2;
		}
		callback(index, pos);

	}

	public showFeedback(data: Map<any>, x: number, y: number): void {

		this.getInsertIndexPos(x, y, (index: number, pos: number) => {

			this.createFeedback();

			let parentRect = this.scope.getParentBoundingRect();
			let parentWidth = parentRect.width;
			let parentHeight = parentRect.height;

			// Posisikan feedback
			pos = pos - this.feedbackWidth / 2;
			pos = Math.max(0, pos);
			if (this.horizontal === true) {

				pos = Math.min(pos, parentWidth - this.feedbackWidth);
				this.feedback.setLeft(pos);

			} else {

				pos = Math.min(pos, parentHeight - this.feedbackWidth);
				this.feedback.setTop(pos);

			}

			data.put(padang.TARGET_POSITION, index);

		});
	}

	public isFeedbackVisible(): boolean {
		return this.feedback !== null;
	}

	public clearFeedback(_data: Map<any>): void {
		this.feedback.remove();
		this.feedback = null;
	}

	private createFeedback(): void {
		if (this.feedback === null) {
			this.feedback = new InsertDropSpaceFeedback(this.dropSpace, this.horizontal, this.feedbackWidth);;
		}
	}

}