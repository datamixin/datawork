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
import BasicEObject from "webface/model/BasicEObject";

import * as model from "rinjani/model/model";

export class XResult extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XResult");

	public static FEATURE_WIDTH = new EAttribute("width", EAttribute.NUMBER);
	public static FEATURE_HEIGHT = new EAttribute("height", EAttribute.NUMBER);

	private width: number = null;
	private height: number = null;

	constructor() {
		super(model.createEClass(XResult.XCLASSNAME), [
			XResult.FEATURE_WIDTH,
			XResult.FEATURE_HEIGHT,
		]);
	}

	public getWidth(): number {
		return this.width;
	}

	public setWidth(newWidth: number): void {
		let oldWidth = this.width;
		this.width = newWidth;
		this.eSetNotify(XResult.FEATURE_WIDTH, oldWidth, newWidth);
	}

	public getHeight(): number {
		return this.height;
	}

	public setHeight(newHeight: number): void {
		let oldHeight = this.height;
		this.height = newHeight;
		this.eSetNotify(XResult.FEATURE_HEIGHT, oldHeight, newHeight);
	}

}

export default XResult;