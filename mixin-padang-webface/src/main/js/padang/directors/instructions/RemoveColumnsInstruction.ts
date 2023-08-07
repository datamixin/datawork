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
import XList from "sleman/model/XList";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

import RemoveColumns from "padang/functions/dataset/RemoveColumns";

export default class RemoveColumnsInstruction extends Instruction {

	public createCaption(options: { [name: string]: XList }): string {
		let keys = options[RemoveColumns.KEYS_PLAN.getName()];
		let count = keys.getElementCount();
		return "Remove " + count + " columns";
	}

	public isCombinable(name: string): boolean {
		return name === RemoveColumns.FUNCTION_NAME;
	}

	public combine(name: string, prevList: XList, nextList: XList): XList {
		if (name === RemoveColumns.KEYS_PLAN.getName()) {
			let prevElements = prevList.getElements();
			let nextElements = nextList.getElements();
			for (let i = 0; i < nextElements.size; i++) {
				let nextElement = nextElements.get(i);
				prevElements.add(nextElement);
			}
			return prevList;
		} else {
			throw new Error("Instruction parameter '" + name + "' not combinable");
		}
	}

}

let plan = RemoveColumns.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(RemoveColumns.FUNCTION_NAME, new RemoveColumnsInstruction(plan));