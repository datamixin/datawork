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
import XText from "sleman/model/XText";

import ToDatetime from "padang/functions/dataset/ToDatetime";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class ToDatetimeInstruction extends Instruction {

    public createCaption(options: { [name: string]: XText }): string {
        let column = options[ToDatetime.COLUMN_PLAN.getName()].getValue();
        let pattern = "";
        if (this.hasOption(options, ToDatetime.FORMAT_PLAN)) {
            let format = this.getValueOption(options, ToDatetime.FORMAT_PLAN);
            pattern = "using format '" + format + "' ";
        }
        let autoDetect = "";
        if (this.hasOption(options, ToDatetime.AUTO_DETECT_PLAN)) {
            let value = this.getValueOption(options, ToDatetime.AUTO_DETECT_PLAN);
            autoDetect = "with auto detect is '" + value + "' ";
        }
        return "Datetime " + pattern + autoDetect + "at '" + column + "' column";
    }

}

let plan = ToDatetime.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(ToDatetime.FUNCTION_NAME, new ToDatetimeInstruction(plan));