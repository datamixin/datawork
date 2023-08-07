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
import EMap from "webface/model/EMap";
import BasicEMap from "webface/model/BasicEMap";
import EAttribute from "webface/model/EAttribute";

import * as constants from "vegazoo/constants";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";

export default class XDataFormat extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XDataFormat");

	public static FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
	public static FEATURE_PARSE = new EAttribute("parse", EAttribute.STRING);

	private type: string = constants.Format.CSV;
	private parse = new BasicEMap<string>(this, XDataFormat.FEATURE_PARSE);

	constructor() {
		super(model.createEClass(XDataFormat.XCLASSNAME), [
			XDataFormat.FEATURE_TYPE,
			XDataFormat.FEATURE_PARSE,
		]);
	}

	public getType(): string {
		return this.type;
	}

	public setType(newType: string): void {
		let oldType = this.type;
		this.type = newType;
		this.eSetNotify(XDataFormat.FEATURE_TYPE, oldType, newType);
	}

	public getParse(): EMap<string> {
		return this.parse;
	}


}