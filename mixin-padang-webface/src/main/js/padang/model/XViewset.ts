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
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XMixture from "padang/model/XMixture";

export default class XViewset extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XViewset");

	public static FEATURE_MIXTURE = new EReference("mixture", XMixture);
	public static FEATURE_SELECTION = new EAttribute("selection", EAttribute.STRING);

	private mixture: XMixture = null;
	private selection: string = null;

	constructor() {
		super(model.createEClass(XViewset.XCLASSNAME), [
			XViewset.FEATURE_MIXTURE,
			XViewset.FEATURE_SELECTION,
		]);
	}

	public getMixture(): XMixture {
		return this.mixture;
	}

	public setMixture(newMixture: XMixture): void {
		let oldMixture = this.mixture;
		this.mixture = newMixture;
		this.eSetNotify(XViewset.FEATURE_MIXTURE, oldMixture, newMixture);
	}

	public getSelection(): string {
		return this.selection;
	}

	public setSelection(newSelection: string) {
		let oldSelection = this.selection;
		this.selection = newSelection;
		this.eSetNotify(XViewset.FEATURE_SELECTION, oldSelection, newSelection);
	}

}