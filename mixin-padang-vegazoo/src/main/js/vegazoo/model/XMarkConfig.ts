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
import EReference from "webface/model/EReference";

import XAlign from "vegazoo/model/XAlign";
import * as model from "vegazoo/model/model";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XObjectDef from "vegazoo/model/XObjectDef";
import XNumberDef from "vegazoo/model/XNumberDef";

export default class XMarkConfig extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XMarkConfig");

	public static FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
	public static FEATURE_POINT = new EAttribute("point", EAttribute.BOOLEAN);
	public static FEATURE_TOOLTIP = new EAttribute("tooltip", EAttribute.BOOLEAN);
	public static FEATURE_DX = new EReference("dx", XNumberDef);
	public static FEATURE_DY = new EReference("dy", XNumberDef);
	public static FEATURE_ALIGN = new EReference("align", XAlign);
	public static FEATURE_BASELINE = new EAttribute("baseline", EAttribute.STRING);
	public static FEATURE_FONT_SIZE = new EAttribute("fontSize", EAttribute.NUMBER);
	public static FEATURE_COLOR = new EAttribute("color", EAttribute.STRING);
	public static FEATURE_STYLE = new EAttribute("style", EAttribute.STRING);

	private type: string = null;
	private point: boolean = null;
	private tooltip: boolean = null;
	private dx: XAnyOfDef = null;
	private dy: XAnyOfDef = null;
	private align: XAnyOfDef = null;
	private baseline: string = null;
	private fontSize: number = null;
	private color: string = null;

	constructor() {
		super(model.createEClass(XMarkConfig.XCLASSNAME), [
			XMarkConfig.FEATURE_TYPE,
			XMarkConfig.FEATURE_POINT,
			XMarkConfig.FEATURE_TOOLTIP,
			XMarkConfig.FEATURE_DX,
			XMarkConfig.FEATURE_DY,
			XMarkConfig.FEATURE_ALIGN,
			XMarkConfig.FEATURE_BASELINE,
			XMarkConfig.FEATURE_FONT_SIZE,
			XMarkConfig.FEATURE_COLOR,
		]);
	}

	public getType(): string {
		return this.type;
	}

	public setType(newType: string): void {
		let oldType = this.type;
		this.type = newType;
		this.eSetNotify(XMarkConfig.FEATURE_TYPE, oldType, newType);
	}

	public isPoint(): boolean {
		return this.point;
	}

	public setPoint(newPoint: boolean): void {
		let oldPoint = this.point;
		this.point = newPoint;
		this.eSetNotify(XMarkConfig.FEATURE_POINT, oldPoint, newPoint);
	}

	public isTooltip(): boolean {
		return this.tooltip;
	}

	public setTooltip(newTooltip: boolean): void {
		let oldTooltip = this.tooltip;
		this.tooltip = newTooltip;
		this.eSetNotify(XMarkConfig.FEATURE_TOOLTIP, oldTooltip, newTooltip);
	}

	public getDx(): XAnyOfDef {
		return this.dx;
	}

	public setDx(newDx: XAnyOfDef | any): void {
		let oldDx = this.dx;
		this.dx = newDx;
		this.eSetNotify(XMarkConfig.FEATURE_DX, oldDx, newDx);
	}

	public getDy(): XAnyOfDef {
		return this.dy;
	}

	public setDy(newDy: XAnyOfDef | any): void {
		let oldDy = this.dy;
		this.dy = newDy;
		this.eSetNotify(XMarkConfig.FEATURE_DY, oldDy, newDy);
	}

	public getAlign(): XAnyOfDef {
		return this.align;
	}

	public setAlign(newAlign: XAnyOfDef | any): void {
		let oldAlign = this.align;
		this.align = newAlign;
		this.eSetNotify(XMarkConfig.FEATURE_ALIGN, oldAlign, newAlign);
	}

	public getBaseline(): string {
		return this.baseline;
	}

	public setBaseline(newBaseline: string): void {
		let oldBaseline = this.baseline;
		this.baseline = newBaseline;
		this.eSetNotify(XMarkConfig.FEATURE_BASELINE, oldBaseline, newBaseline);
	}

	public getFontSize(): number {
		return this.fontSize;
	}

	public setFontSize(newFontSize: number): void {
		let oldFontSize = this.fontSize;
		this.fontSize = newFontSize;
		this.eSetNotify(XMarkConfig.FEATURE_FONT_SIZE, oldFontSize, newFontSize);
	}

	public getColor(): string {
		return this.color;
	}

	public setColor(newColor: string): void {
		let oldColor = this.color;
		this.color = newColor;
		this.eSetNotify(XMarkConfig.FEATURE_COLOR, oldColor, newColor);
	}

}