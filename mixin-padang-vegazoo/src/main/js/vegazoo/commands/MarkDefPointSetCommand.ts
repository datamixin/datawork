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
import Command from "webface/wef/Command";

import XMarkDef from "vegazoo/model/XMarkDef";

export default class MarkDefPointSetCommand extends Command {

    private markDef: XMarkDef = null;
    private oldPoint: boolean = null;
    private newPoint: boolean = null;

    public setMarkDef(markDef: XMarkDef): void {
        this.markDef = markDef;
    }

    public setPoint(point: boolean): void {
        this.newPoint = point;
    }

    public execute(): void {
        this.oldPoint = this.markDef.isPoint();
        this.markDef.setPoint(this.newPoint);
    }

    public undo(): void {
        this.markDef.setPoint(this.oldPoint);
    }

    public redo(): void {
        this.markDef.setPoint(this.newPoint);
    }

}