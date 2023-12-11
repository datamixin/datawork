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

import XAxis from "vegazoo/model/XAxis";

export default class AxisLabelAngleSetCommand extends Command {

    private axis: XAxis = null;
    private oldLabelAngle: number = null;
    private newLabelAngle: number = null;

    public setAxis(axis: XAxis): void {
        this.axis = axis;
    }

    public setLabelAngle(labelAngle: number): void {
        this.newLabelAngle = labelAngle;
    }

    public execute(): void {
        this.oldLabelAngle = this.axis.getLabelAngle();
        this.axis.setLabelAngle(this.newLabelAngle);
    }

    public undo(): void {
        this.axis.setLabelAngle(this.oldLabelAngle);
    }

    public redo(): void {
        this.axis.setLabelAngle(this.newLabelAngle);
    }

}