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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

export abstract class ValidationCustomView extends ConductorView {

	private composite: Composite = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("malang-validation-custom-view");

		view.setGridLayout(this.composite, 1, 10, 10, 0, 5);

	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		return part.adjustHeight();
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, true);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}

export default ValidationCustomView;