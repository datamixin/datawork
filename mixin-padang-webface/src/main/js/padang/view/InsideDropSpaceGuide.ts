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

import * as padang from "padang/padang";

import ReplaceDropSpaceGuide from "padang/view/ReplaceDropSpaceGuide";
import InsertDropSpaceFeedback from "padang/view/InsertDropSpaceFeedback";

export abstract class InsideDropSpaceGuide extends ReplaceDropSpaceGuide {

	private feedback: InsertDropSpaceFeedback = null;
	private feedbackWidth = 5;

	protected abstract isUnderHorizontal(): boolean;

	public isInRange(x: number, y: number): boolean {
		let rect = this.scope.getBoundingRect();
		let left = rect.left;
		let top = rect.top;
		let width = rect.width;
		let height = rect.height;
		let right = left + width;
		let bottom = top + height;
		if (this.isUnderHorizontal()) {
			let cut = width / 5;
			return (x > left + cut && x < right - cut) && (y > top && y < bottom);
		} else {
			let cut = height / 5;
			return (x > left && x < right) && (y > top + cut && y < bottom - cut);
		}
	}

	public showFeedback(data: Map<any>, x: number, y: number): void {

		this.createFeedback();

		let rect = this.scope.getBoundingRect();
		let left = rect.left;
		let top = rect.top;
		let width = rect.width;
		let height = rect.height;
		let parent = this.scope.getParentBoundingRect();
		if (this.isUnderHorizontal()) {
			if (y < top + height / 2) {
				this.feedback.setTop(top - parent.top);
				data.put(padang.NEW_POSITION, 0);
			} else {
				this.feedback.setTop(top - parent.top + height - this.feedbackWidth);
				data.put(padang.NEW_POSITION, 1);
			}
		} else {
			if (x < left + (width / 2)) {
				this.feedback.setLeft(left - parent.left);
				data.put(padang.NEW_POSITION, 0);
			} else {
				this.feedback.setLeft(left - parent.left + width - this.feedbackWidth);
				data.put(padang.NEW_POSITION, 1);
			}
		}
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
			let horizontal = this.isUnderHorizontal();
			this.feedback = new InsertDropSpaceFeedback(this.dropSpace, !horizontal, this.feedbackWidth);
		}
	}
}

export default InsideDropSpaceGuide;