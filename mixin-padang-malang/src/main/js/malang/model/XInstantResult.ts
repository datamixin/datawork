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
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "malang/model/model";
import XParameter from "malang/model/XParameter";

export default class XInstantResult extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XInstantResult");

	public static FEATURE_PRELOAD = new EAttribute("preload", EAttribute.STRING);
	public static FEATURE_PARAMETERS = new EReference("parameters", XParameter);
	public static FEATURE_WIDTH = new EAttribute("width", EAttribute.NUMBER);
	public static FEATURE_HEIGHT = new EAttribute("height", EAttribute.NUMBER);

	private preload: string = null;
	private parameters = new BasicEList<XParameter>(this, XInstantResult.FEATURE_PARAMETERS);
	private width: number = null;
	private height: number = null;

	constructor() {
		super(model.createEClass(XInstantResult.XCLASSNAME), [
			XInstantResult.FEATURE_PRELOAD,
			XInstantResult.FEATURE_PARAMETERS,
			XInstantResult.FEATURE_WIDTH,
			XInstantResult.FEATURE_HEIGHT,
		]);
	}

	public getPreload(): string {
		return this.preload;
	}

	public setPreload(newPreload: string): void {
		let oldPreload = this.preload;
		this.preload = newPreload;
		this.eSetNotify(XInstantResult.FEATURE_PRELOAD, oldPreload, newPreload);
	}

	public getParameters(): EList<XParameter> {
		return this.parameters;
	}

	public getWidth(): number {
		return this.width;
	}

	public setWidth(newWidth: number): void {
		let oldWidth = this.width;
		this.width = newWidth;
		this.eSetNotify(XInstantResult.FEATURE_WIDTH, oldWidth, newWidth);
	}

	public getHeight(): number {
		return this.height;
	}

	public setHeight(newHeight: number): void {
		let oldHeight = this.height;
		this.height = newHeight;
		this.eSetNotify(XInstantResult.FEATURE_HEIGHT, oldHeight, newHeight);
	}

}
