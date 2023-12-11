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

import XVariable from "padang/model/XVariable";
import XPreparation from "padang/model/XPreparation";

export default class VariablePreparationSetCommand extends Command {

	private variable: XVariable = null;
	private oldPreparation: XPreparation = null;
	private newPreparation: XPreparation = null;

	public setVariable(variable: XVariable): void {
		this.variable = variable;
	}

	public setPreparation(preparation: XPreparation): void {
		this.newPreparation = preparation;
	}

	public execute(): void {
		this.oldPreparation = this.variable.getPreparation();
		this.variable.setPreparation(this.newPreparation);
	}

	public undo(): void {
		this.variable.setPreparation(this.oldPreparation);
	}

	public redo(): void {
		this.variable.setPreparation(this.newPreparation);
	}

}