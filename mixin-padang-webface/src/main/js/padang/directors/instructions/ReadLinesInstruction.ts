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
import XObject from "sleman/model/XObject";

import ReadLines from "padang/functions/source/ReadLines";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class ReadLinesInstruction extends Instruction {

	public createCaption(options: { [name: string]: XObject }): string {
		let name = options[ReadLines.PATH_PLAN.getName()];
		return "Read Lines " + name;
	}

}

let plan = ReadLines.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(ReadLines.FUNCTION_NAME, new ReadLinesInstruction(plan));