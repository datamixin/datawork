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
import EReference from "webface/model/EReference";

import * as vegazoo from "vegazoo/vegazoo";
import * as model from "vegazoo/model/model";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XNumberDef from "vegazoo/model/XNumberDef";

export default class XFacetedUnitSpec extends XUnitSpec {

	public static XCLASSNAME: string = model.getEClassName("XFacetedUnitSpec");

	public static FEATURE_WIDTH = new EReference("width", XNumberDef);
	public static FEATURE_HEIGHT = new EReference("height", XNumberDef);

	private width: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_WIDTH);
	private height: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_HEIGHT);

	constructor() {
		super(model.createEClass(XFacetedUnitSpec.XCLASSNAME), [
			XFacetedUnitSpec.FEATURE_WIDTH,
			XFacetedUnitSpec.FEATURE_HEIGHT,
		]);
	}

	public getWidth(): XAnyOfDef {
		return this.width;
	}

	public setWidth(newWidth: XAnyOfDef | any) {
		let oldWidth = this.width;
		this.width = newWidth;
		this.eSetNotify(XFacetedUnitSpec.FEATURE_WIDTH, oldWidth, newWidth);
	}

	public getHeight(): XAnyOfDef {
		return this.height;
	}

	public setHeight(newHeight: XAnyOfDef | any) {
		let oldHeight = this.height;
		this.height = newHeight;
		this.eSetNotify(XFacetedUnitSpec.FEATURE_HEIGHT, oldHeight, newHeight);
	}

}