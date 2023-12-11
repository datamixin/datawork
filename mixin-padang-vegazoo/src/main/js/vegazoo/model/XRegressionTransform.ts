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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XTransform from "vegazoo/model/XTransform";

export default class XRegressionTransform extends XTransform {

	public static XCLONSNAME: string = model.getEClassName("XRegressionTransform");

	public static FEATURE_METHOD = new EAttribute("method", EAttribute.STRING);
	public static FEATURE_REGRESSION = new EAttribute("regression", EAttribute.STRING);
	public static FEATURE_ON = new EAttribute("on", EAttribute.STRING);

	private method: string = null;
	private regression: string = null;
	private on: string = null;

	constructor() {
		super(model.createEClass(XRegressionTransform.XCLONSNAME), [
			XRegressionTransform.FEATURE_METHOD,
			XRegressionTransform.FEATURE_REGRESSION,
			XRegressionTransform.FEATURE_ON,
		]);
	}

	public getMethod(): string {
		return this.method;
	}

	public setMethod(newMethod: string): void {
		let oldMethod = this.method;
		this.method = newMethod;
		this.eSetNotify(XRegressionTransform.FEATURE_METHOD, oldMethod, newMethod);
	}

	public getRegression(): string {
		return this.regression;
	}

	public setRegression(newRegression: string): void {
		let oldRegression = this.regression;
		this.regression = newRegression;
		this.eSetNotify(XRegressionTransform.FEATURE_REGRESSION, oldRegression, newRegression);
	}

	public getOn(): string {
		return this.on;
	}

	public setOn(newOn: string): void {
		let oldOn = this.on;
		this.on = newOn;
		this.eSetNotify(XRegressionTransform.FEATURE_ON, oldOn, newOn);
	}

}