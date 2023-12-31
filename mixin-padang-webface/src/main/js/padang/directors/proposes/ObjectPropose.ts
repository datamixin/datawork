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
import XPointer from "sleman/model/XPointer";

import VisageType from "bekasi/visage/VisageType";

import Preface from "padang/directors/proposes/Preface";
import Propose from "padang/directors/proposes/Propose";
import ProposeRegistry from "padang/directors/proposes/ProposeRegistry";

export default class ObjectPropose extends Propose {

	private prefaces = new Map<string, Preface>();

	constructor() {
		super();
		this.prefaces.set(Preface.EXAMPLE, new Preface(Preface.EXAMPLE, false, VisageType.LIST));
	}

	public getPrefaces(_type: string): Map<string, Preface> {
		return this.prefaces;
	}

	public createCall(name: string, pointer: XPointer): XCall {
		let preface = this.prefaces.get(name);
		return preface.createCall(pointer);
	}

}

let registry = ProposeRegistry.getInstance();
registry.register("object", new ObjectPropose());
