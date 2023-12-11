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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import * as anatomy from "padang/view/anatomy/anatomy";

export default class PointerFieldListAnatomyView extends ConductorView implements HeightAdjustablePart {

    private composite: Composite = null;

    public createControl(parent: Composite, index: number): void {
        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-pointer-field-list-anatomy-view");
        view.setGridLayout(this.composite, 1, 0, 0, 0, 2);
    }

    public adjustHeight(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustHeight();
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {
        child.createControl(this.composite, index);
        view.setGridData(child, true, anatomy.ITEM_HEIGHT);
        view.setControlData(child);
    }

    public removeView(child: ConductorView): void {
        view.dispose(child);
    }

}
