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
import XCall from "sleman/model/XCall";
import XMember from "sleman/model/XMember";
import XPointer from "sleman/model/XPointer";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class SlemanInspector {

	public static eINSTANCE: SlemanInspector = null;

	public getArgumentExpression(call: XCall, index: number): XExpression {
		let args = call.getArguments();
		let argument = args.get(index);
		return argument.getExpression();
	}

	public createReference(name: string): XReference {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXReference(name);
	}

	public createMember(object: string | XPointer, property: string): XMember {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXMember(object, property);
	}

}

SlemanInspector.eINSTANCE = new SlemanInspector();
