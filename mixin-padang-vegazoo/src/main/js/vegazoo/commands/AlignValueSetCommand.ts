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

import XAlign from "vegazoo/model/XAlign";

export default class AlignValueSetCommand extends Command {

	private align: XAlign = null;
	private oldValue: string = null;
	private newValue: string = null;

	public setAlign(align: XAlign): void {
		this.align = align;
	}

	public setValue(value: string): void {
		this.newValue = value;
	}

	public execute(): void {
		this.oldValue = this.align.getValue();
		this.align.setValue(this.newValue);
	}

	public undo(): void {
		this.align.setValue(this.oldValue);
	}

	public redo(): void {
		this.align.setValue(this.newValue);
	}

}