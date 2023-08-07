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
import XExpression from "sleman/model/XExpression";

import FromDataset from "padang/functions/source/FromDataset";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class FromDatasetInstruction extends Instruction {

    public createCaption(options: { [name: string]: XExpression }): string {
        let dataset = options[FromDataset.DATASET_PLAN.getName()];
        return "From dataset " + dataset;
    }

}

let plan = FromDataset.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(FromDataset.FUNCTION_NAME, new FromDatasetInstruction(plan));