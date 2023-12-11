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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";

import XLet from "sleman/model/XLet";
import XNull from "sleman/model/XNull";
import XText from "sleman/model/XText";
import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XAlias from "sleman/model/XAlias";
import XObject from "sleman/model/XObject";
import XNumber from "sleman/model/XNumber";
import XMember from "sleman/model/XMember";
import XPointer from "sleman/model/XPointer";
import XForeach from "sleman/model/XForeach";
import XLogical from "sleman/model/XLogical";
import XArgument from "sleman/model/XArgument";
import XReference from "sleman/model/XReference";
import XAssignment from "sleman/model/XAssignment";
import XIdentifier from "sleman/model/XIdentifier";
import XExpression from "sleman/model/XExpression";

import BinaryBuilder from "sleman/BinaryBuilder";

export abstract class SlemanFactory implements EFactory {

	public static eINSTANCE: SlemanFactory = null;

	abstract create(xClass: EClass): EObject;

	abstract createBinaryBuilder(): BinaryBuilder;

	abstract createXNull(): XNull;

	abstract createXText(value?: string): XText;

	abstract createXNumber(value?: number): XNumber;

	abstract createXLogical(value?: boolean): XLogical;

	abstract createXList(...expressions: XExpression[]): XList;

	abstract createXObject(...assignments: XAssignment[]): XObject;

	abstract createXCall(pointer?: string, ...args: (XExpression | XArgument)[]): XCall;

	abstract createXLet(): XLet;

	abstract createXForeach(expression?: XExpression): XForeach;

	abstract createXAlias(name?: string): XAlias;

	abstract createXReference(name?: string): XReference;

	abstract createXArgument(expression?: XExpression): XArgument;

	abstract createXPointer(qualifiedName: string): XPointer;

	abstract createXMember(object?: string | XPointer, property?: string | number): XMember;

	abstract createXAssignment(name?: string, expression?: XExpression): XAssignment;

	abstract createXIdentifier(name?: string): XIdentifier;

}

export default SlemanFactory;
