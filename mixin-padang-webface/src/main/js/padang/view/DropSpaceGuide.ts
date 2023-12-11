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

import * as util from "webface/util";
import * as functions from "webface/functions";

import DropTarget from "webface/dnd/DropTarget";

import Composite from "webface/widgets/Composite";

import MessageDialog from "webface/dialogs/MessageDialog";

import DropSpacePart from "padang/view/DropSpacePart";
import DropSpaceScope from "padang/view/DropSpaceScope";
import DropSpaceCompositeScope from "padang/view/DropSpaceCompositeScope";

export abstract class DropSpaceGuide {

	protected scope: DropSpaceScope = null;
	protected part: DropSpacePart = null;
	protected dropSpace: JQuery;
	protected borderWidth = 2;
	protected deltaX = 0;
	protected deltaY = 0;

	private acceptBorderColor = "#41CC49";

	constructor(scope: DropSpaceScope | Composite, part: DropSpacePart) {
		if (scope instanceof Composite) {
			this.scope = new DropSpaceCompositeScope(scope);
		} else {
			this.scope = <DropSpaceScope>scope;
		}
		this.part = part;
	}

	public setAcceptBorderColor(color: string): void {
		this.acceptBorderColor = color;
	}

	public setBorderWitdh(borderWidth: number): void {
		this.borderWidth = borderWidth;
	}

	public setDeltaXY(x: number, y: number): void {
		this.deltaX = x;
		this.deltaY = y;
	}

	public dragStart(accept: boolean): void {

		let rect = this.scope.getBoundingRect();
		let parent = this.scope.getParentBoundingRect();

		// Buat drop space sebesar control
		this.dropSpace = jQuery("<div>");
		this.dropSpace.width(rect.width);
		this.dropSpace.height(rect.height);

		// Atur posisi drop space
		this.dropSpace.css("position", "absolute");
		this.dropSpace.css("left", rect.left - parent.left + this.deltaX);
		this.dropSpace.css("top", rect.top - parent.top + this.deltaY);
		if (accept === true) {
			this.dropSpace.css("border", this.borderWidth + "px solid " + this.acceptBorderColor);
		} else {
			this.dropSpace.css("border", this.borderWidth + "px solid #CC4149");
		}

		let element = this.scope.getReferenceElement();
		this.dropSpace.insertAfter(element);

		if (accept === true) {

			let target = new DropTarget();
			target.drop((_event: any, ui: any) => {

				if (this.isFeedbackVisible() === true) {
					let draggable = $(ui.draggable);
					let data = util.getJQueryDataAsMap(draggable);
					this.part.verifyAccept(data, (message: string) => {
						if (message === null) {
							this.part.dropObject(data);
						} else {
							MessageDialog.openError("Drop Target Error", message);
						}
					});
				}
			});

			target.applyTo(this.dropSpace);
		}
	}

	public isInRange(x: number, y: number): boolean {
		return functions.isInRange(this.dropSpace, x, y);
	}

	public abstract showFeedback(data: Map<any>, x: number, y: number): void;

	public abstract isFeedbackVisible(): boolean;

	public abstract clearFeedback(data: Map<any>): void;

	public dragStop(): void {
		this.dropSpace.remove();
		this.dropSpace = null;
	}

}

export default DropSpaceGuide;