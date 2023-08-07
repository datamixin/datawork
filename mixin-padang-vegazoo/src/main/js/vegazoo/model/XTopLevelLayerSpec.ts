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
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as vegazoo from "vegazoo/vegazoo";
import * as model from "vegazoo/model/model";
import XViewSpec from "vegazoo/model/XViewSpec";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XNumberDef from "vegazoo/model/XNumberDef";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XSharedEncoding from "vegazoo/model/XSharedEncoding";

export default class XTopLevelLayerSpec extends XTopLevelSpec {

	public static XCLASSNAME: string = model.getEClassName("XTopLevelLayerSpec");

	public static FEATURE_ENCODING = new EReference("encoding", XSharedEncoding);
	public static FEATURE_LAYER = new EReference("layer", XViewSpec);
	public static FEATURE_WIDTH = new EReference("width", XNumberDef);
	public static FEATURE_HEIGHT = new EReference("height", XNumberDef);

	private encoding: XSharedEncoding = null;
	private layer: EList<XViewSpec> = new BasicEList<XViewSpec>(this, XTopLevelLayerSpec.FEATURE_LAYER);
	private width: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_WIDTH);
	private height: XAnyOfDef = new XNumberDef(vegazoo.DEFAULT_HEIGHT);

	constructor() {
		super(model.createEClass(XTopLevelLayerSpec.XCLASSNAME), [
			XTopLevelLayerSpec.FEATURE_ENCODING,
			XTopLevelLayerSpec.FEATURE_LAYER,
			XTopLevelLayerSpec.FEATURE_WIDTH,
			XTopLevelLayerSpec.FEATURE_HEIGHT,
		]);
	}

	public getEncoding(): XSharedEncoding {
		return this.encoding;
	}

	public setEncoding(newEncoding: XSharedEncoding) {
		let oldEncoding = this.encoding;
		this.encoding = newEncoding;
		this.eSetNotify(XTopLevelLayerSpec.FEATURE_ENCODING, oldEncoding, newEncoding);
	}

	public getLayer(): EList<XViewSpec> {
		return this.layer;
	}

	public getWidth(): XAnyOfDef {
		return this.width;
	}

	public setWidth(newWidth: XAnyOfDef | any) {
		let oldWidth = this.width;
		this.width = newWidth;
		this.eSetNotify(XTopLevelLayerSpec.FEATURE_WIDTH, oldWidth, newWidth);
	}

	public getHeight(): XAnyOfDef {
		return this.height;
	}

	public setHeight(newHeight: XAnyOfDef | any) {
		let oldHeight = this.height;
		this.height = newHeight;
		this.eSetNotify(XTopLevelLayerSpec.FEATURE_HEIGHT, oldHeight, newHeight);
	}

}