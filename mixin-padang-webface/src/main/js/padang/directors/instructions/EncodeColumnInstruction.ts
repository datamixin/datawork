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
import XList from "sleman/model/XList";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

import EncodeColumn from "padang/functions/dataset/EncodeColumn";

export default class EncodeColumnInstruction extends Instruction {

	public createCaption(options: { [name: string]: XList }): string {
		let value = options[EncodeColumn.COLUMN_PLAN.getName()];
		return "Encode " + value;
	}

}

let plan = EncodeColumn.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(EncodeColumn.FUNCTION_NAME, new EncodeColumnInstruction(plan));