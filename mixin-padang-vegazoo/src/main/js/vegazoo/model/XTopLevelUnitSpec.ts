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
import EReference from "webface/model/EReference";

import * as vegazoo from "vegazoo/vegazoo";
import * as model from "vegazoo/model/model";
import XMarkDef from "vegazoo/model/XMarkDef";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XNumberDef from "vegazoo/model/XNumberDef";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";

export default class XTopLevelUnitSpec extends XTopLevelSpec {

	public static XCLASSNAME: string = model.getEClassName("XTopLevelUnitSpec");

	public static FEATURE_MARK = new EReference("mark", XMarkDef);
	public static FEATURE_ENCODING = new EReference("encoding", XFacetedEncoding);
	public static FEATURE_WIDTH = new EReference("width", XNumberDef);
	public static FEATURE_HEIGHT = new EReference("height", XNumberDef);

	private mark: XMarkDef = null;
	private encoding: XFacetedEncoding = null;
	private width: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_WIDTH);
	private height: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_HEIGHT);

	constructor() {
		super(model.createEClass(XTopLevelUnitSpec.XCLASSNAME), [
			XTopLevelUnitSpec.FEATURE_MARK,
			XTopLevelUnitSpec.FEATURE_ENCODING,
			XTopLevelUnitSpec.FEATURE_WIDTH,
			XTopLevelUnitSpec.FEATURE_HEIGHT,
		]);
	}

	public getMark(): XMarkDef {
		return this.mark;
	}

	public setMark(newMark: XMarkDef) {
		let oldMark = this.mark;
		this.mark = newMark;
		this.eSetNotify(XTopLevelUnitSpec.FEATURE_MARK, oldMark, newMark);
	}

	public getEncoding(): XFacetedEncoding {
		return this.encoding;
	}

	public setEncoding(newEncoding: XFacetedEncoding) {
		let oldEncoding = this.encoding;
		this.encoding = newEncoding;
		this.eSetNotify(XTopLevelUnitSpec.FEATURE_ENCODING, oldEncoding, newEncoding);
	}

	public getWidth(): XAnyOfDef {
		return this.width;
	}

	public setWidth(newWidth: XAnyOfDef | any) {
		let oldWidth = this.width;
		this.width = newWidth;
		this.eSetNotify(XTopLevelUnitSpec.FEATURE_WIDTH, oldWidth, newWidth);
	}

	public getHeight(): XAnyOfDef {
		return this.height;
	}

	public setHeight(newHeight: XAnyOfDef | any) {
		let oldHeight = this.height;
		this.height = newHeight;
		this.eSetNotify(XTopLevelUnitSpec.FEATURE_HEIGHT, oldHeight, newHeight);
	}

}