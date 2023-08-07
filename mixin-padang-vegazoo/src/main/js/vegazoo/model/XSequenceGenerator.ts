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

import * as model from "vegazoo/model/model";
import XGenerator from "vegazoo/model/XGenerator";
import XSequenceParams from "vegazoo/model/XSequenceParams";

export default class XSequenceGenerator extends XGenerator {

	public static XCLASSNAME: string = model.getEClassName("XSequenceParams");

	public static FEATURE_SEQUENCE = new EReference("sequence", XSequenceParams);

	private sequence: XSequenceParams = null;

	constructor() {
		super(model.createEClass(XSequenceGenerator.XCLASSNAME), [
			XSequenceGenerator.FEATURE_SEQUENCE,
		]);
	}

	public getSequence(): XSequenceParams {
		return this.sequence;
	}

	public setSequence(newSequence: XSequenceParams): void {
		let oldSequence = this.sequence;
		this.sequence = newSequence;
		this.eSetNotify(XSequenceGenerator.FEATURE_SEQUENCE, oldSequence, newSequence);
	}

}