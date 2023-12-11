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
import SLet from "sleman/SLet";
import SText from "sleman/SText";
import SNull from "sleman/SNull";
import SCall from "sleman/SCall";
import SList from "sleman/SList";
import SUnary from "sleman/SUnary";
import SValue from "sleman/SValue";
import SAlias from "sleman/SAlias";
import SNumber from "sleman/SNumber";
import SBinary from "sleman/SBinary";
import SMember from "sleman/SMember";
import SObject from "sleman/SObject";
import SLambda from "sleman/SLambda";
import SLogical from "sleman/SLogical";
import SPointer from "sleman/SPointer";
import SForeach from "sleman/SForeach";
import SArgument from "sleman/SArgument";
import SReference from "sleman/SReference";
import SExpression from "sleman/SExpression";
import SIdentifier from "sleman/SIdentifier";
import SAssignment from "sleman/SAssignment";
import SConditional from "sleman/SConditional";
import BinaryBuilder from "sleman/BinaryBuilder";

export interface ExpressionFactory {

    createNull(): SNull;

    createText(value: string): SText;

    createNumber(value: number): SNumber;

    createLogical(value: boolean): SLogical;

    createList(elements: SExpression[]): SList;

    createObject(fields: SAssignment[]): SObject;

    createLet(assignments: SAssignment[], expression: SExpression): SLet;

    createAssignment(name: string, expression: SExpression): SAssignment;

    createBinary(left: SExpression, operator: string, right?: SExpression): SBinary;

    createUnary(operator: string, argument: SExpression, prefix?: boolean): SUnary;

    createLambda(parameters: SIdentifier[], expression: SExpression): SLambda;

    createForeach(expression: SExpression): SForeach;

    createConditional(logical: SExpression, consequence: SExpression, alternate: SExpression): SConditional;

    createCall(callee: string | SPointer, args: SArgument[]): SCall;

    createArgument(expression?: SExpression): SArgument;

    createMember(object: string | SPointer, property?: string | number | SExpression): SMember;

    createIdentifier(name: string): SIdentifier;

    createAlias(name: string): SAlias;

    createReference(identifier: string): SReference;

    createPointer(qualified: string): SPointer;

    createValue(value: any): SValue;

    createBinaryBuilder(): BinaryBuilder;

    parse(literal: string): SExpression;

}

export default ExpressionFactory;

export let expressionFactory: ExpressionFactory = null;

export function setFactoryInstance(instance: ExpressionFactory): void {
    expressionFactory = instance;
}

