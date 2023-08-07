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
import EList from "webface/model/EList";
import EAttribute from "webface/model/EAttribute";
import BasicEList from "webface/model/BasicEList";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";

export default class XScale extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XScale");

	public static FEATURE_ZERO = new EAttribute("zero", EAttribute.BOOLEAN);
	public static FEATURE_RANGE = new EAttribute("range", EAttribute.STRING);
	public static FEATURE_SCHEME = new EAttribute("scheme", EAttribute.STRING);
	public static FEATURE_DOMAIN_MIN = new EAttribute("domainMin", EAttribute.NUMBER);
	public static FEATURE_DOMAIN_MAX = new EAttribute("domainMax", EAttribute.NUMBER);

	private zero: boolean = null;
	private range = new BasicEList<string>(this, XScale.FEATURE_RANGE);
	private scheme: string = null;
	private domainMin: number = null;
	private domainMax: number = null;

	constructor() {
		super(model.createEClass(XScale.XCLASSNAME), [
			XScale.FEATURE_ZERO,
			XScale.FEATURE_RANGE,
			XScale.FEATURE_SCHEME,
			XScale.FEATURE_DOMAIN_MIN,
			XScale.FEATURE_DOMAIN_MAX,
		]);
	}

	public isZero(): boolean {
		return this.zero;
	}

	public setZero(newZero: boolean): void {
		let oldZero = this.zero;
		this.zero = newZero;
		this.eSetNotify(XScale.FEATURE_ZERO, oldZero, newZero);
	}

	public getRange(): EList<string> {
		return this.range;
	}

	public isScheme(): string {
		return this.scheme;
	}

	public setScheme(newScheme: string): void {
		let oldScheme = this.scheme;
		this.scheme = newScheme;
		this.eSetNotify(XScale.FEATURE_SCHEME, oldScheme, newScheme);
	}

	public isDomainMin(): number {
		return this.domainMin;
	}

	public setDomainMin(newDomainMin: number): void {
		let oldDomainMin = this.domainMin;
		this.domainMin = newDomainMin;
		this.eSetNotify(XScale.FEATURE_DOMAIN_MIN, oldDomainMin, newDomainMin);
	}

	public isDomainMax(): number {
		return this.domainMax;
	}

	public setDomainMax(newDomainMax: number): void {
		let oldDomainMax = this.domainMax;
		this.domainMax = newDomainMax;
		this.eSetNotify(XScale.FEATURE_DOMAIN_MAX, oldDomainMax, newDomainMax);
	}

}