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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";

export default class XViewConfig extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XViewConfig");

	public static FEATURE_STROKE = new EAttribute("stroke", EAttribute.STRING);

	private stroke: string = null;

	constructor() {
		super(model.createEClass(XViewConfig.XCLASSNAME), [
			XViewConfig.FEATURE_STROKE
		]);
	}

	public getStroke(): string {
		return this.stroke;
	}

	public setStroke(newStroke: string): void {
		let oldStroke = this.stroke;
		this.stroke = newStroke;
		this.eSetNotify(XViewConfig.FEATURE_STROKE, oldStroke, newStroke);
	}

}