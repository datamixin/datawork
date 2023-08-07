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

export default class XAxisConfig extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XAxisConfig");

	public static FEATURE_DOMAIN = new EAttribute("domain", EAttribute.BOOLEAN);
	public static FEATURE_TITLE = new EAttribute("title", EAttribute.STRING);
	public static FEATURE_TICKS = new EAttribute("ticks", EAttribute.BOOLEAN);
	public static FEATURE_LABEL_ANGLE = new EAttribute("labelAngle", EAttribute.NUMBER);
	public static FEATURE_LABEL_PADDING = new EAttribute("labelPadding", EAttribute.NUMBER);

	private domain: boolean = null;
	private title: string = null;
	private ticks: boolean = null;
	private labelAngle: number = null;
	private labelPadding: number = null;

	constructor() {
		super(model.createEClass(XAxisConfig.XCLASSNAME), [
			XAxisConfig.FEATURE_DOMAIN,
			XAxisConfig.FEATURE_TITLE,
			XAxisConfig.FEATURE_TICKS,
			XAxisConfig.FEATURE_LABEL_ANGLE,
			XAxisConfig.FEATURE_LABEL_PADDING,
		]);
	}

	public getDomain(): boolean {
		return this.domain;
	}

	public setDomain(newDomain: boolean): void {
		let oldDomain = this.domain;
		this.domain = newDomain;
		this.eSetNotify(XAxisConfig.FEATURE_DOMAIN, oldDomain, newDomain);
	}

	public getTitle(): string {
		return this.title;
	}

	public setTitle(newTitle: string): void {
		let oldTitle = this.title;
		this.title = newTitle;
		this.eSetNotify(XAxisConfig.FEATURE_TITLE, oldTitle, newTitle);
	}

	public getTicks(): boolean {
		return this.ticks;
	}

	public setTicks(newTicks: boolean): void {
		let oldTicks = this.ticks;
		this.ticks = newTicks;
		this.eSetNotify(XAxisConfig.FEATURE_TICKS, oldTicks, newTicks);
	}

	public getLabelAngle(): number {
		return this.labelAngle;
	}

	public setLabelAngle(newLabelAngle: number): void {
		let oldLabelAngle = this.labelAngle;
		this.labelAngle = newLabelAngle;
		this.eSetNotify(XAxisConfig.FEATURE_LABEL_ANGLE, oldLabelAngle, newLabelAngle);
	}

	public getLabelPadding(): number {
		return this.labelPadding;
	}

	public setLabelPadding(newLabelPadding: number): void {
		let oldLabelPadding = this.labelPadding;
		this.labelPadding = newLabelPadding;
		this.eSetNotify(XAxisConfig.FEATURE_LABEL_PADDING, oldLabelPadding, newLabelPadding);
	}

}