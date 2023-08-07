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
import ObjectMap from "webface/util/ObjectMap";

import Instruction from "padang/directors/instructions/Instruction";

export default class InstructionRegistry {

	private static instance = new InstructionRegistry();

	private instructions = new ObjectMap<Instruction>();

	constructor() {
		if (InstructionRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use InstructionRegistry.getInstance() instead of new");
		}
		InstructionRegistry.instance = this;
	}

	public static getInstance(): InstructionRegistry {
		return InstructionRegistry.instance;
	}

	public register(name: string, instruction: Instruction): void {
		this.instructions.put(name, instruction);
	}

	public has(name: string): boolean {
		return this.instructions.containsKey(name);
	}

	public get(name: string): Instruction {
		return this.instructions.get(name);
	}

}