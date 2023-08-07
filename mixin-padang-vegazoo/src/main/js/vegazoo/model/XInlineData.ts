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
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XDataSource from "vegazoo/model/XDataSource";
import XDataFormat from "vegazoo/model/XDataFormat";
import * as model from "vegazoo/model/model";

export default class XInlineData extends XDataSource {

	public static XCLASSNAME: string = model.getEClassName("XInlineData");

	public static FEATURE_VALUES = new EAttribute("values", EAttribute.STRING);
	public static FEATURE_FORMAT = new EReference("format", XDataFormat);

	private values: string = null;
	private format: XDataFormat = null;

	constructor() {
		super(model.createEClass(XInlineData.XCLASSNAME), [
			XInlineData.FEATURE_VALUES,
			XInlineData.FEATURE_FORMAT
		]);
	}

	public getValues(): string {
		return this.values;
	}

	public setValues(newValues: string | any): void {
		let oldValues = this.values;
		this.values = newValues;
		this.eSetNotify(XInlineData.FEATURE_VALUES, oldValues, newValues);
	}

	public getFormat(): XDataFormat {
		return this.format;
	}

	public setFormat(newFormat: XDataFormat): void {
		let oldFormat = this.format;
		this.format = newFormat;
		this.eSetNotify(XInlineData.FEATURE_FORMAT, oldFormat, newFormat);
	}

}