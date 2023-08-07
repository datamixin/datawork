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
import { jsonLeanFactory } from "webface/constants";

import VisageConstant from "bekasi/visage/VisageConstant";
import VisageTextMetadata from "bekasi/visage/VisageTextMetadata";

export default class VisageText extends VisageConstant {

	public static LEAN_NAME = "VisageText";

	private metadata: VisageTextMetadata = null;
	private value: string = null;

	constructor(value?: string) {
		super(VisageText.LEAN_NAME);
		this.value = value === undefined ? null : value;
	}

	public getMetadata(): VisageTextMetadata {
		return this.metadata;
	}

	public setValue(value: string): void {
		this.value = value;
	}

	public getValue(): string {
		return this.value;
	}

	public toString(): string {
		return this.value;
	}

	public toLiteral(): string {
		return "'" + this.value + "'";
	}

}

jsonLeanFactory.register(VisageText.LEAN_NAME, VisageText);