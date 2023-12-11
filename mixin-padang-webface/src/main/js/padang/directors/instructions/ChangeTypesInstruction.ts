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
import XObject from "sleman/model/XObject";
import XAssignment from "sleman/model/XAssignment";

import ChangeTypes from "padang/functions/dataset/ChangeTypes";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class ChangeTypesInstruction extends Instruction {

    public createCaption(options: { [name: string]: XObject }): string {
        let typeMap = options[ChangeTypes.TYPE_MAP_PLAN.getName()];
        let fields = typeMap.getFields();
        return "Change " + fields.size + " column types";
    }

    public isCombinable(name: string): boolean {
        return name === ChangeTypes.FUNCTION_NAME;
    }

    public combine(name: string, prevObject: XObject, nextObject: XObject): XObject {
        if (name === ChangeTypes.TYPE_MAP_PLAN.getName()) {

            this.combineXObject(prevObject, nextObject);

            // Rubah a -> b dan b -> c menjadi a -> c
            let prevFields = prevObject.getFields();
            let oldTypeDecoration: Map<string, XAssignment> = new Map();
            let newTypeDecoration: Map<string, XAssignment> = new Map();
            for (let i = 0; i < prevFields.size; i++) {
                let prevField = prevFields.get(i);
                let identity = prevField.getName();
                let oldName = identity.getName();
                let prevValue = <XText>prevField.getExpression();
                let newType = prevValue.getValue();
                oldTypeDecoration.set(oldName, prevField);
                newTypeDecoration.set(newType, prevField);
            }
            let newNames = newTypeDecoration.keys();
            for (let newName of newNames) {
                if (oldTypeDecoration.has(newName)) {
                    let ab = newTypeDecoration.get(newName);
                    let bc = oldTypeDecoration.get(newName);
                    let abIdentifier = ab.getName();
                    let aName = abIdentifier.getName();
                    let bcIdentifier = bc.getName();
                    bcIdentifier.setName(aName);
                    prevFields.remove(ab);
                }
            }
            return prevObject;
        } else {
            throw new Error("Instruction parameter '" + name + "' not combinable");
        }
    }
}

let plan = ChangeTypes.getPlan();
let registry = InstructionRegistry.getInstance();
registry.register(ChangeTypes.FUNCTION_NAME, new ChangeTypesInstruction(plan));