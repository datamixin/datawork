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
import Command from "webface/wef/Command";

import XMarkDef from "vegazoo/model/XMarkDef";

export default class MarkDefTooltipSetCommand extends Command {

    private markDef: XMarkDef = null;
    private oldTooltip: boolean = null;
    private newTooltip: boolean = null;

    public setMarkDef(markDef: XMarkDef): void {
        this.markDef = markDef;
    }

    public setTooltip(tooltip: boolean): void {
        this.newTooltip = tooltip;
    }

    public execute(): void {
        this.oldTooltip = this.markDef.isTooltip();
        this.markDef.setTooltip(this.newTooltip);
    }

    public undo(): void {
        this.markDef.setTooltip(this.oldTooltip);
    }

    public redo(): void {
        this.markDef.setTooltip(this.newTooltip);
    }

}