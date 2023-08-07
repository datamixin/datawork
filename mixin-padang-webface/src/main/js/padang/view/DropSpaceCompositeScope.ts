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
import Composite from "webface/widgets/Composite";

import DropSpaceScope from "padang/view/DropSpaceScope";

export default class DropSpaceCompositeScope implements DropSpaceScope {

	private composite: Composite = null;

	constructor(composite: Composite) {
		this.composite = composite;
	}

	public getComposite(): Composite {
		return this.composite;
	}

	public getBoundingRect(): DOMRect {
		let element = this.composite.getElement();
		let rect = this.createBoundingRect(element);
		return rect;
	}

	public getParentBoundingRect(): DOMRect {
		let element = this.composite.getElement();
		let parent = element.parent();
		let rect = this.createBoundingRect(parent);
		return rect;
	}

	private createBoundingRect(element: JQuery): DOMRect {
		let offset = element.offset();
		let x = offset.left;
		let y = offset.top;
		let width = element.outerWidth();
		let height = element.outerHeight();
		return new DOMRect(x, y, width, height);
	}

	public getReferenceElement(): JQuery {
		return this.composite.getElement();
	}

	public getChildLength(): number {
		let children = this.composite.getChildren();
		return children.length;
	}

	public getChildRect(index: number): DOMRect {
		let children = this.composite.getChildren();
		let child = children[index];
		let element = child.getElement();
		let rect = this.createBoundingRect(element);
		return rect;
	}

}