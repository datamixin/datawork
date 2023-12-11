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
import * as functions from "webface/functions";
import { jsonLeanFactory } from "webface/constants";

import VisageType from "bekasi/visage/VisageType";
import VisageConstant from "bekasi/visage/VisageConstant";

export default class VisageNumber extends VisageConstant {

	public static LEAN_NAME = "VisageNumber";

	private value: number = null;
	private subtype: string = null;
	private remark: number = null;

	constructor(value?: number) {
		super(VisageNumber.LEAN_NAME);
		this.value = value === undefined ? null : value;
	}

	public setSubtype(subtype: string): void {
		this.subtype = subtype;
	}

	public getSubtype(): string {
		return this.subtype;
	}

	public setValue(value: number): void {
		this.value = value;
	}

	public getValue(): number {
		if (<any>this.value === "NaN") {
			return NaN;
		}
		return this.value;
	}

	public setRemark(remark: number): void {
		this.remark = remark;
	}

	public getRemark(): number {
		return this.remark;
	}

	public toString(): string {
		return this.toFormatted();
	}

	public toFormatted(): string {
		return VisageNumber.getFormatted(this.value, this.subtype);
	}

	public toLiteral(): string {
		return this.toString();
	}

	public static getFormatted(value: number, subtype: string, format?: string): string {
		let date = new Date(value);
		format = format === null ? undefined : format;
		if (subtype.toLowerCase() === VisageType.TIMESTAMP) {
			return functions.formatDateTime(date, format);
		} else if (subtype.toLowerCase() === VisageType.DATETIME) {
			return functions.formatDateTime(date, format);
		} else if (subtype.toLowerCase() === VisageType.DATE) {
			return functions.formatDate(date, format);
		} else if (subtype.toLowerCase() === VisageType.TIME) {
			return functions.formatTime(date, format);
		} else if (subtype.toLowerCase() === VisageType.DURATION) {
			return functions.formatDuration(value);
		} else {
			return functions.formatNumber(value, format);
		}
	}

}

jsonLeanFactory.register(VisageNumber.LEAN_NAME, <any>VisageNumber);