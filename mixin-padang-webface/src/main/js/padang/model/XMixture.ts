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
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";

import XPart from "padang/model/XPart";
import * as model from "padang/model/model";

export default class XMixture extends XPart {

	public static XCLASSNAME: string = model.getEClassName("XMixture");

	public static FEATURE_LAYOUT = new EReference("layout", EAttribute.STRING);
	public static FEATURE_PARTS = new EReference("parts", XPart);
	public static FEATURE_WEIGHTS = new EReference("weights", EAttribute.STRING);

	private layout: string = null;
	private parts: EList<XPart> = new BasicEList<XPart>(this, XMixture.FEATURE_PARTS);
	private weights: string = null;

	constructor() {
		super(model.createEClass(XMixture.XCLASSNAME), [
			XMixture.FEATURE_LAYOUT,
			XMixture.FEATURE_PARTS,
			XMixture.FEATURE_WEIGHTS,
		]);
	}

	public getLayout(): string {
		return this.layout;
	}

	public setLayout(newLayout: string) {
		let oldLayout = this.layout;
		this.layout = newLayout;
		this.eSetNotify(XMixture.FEATURE_LAYOUT, oldLayout, newLayout);
	}

	public getParts(): EList<XPart> {
		return this.parts;
	}

	public getWeights(): string {
		return this.weights;
	}

	public setWeights(newWeights: string) {
		let oldWeights = this.weights;
		this.weights = newWeights;
		this.eSetNotify(XMixture.FEATURE_WEIGHTS, oldWeights, newWeights);
	}

}