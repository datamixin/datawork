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

import XScale from "vegazoo/model/XScale";

export default class ScaleZeroSetCommand extends Command {

    private scale: XScale = null;
    private oldZero: boolean = null;
    private newZero: boolean = null;

    public setScale(scale: XScale): void {
        this.scale = scale;
    }

    public setZero(zero: boolean): void {
        this.newZero = zero;
    }

    public execute(): void {
        this.oldZero = this.scale.isZero();
        this.scale.setZero(this.newZero);
    }

    public undo(): void {
        this.scale.setZero(this.oldZero);
    }

    public redo(): void {
        this.scale.setZero(this.newZero);
    }

}