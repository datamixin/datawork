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

import XAxis from "vegazoo/model/XAxis";
import XScale from "vegazoo/model/XScale";
import * as model from "vegazoo/model/model";
import XFieldDef from "vegazoo/model/XFieldDef";
import XPositionDef from "vegazoo/model/XPositionDef";

export default class XPositionFieldDef extends XFieldDef implements XPositionDef {

	public static XCLASSNAME: string = model.getEClassName("XPositionFieldDef");

	public static FEATURE_SCALE = new EReference("scale", XScale);
	public static FEATURE_AXIS = new EReference("axis", XAxis);

	private scale: XScale = null;
	private axis: XAxis = null;

	constructor() {
		super(model.createEClass(XPositionFieldDef.XCLASSNAME), [
			XPositionFieldDef.FEATURE_SCALE,
			XPositionFieldDef.FEATURE_AXIS,
		]);
	}

	public getScale(): XScale {
		return this.scale;
	}

	public setScale(newScale: XScale): void {
		let oldScale = this.scale;
		this.scale = newScale;
		this.eSetNotify(XPositionFieldDef.FEATURE_SCALE, oldScale, newScale);
	}

	public getAxis(): XAxis {
		return this.axis;
	}

	public setAxis(newAxis: XAxis): void {
		let oldAxis = this.axis;
		this.axis = newAxis;
		this.eSetNotify(XPositionFieldDef.FEATURE_AXIS, oldAxis, newAxis);
	}

}
