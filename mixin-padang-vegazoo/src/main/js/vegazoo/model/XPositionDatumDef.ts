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

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";
import XPositionDef from "vegazoo/model/XPositionDef";

export default class XPositionDatumDef extends XObjectDef implements XPositionDef {

	public static XCLASSNAME: string = model.getEClassName("XPositionDatumDef");

	public static FEATURE_DATUM = new EAttribute("datum", EAttribute.STRING);

	private datum: string = null;

	constructor() {
		super(model.createEClass(XPositionDatumDef.XCLASSNAME), [
			XPositionDatumDef.FEATURE_DATUM,
		]);
	}

	public getDatum(): string {
		return this.datum;
	}

	public setDatum(newDatum: string) {
		let oldDatum = this.datum;
		this.datum = newDatum;
		this.eSetNotify(XPositionDatumDef.FEATURE_DATUM, oldDatum, newDatum);
	}


}