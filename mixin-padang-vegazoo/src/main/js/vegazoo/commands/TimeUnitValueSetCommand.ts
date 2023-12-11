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

import XTimeUnit from "vegazoo/model/XTimeUnit";

import { TimeUnit } from "vegazoo/constants";

export default class TimeUnitValueSetCommand extends Command {

    private timeUnit: XTimeUnit = null;
    private oldValue: TimeUnit = null;
    private newValue: TimeUnit = null;

    public setTimeUnit(timeUnit: XTimeUnit): void {
        this.timeUnit = timeUnit;
    }

    public setValue(value: TimeUnit): void {
        this.newValue = value;
    }

    public execute(): void {
        this.oldValue = this.timeUnit.getValue();
        this.timeUnit.setValue(this.newValue);
    }

    public undo(): void {
        this.timeUnit.setValue(this.oldValue);
    }

    public redo(): void {
        this.timeUnit.setValue(this.newValue);
    }

}