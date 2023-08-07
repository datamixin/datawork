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
import XTransform from "vegazoo/model/XTransform";

export default class XCalculateTransform extends XTransform {

	public static XCLASSNAME: string = model.getEClassName("XCalculateTransform");

	public static FEATURE_CALCULATE = new EAttribute("calculate", EAttribute.STRING);
	public static FEATURE_AS = new EAttribute("as", EAttribute.STRING);

	private calculate: string = null;
	private as: string = null;

	constructor() {
		super(model.createEClass(XCalculateTransform.XCLASSNAME), [
			XCalculateTransform.FEATURE_CALCULATE,
			XCalculateTransform.FEATURE_AS,
		]);
	}

	public getCalculate(): string {
		return this.calculate;
	}

	public setCalculate(newCalculate: string): void {
		let oldCalculate = this.calculate;
		this.calculate = newCalculate;
		this.eSetNotify(XCalculateTransform.FEATURE_CALCULATE, oldCalculate, newCalculate);
	}

	public getAs(): string {
		return this.as;
	}

	public setAs(newAs: string): void {
		let oldAs = this.as;
		this.as = newAs;
		this.eSetNotify(XCalculateTransform.FEATURE_AS, oldAs, newAs);
	}

}