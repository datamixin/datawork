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
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "vegazoo/model/model";
import XViewSpec from "vegazoo/model/XViewSpec";

export default class XHConcatSpec extends XViewSpec {

	public static XCLASSNAME: string = model.getEClassName("XHConcatSpec");

	public static FEATURE_HCONCAT = new EReference("hconcat", XViewSpec);

	private hconcat: EList<XViewSpec> = new BasicEList<XViewSpec>(this, XHConcatSpec.FEATURE_HCONCAT);

	constructor() {
		super(model.createEClass(XHConcatSpec.XCLASSNAME), [
			XHConcatSpec.FEATURE_HCONCAT,
		]);
	}

	public getHconcat(): EList<XViewSpec> {
		return this.hconcat;
	}

}