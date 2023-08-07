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

import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";

export default class DefaultCornerPanel extends ConductorPanel {

    private composite: Composite = null;

    public createControl(parent: Composite): void {
        this.composite = new Composite(parent);
        view.setGridLayout(this.composite);
    }

    public getControl(): Control {
        return this.composite;
    }

}