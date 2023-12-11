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
import EList from "webface/model/EList";
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "vegazoo/model/model";
import XMarkDef from "vegazoo/model/XMarkDef";
import XEncoding from "vegazoo/model/XEncoding";
import XViewSpec from "vegazoo/model/XViewSpec";
import XTransform from "vegazoo/model/XTransform";

export default class XUnitSpec extends XViewSpec {

	public static XCLASSNAME: string = model.getEClassName("XUnitSpec");

	public static FEATURE_MARK = new EReference("mark", XMarkDef);
	public static FEATURE_ENCODING = new EReference("encoding", XEncoding);
	public static FEATURE_TRANSFORM = new EReference("transform", XTransform);

	private mark: XMarkDef = null;
	private transform: EList<XTransform> = new BasicEList<XTransform>(this, XUnitSpec.FEATURE_TRANSFORM);
	private encoding: XEncoding = null;

	private static FEATURES: EFeature[] = [
		XUnitSpec.FEATURE_MARK,
		XUnitSpec.FEATURE_TRANSFORM,
		XUnitSpec.FEATURE_ENCODING,
	];

	constructor(xClass?: EClass, features?: EFeature[]) {
		super(
			xClass === undefined ? model.createEClass(XUnitSpec.XCLASSNAME) : xClass,
			features === undefined ? XUnitSpec.FEATURES : XUnitSpec.FEATURES.concat(features)
		);
	}

	public getMark(): XMarkDef {
		return this.mark;
	}

	public setMark(newMark: XMarkDef): void {
		let oldMark = this.mark;
		this.mark = newMark;
		this.eSetNotify(XUnitSpec.FEATURE_MARK, oldMark, newMark);
	}

	public getTransform(): EList<XTransform> {
		return this.transform;
	}

	public getEncoding(): XEncoding {
		return this.encoding;
	}

	public setEncoding(newEncoding: XEncoding) {
		let oldEncoding = this.encoding;
		this.encoding = newEncoding;
		this.eSetNotify(XUnitSpec.FEATURE_ENCODING, oldEncoding, newEncoding);
	}

}