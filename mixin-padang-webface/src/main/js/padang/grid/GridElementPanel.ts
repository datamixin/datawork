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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridControlStyle from "padang/grid/GridControlStyle";

export abstract class GridElementPanel implements Panel, HeightAdjustablePart {

    protected onSelection = (control: Control, index: number) => { };

    public abstract createControl(parent: Composite, index?: number): void;

    public abstract getControl(): Control;

    public setOnSelection(callback: (control: Control, index: number) => void) {
        this.onSelection = callback;
    }

    public resetValues(): void {

    }

    public adjustHeight(): number {
        return GridControlStyle.ROW_HEIGHT;
    }

}

export default GridElementPanel;