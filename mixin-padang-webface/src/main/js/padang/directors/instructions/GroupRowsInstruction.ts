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
import XExpression from "sleman/model/XExpression";

import GroupRows from "padang/functions/dataset/GroupRows";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class GroupRowsInstruction extends Instruction {

    public createCaption(options: { [name: string]: XExpression }): string {
        let keys = options[GroupRows.KEYS_PLAN.getName()].toLiteral();
        return "Group by with " + keys + "";
    }

}

let plan = GroupRows.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(GroupRows.FUNCTION_NAME, new GroupRowsInstruction(plan));