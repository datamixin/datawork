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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";

import * as model from "vegazoo/model/model";
import XColorDef from "vegazoo/model/XColorDef";
import XPolarDef from "vegazoo/model/XPolarDef";
import XObjectDef from "vegazoo/model/XObjectDef";
import XPositionDef from "vegazoo/model/XPositionDef";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XPositionValueDef from "vegazoo/model/XPositionValueDef";
import XFieldDefWithoutScale from "vegazoo/model/XFieldDefWithoutScale";

export default class XEncoding extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XEncoding");

	public static FEATURE_X = new EReference("x", XPositionFieldDef);
	public static FEATURE_Y = new EReference("y", XPositionFieldDef);
	public static FEATURE_TEXT = new EReference("text", XPositionFieldDef);
	public static FEATURE_COLOR = new EReference("color", XColorDef);
	public static FEATURE_THETA = new EReference("theta", XPositionFieldDef);
	public static FEATURE_ORDER = new EReference("order", XPositionFieldDef);
	public static FEATURE_DETAIL = new EReference("detail", XFieldDefWithoutScale);
	public static FEATURE_OPACITY = new EReference("opacity", XPositionValueDef);

	private x: XPositionDef = null;
	private y: XPositionDef = null;
	private text: XPositionDef = null;
	private color: XColorDef = null;
	private theta: XPolarDef = null;
	private order: XPositionDef = null;
	private detail: XFieldDefWithoutScale = null;
	private opacity: XPositionValueDef = null;

	private static FEATURES: EFeature[] = [
		XEncoding.FEATURE_X,
		XEncoding.FEATURE_Y,
		XEncoding.FEATURE_TEXT,
		XEncoding.FEATURE_COLOR,
		XEncoding.FEATURE_THETA,
		XEncoding.FEATURE_ORDER,
		XEncoding.FEATURE_DETAIL,
		XEncoding.FEATURE_OPACITY,
	];

	constructor(xClass?: EClass, features?: EFeature[]) {
		super(
			xClass === undefined ? model.createEClass(XEncoding.XCLASSNAME) : xClass,
			features === undefined ? XEncoding.FEATURES : XEncoding.FEATURES.concat(features)
		);
	}

	public getX(): XPositionDef {
		return this.x;
	}

	public setX(newX: XPositionDef) {
		let oldX = this.x;
		this.x = newX;
		this.eSetNotify(XEncoding.FEATURE_X, oldX, newX);
	}

	public getY(): XPositionDef {
		return this.y;
	}

	public setY(newY: XPositionDef) {
		let oldY = this.y;
		this.y = newY;
		this.eSetNotify(XEncoding.FEATURE_Y, oldY, newY);
	}

	public getText(): XPositionDef {
		return this.text;
	}

	public setText(newText: XPositionDef) {
		let oldText = this.text;
		this.text = newText;
		this.eSetNotify(XEncoding.FEATURE_TEXT, oldText, newText);
	}

	public getColor(): XColorDef {
		return this.color;
	}

	public setColor(newColor: XColorDef) {
		let oldColor = this.color;
		this.color = newColor;
		this.eSetNotify(XEncoding.FEATURE_COLOR, oldColor, newColor);
	}

	public getTheta(): XPolarDef {
		return this.theta;
	}

	public setTheta(newTheta: XPolarDef) {
		let oldTheta = this.theta;
		this.theta = newTheta;
		this.eSetNotify(XEncoding.FEATURE_THETA, oldTheta, newTheta);
	}

	public getOrder(): XPositionDef {
		return this.order;
	}

	public setOrder(newOrder: XPositionDef) {
		let oldOrder = this.order;
		this.order = newOrder;
		this.eSetNotify(XEncoding.FEATURE_ORDER, oldOrder, newOrder);
	}

	public getDetail(): XFieldDefWithoutScale {
		return this.detail;
	}

	public setDetail(newDetail: XFieldDefWithoutScale) {
		let oldDetail = this.detail;
		this.detail = newDetail;
		this.eSetNotify(XEncoding.FEATURE_DETAIL, oldDetail, newDetail);
	}

	public getOpacity(): XPositionValueDef {
		return this.opacity;
	}

	public setOpacity(newOpacity: XPositionValueDef) {
		let oldOpacity = this.opacity;
		this.opacity = newOpacity;
		this.eSetNotify(XEncoding.FEATURE_OPACITY, oldOpacity, newOpacity);
	}

}