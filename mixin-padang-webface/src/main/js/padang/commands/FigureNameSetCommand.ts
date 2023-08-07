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

import XFigure from "padang/model/XFigure";

export default class FigureNameSetCommand extends Command {

    private figure: XFigure = null;
    private oldName: string = null;
    private newName: string = null;

    public setFigure(figure: XFigure): void {
        this.figure = figure;
    }

    public setName(name: string): void {
        this.newName = name;
    }

    public execute(): void {
        this.oldName = this.figure.getName();
        this.figure.setName(this.newName);
    }

    public undo(): void {
        this.figure.setName(this.oldName);
    }

    public redo(): void {
        this.figure.setName(this.newName);
    }

}