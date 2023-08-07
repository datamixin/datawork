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

import XFieldDef from "vegazoo/model/XFieldDef";
import { StandardType } from "vegazoo/constants";

export default class FieldDefTypeSetCommand extends Command {

	private field: XFieldDef = null;
	private oldType: StandardType = null;
	private newType: StandardType = null;

	public setFieldDef(field: XFieldDef): void {
		this.field = field;
	}

	public setType(type: StandardType): void {
		this.newType = type;
	}

	public execute(): void {
		this.oldType = this.field.getType();
		this.field.setType(this.newType);
	}

	public undo(): void {
		this.field.setType(this.oldType);
	}

	public redo(): void {
		this.field.setType(this.newType);
	}

}