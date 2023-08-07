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
import XObject from "sleman/model/XObject";

import ReadExcel from "padang/functions/source/ReadExcel";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class ReadExcelInstruction extends Instruction {

	public createCaption(options: { [name: string]: XObject }): string {
		let name = options[ReadExcel.PATH_PLAN.getName()];
		return "Read CSV " + name;
	}

}

let plan = ReadExcel.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(ReadExcel.FUNCTION_NAME, new ReadExcelInstruction(plan));