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
import XText from "sleman/model/XText";
import XObject from "sleman/model/XObject";

import RenameColumns from "padang/functions/dataset/RenameColumns";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class RenameColumnsInstruction extends Instruction {

	public createCaption(options: { [name: string]: XObject }): string {
		let nameMap = options[RenameColumns.NAME_MAP_PLAN.getName()];
		let fields = nameMap.getFields();
		let names = {};
		for (let field of fields) {
			let identifier = field.getName();
			let name = identifier.getName();
			let value = <XText>nameMap.getField(name);
			names[name] = value.getValue();
		}
		return "Rename " + JSON.stringify(names);
	}

}

let plan = RenameColumns.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(RenameColumns.FUNCTION_NAME, new RenameColumnsInstruction(plan));