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
import Point from "webface/graphics/Point";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Composite from "webface/widgets/Composite";

/**
 * Menghitung height yang dibutuhkan oleh sebuah composite yang menggunakan GridLayout dan
 * 1. GridLayout hanya memiliki 1 column
 * 1. Setiap anakan harus memiliki data dan implements HeightAdjustablePart atau SizeAdjustablePart
 */
export default class GridCompositeAdjuster {

	private composite: Composite = null;

	constructor(composite: Composite) {
		this.composite = composite;
	}

	public adjustHeight(): number {

		let height = 0;
		let layout = <GridLayout>this.composite.getLayout();
		height += 2 * layout.marginHeight;

		let children = this.composite.getChildren();
		for (var i = 0; i < children.length; i++) {

			// Kontribusi height anakan
			let child = children[i];
			let view = child.getData();
			let viewHeight = 0;
			if (view.adjustHeight) {

				// Child implements HeightAdjustablePart
				viewHeight = <number>view.adjustHeight();

			} else if (view.adjustSize) {

				// Child implements SizeAdjustablePart
				let size = <Point>view.adjustSize();
				viewHeight = size.y;

			}
			let control = view.getControl();
			let layoutData = <GridData>control.getLayoutData();
			layoutData.heightHint = viewHeight;
			height += viewHeight;

			// Kontribusi vertical spacing
			if (i > 0) {
				height += layout.verticalSpacing;
			}

		}

		this.composite.relayout();

		return height;
	}


	public adjustWidth(): number {

		let layout = <GridLayout>this.composite.markLayout();

		let width = 0;
		width += 2 * layout.marginWidth;

		let children = this.composite.getChildren();
		for (var i = 0; i < children.length; i++) {

			// Kontribusi width anakan
			let child = children[i];
			let view = child.getData();
			let viewWidth = 0;
			if (view.adjustWidth) {

				// Child implements WidthAdjustablePart
				viewWidth = <number>view.adjustWidth();

			} else if (view.adjustSize) {

				// Child implements SizeAdjustablePart
				let size = <Point>view.adjustSize();
				viewWidth = size.x;

			}
			let control = view.getControl();
			let layoutData = <GridData>control.getLayoutData();
			layoutData.widthHint = viewWidth;
			width += viewWidth;

			// Kontribusi horizontal spacing
			if (i > 0) {
				width += layout.horizontalSpacing;
			}

		}

		this.composite.relayout();

		return width;
	}

}