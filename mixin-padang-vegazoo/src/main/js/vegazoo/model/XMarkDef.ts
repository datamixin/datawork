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
import BasicEList from "webface/model/BasicEList";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XAlign from "vegazoo/model/XAlign";
import * as model from "vegazoo/model/model";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XObjectDef from "vegazoo/model/XObjectDef";
import XNumberDef from "vegazoo/model/XNumberDef";

export default class XMarkDef extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XMarkDef");

	public static FEATURE_X = new EReference("x", XNumberDef);
	public static FEATURE_Y = new EReference("y", XNumberDef);
	public static FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
	public static FEATURE_POINT = new EAttribute("point", EAttribute.BOOLEAN);
	public static FEATURE_TOOLTIP = new EAttribute("tooltip", EAttribute.BOOLEAN);
	public static FEATURE_DX = new EReference("dx", XNumberDef);
	public static FEATURE_DY = new EReference("dy", XNumberDef);
	public static FEATURE_ALIGN = new EReference("align", XAlign);
	public static FEATURE_BASELINE = new EAttribute("baseline", EAttribute.STRING);
	public static FEATURE_FONT_SIZE = new EAttribute("fontSize", EAttribute.NUMBER);
	public static FEATURE_LINE_HEIGHT = new EAttribute("lineHeight", EAttribute.NUMBER);
	public static FEATURE_COLOR = new EAttribute("color", EAttribute.STRING);
	public static FEATURE_STYLE = new EAttribute("style", EAttribute.STRING);
	public static FEATURE_TEXT = new EAttribute("text", EAttribute.STRING);
	public static FEATURE_SIZE = new EAttribute("size", EAttribute.NUMBER);
	public static FEATURE_TICKS = new EAttribute("ticks", EAttribute.BOOLEAN);

	private x: XAnyOfDef = null;
	private y: XAnyOfDef = null;
	private type: string = null;
	private point: boolean = null;
	private tooltip: boolean = null;
	private dx: XAnyOfDef = null;
	private dy: XAnyOfDef = null;
	private align: XAnyOfDef = null;
	private baseline: string = null;
	private fontSize: number = null;
	private lineHeight: number = null;
	private color: string = null;
	private style: string = null;
	private text = new BasicEList<string>(this, XMarkDef.FEATURE_TEXT);
	private size: number = null;
	private ticks: boolean = null;

	constructor() {
		super(model.createEClass(XMarkDef.XCLASSNAME), [
			XMarkDef.FEATURE_X,
			XMarkDef.FEATURE_Y,
			XMarkDef.FEATURE_TYPE,
			XMarkDef.FEATURE_POINT,
			XMarkDef.FEATURE_TOOLTIP,
			XMarkDef.FEATURE_DX,
			XMarkDef.FEATURE_DY,
			XMarkDef.FEATURE_ALIGN,
			XMarkDef.FEATURE_BASELINE,
			XMarkDef.FEATURE_FONT_SIZE,
			XMarkDef.FEATURE_LINE_HEIGHT,
			XMarkDef.FEATURE_COLOR,
			XMarkDef.FEATURE_STYLE,
			XMarkDef.FEATURE_TEXT,
			XMarkDef.FEATURE_SIZE,
			XMarkDef.FEATURE_TICKS,
		]);
	}

	public getX(): XAnyOfDef {
		return this.x;
	}

	public setX(newX: XAnyOfDef | any): void {
		let oldX = this.x;
		this.x = newX;
		this.eSetNotify(XMarkDef.FEATURE_X, oldX, newX);
	}

	public getY(): XAnyOfDef {
		return this.y;
	}

	public setY(newY: XAnyOfDef | any): void {
		let oldY = this.y;
		this.y = newY;
		this.eSetNotify(XMarkDef.FEATURE_Y, oldY, newY);
	}

	public getType(): string {
		return this.type;
	}

	public setType(newType: string): void {
		let oldType = this.type;
		this.type = newType;
		this.eSetNotify(XMarkDef.FEATURE_TYPE, oldType, newType);
	}

	public isPoint(): boolean {
		return this.point;
	}

	public setPoint(newPoint: boolean): void {
		let oldPoint = this.point;
		this.point = newPoint;
		this.eSetNotify(XMarkDef.FEATURE_POINT, oldPoint, newPoint);
	}

	public isTooltip(): boolean {
		return this.tooltip;
	}

	public setTooltip(newTooltip: boolean): void {
		let oldTooltip = this.tooltip;
		this.tooltip = newTooltip;
		this.eSetNotify(XMarkDef.FEATURE_TOOLTIP, oldTooltip, newTooltip);
	}

	public getDx(): XAnyOfDef {
		return this.dx;
	}

	public setDx(newDx: XAnyOfDef): void {
		let oldDx = this.dx;
		this.dx = newDx;
		this.eSetNotify(XMarkDef.FEATURE_DX, oldDx, newDx);
	}

	public getDy(): XAnyOfDef {
		return this.dy;
	}

	public setDy(newDy: XAnyOfDef): void {
		let oldDy = this.dy;
		this.dy = newDy;
		this.eSetNotify(XMarkDef.FEATURE_DY, oldDy, newDy);
	}

	public getAlign(): XAnyOfDef {
		return this.align;
	}

	public setAlign(newAlign: XAnyOfDef | any): void {
		let oldAlign = this.align;
		this.align = newAlign;
		this.eSetNotify(XMarkDef.FEATURE_ALIGN, oldAlign, newAlign);
	}

	public getBaseline(): string {
		return this.baseline;
	}

	public setBaseline(newBaseline: string): void {
		let oldBaseline = this.baseline;
		this.baseline = newBaseline;
		this.eSetNotify(XMarkDef.FEATURE_BASELINE, oldBaseline, newBaseline);
	}

	public getFontSize(): number {
		return this.fontSize;
	}

	public setFontSize(newFontSize: number): void {
		let oldFontSize = this.fontSize;
		this.fontSize = newFontSize;
		this.eSetNotify(XMarkDef.FEATURE_FONT_SIZE, oldFontSize, newFontSize);
	}

	public getLineHeight(): number {
		return this.lineHeight;
	}

	public setLineHeight(newLineHeight: number): void {
		let oldLineHeight = this.lineHeight;
		this.lineHeight = newLineHeight;
		this.eSetNotify(XMarkDef.FEATURE_LINE_HEIGHT, oldLineHeight, newLineHeight);
	}

	public getColor(): string {
		return this.color;
	}

	public setColor(newColor: string): void {
		let oldColor = this.color;
		this.color = newColor;
		this.eSetNotify(XMarkDef.FEATURE_COLOR, oldColor, newColor);
	}

	public getStyle(): string {
		return this.style;
	}

	public setStyle(newStyle: string): void {
		let oldStyle = this.style;
		this.style = newStyle;
		this.eSetNotify(XMarkDef.FEATURE_STYLE, oldStyle, newStyle);
	}

	public getText(): EList<string> {
		return this.text;
	}

	public getSize(): number {
		return this.size;
	}

	public setSize(newSize: number): void {
		let oldSize = this.size;
		this.size = newSize;
		this.eSetNotify(XMarkDef.FEATURE_SIZE, oldSize, newSize);
	}

	public isTicks(): boolean {
		return this.ticks;
	}

	public setTicks(newTicks: boolean): void {
		let oldTicks = this.ticks;
		this.ticks = newTicks;
		this.eSetNotify(XMarkDef.FEATURE_TICKS, oldTicks, newTicks);
	}


}