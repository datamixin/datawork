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
import { jsonLeanFactory } from "webface/constants";

import VisageConstant from "bekasi/visage/VisageConstant";

export default class VisageNull extends VisageConstant {

	public static LEAN_NAME = "VisageNull";

	constructor() {
		super(VisageNull.LEAN_NAME);
	}

	public toString(): string {
		return "null";
	}

	public toLiteral(): string {
		return this.toString();
	}

	public getValue(): any {
		return null;
	}

}

jsonLeanFactory.register(VisageNull.LEAN_NAME, VisageNull);