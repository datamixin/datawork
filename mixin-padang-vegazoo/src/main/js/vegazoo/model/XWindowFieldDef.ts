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

export default class XWindowFieldDef extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XWindowFieldDef");

	public static FEATURE_OP = new EAttribute("op", EAttribute.STRING);
	public static FEATURE_AS = new EAttribute("as", EAttribute.STRING);

	private op: string = null;
	private as: string = null;

	constructor() {
		super(model.createEClass(XWindowFieldDef.XCLASSNAME), [
			XWindowFieldDef.FEATURE_OP,
			XWindowFieldDef.FEATURE_AS,
		]);
	}

	public getOp(): string {
		return this.op;
	}

	public setOp(newOp: string): void {
		let oldOp = this.op;
		this.op = newOp;
		this.eSetNotify(XWindowFieldDef.FEATURE_OP, oldOp, newOp);
	}

	public getAs(): string {
		return this.as;
	}

	public setAs(newAs: string): void {
		let oldAs = this.as;
		this.as = newAs;
		this.eSetNotify(XWindowFieldDef.FEATURE_AS, oldAs, newAs);
	}

}