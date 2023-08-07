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

import XRoutine from "rinjani/model/XRoutine";

export default class RoutineNameSetCommand extends Command {

	private routine: XRoutine = null;
	private oldName: string = null;
	private newName: string = null;

	public setRoutine(routine: XRoutine): void {
		this.routine = routine;
	}

	public setName(name: string): void {
		this.newName = name;
	}

	public execute(): void {
		this.oldName = this.routine.getName();
		this.routine.setName(this.newName);
	}

	public undo(): void {
		this.routine.setName(this.oldName);
	}

	public redo(): void {
		this.routine.setName(this.newName);
	}

}