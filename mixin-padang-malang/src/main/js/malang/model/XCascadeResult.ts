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

import XResult from "malang/model/XResult";
import * as model from "malang/model/model";

export default class XCascadeResult extends XResult {

	public static XCLASSNAME: string = model.getEClassName("XCascadeResult");

	public static FEATURE_LAYOUT = new EAttribute("layout", EAttribute.STRING);
	public static FEATURE_RESULTS = new EReference("results", XResult);

	private layout: string = null;
	private results = new BasicEList<XResult>(this, XCascadeResult.FEATURE_RESULTS);

	constructor() {
		super(model.createEClass(XCascadeResult.XCLASSNAME), [
			XCascadeResult.FEATURE_LAYOUT,
			XCascadeResult.FEATURE_RESULTS,
		]);
	}

	public getLayout(): string {
		return this.layout;
	}

	public setLayout(newLayout: string): void {
		let oldLayout = this.layout;
		this.layout = newLayout;
		this.eSetNotify(XCascadeResult.FEATURE_LAYOUT, oldLayout, newLayout);
	}

	public getResults(): EList<XResult> {
		return this.results;
	}

}
