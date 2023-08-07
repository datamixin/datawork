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

import XNumberDef from "vegazoo/model/XNumberDef";

export default class NumberDefValueSetCommand extends Command {

	private numberDef: XNumberDef = null;
	private oldValue: number = null;
	private newValue: number = null;

	public setNumberDef(numberDef: XNumberDef): void {
		this.numberDef = numberDef;
	}

	public setValue(value: number): void {
		this.newValue = value;
	}

	public execute(): void {
		this.oldValue = this.numberDef.getValue();
		this.numberDef.setValue(this.newValue);
	}

	public undo(): void {
		this.numberDef.setValue(this.oldValue);
	}

	public redo(): void {
		this.numberDef.setValue(this.newValue);
	}

}