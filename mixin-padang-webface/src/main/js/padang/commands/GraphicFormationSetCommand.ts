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

import XGraphic from "padang/model/XGraphic";

export default class GraphicFormationSetCommand extends Command {

    private graphic: XGraphic = null;
    private oldFormation: string = null;
    private newFormation: string = null;

    public setGraphic(graphic: XGraphic): void {
        this.graphic = graphic;
    }

    public setFormation(formation: string): void {
        this.newFormation = formation;
    }

    public execute(): void {
        this.oldFormation = this.graphic.getFormation();
        this.graphic.setFormation(this.newFormation);
    }

    public undo(): void {
        this.graphic.setFormation(this.oldFormation);
    }

    public redo(): void {
        this.graphic.setFormation(this.newFormation);
    }

}