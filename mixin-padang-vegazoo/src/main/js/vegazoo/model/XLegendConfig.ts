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

export default class XLegendConfig extends XObjectDef {

	public static ORIEND_TOP_RIGHT = "top-right";

	public static XCLASSNAME: string = model.getEClassName("XLegendConfig");

	public static FEATURE_TITLE = new EAttribute("title", EAttribute.STRING);
	public static FEATURE_ORIENT = new EAttribute("orient", EAttribute.STRING);
	public static FEATURE_DISABLE = new EAttribute("disable", EAttribute.BOOLEAN);
	public static FEATURE_LABEL_FONT_SIZE = new EAttribute("labelFontSize", EAttribute.NUMBER);

	private title: string = null;
	private orient: string = XLegendConfig.ORIEND_TOP_RIGHT;
	private disable: boolean = null;
	private labelFontSize: number = null;

	constructor() {
		super(model.createEClass(XLegendConfig.XCLASSNAME), [
			XLegendConfig.FEATURE_TITLE,
			XLegendConfig.FEATURE_ORIENT,
			XLegendConfig.FEATURE_DISABLE,
			XLegendConfig.FEATURE_LABEL_FONT_SIZE
		]);
	}

	public getTitle(): string {
		return this.title;
	}

	public setTitle(newTitle: string): void {
		let oldTitle = this.title;
		this.title = newTitle;
		this.eSetNotify(XLegendConfig.FEATURE_TITLE, oldTitle, newTitle);
	}

	public getOrient(): string {
		return this.orient;
	}

	public setOrient(newOrient: string): void {
		let oldOrient = this.orient;
		this.orient = newOrient;
		this.eSetNotify(XLegendConfig.FEATURE_ORIENT, oldOrient, newOrient);
	}

	public isDisable(): boolean {
		return this.disable;
	}

	public setDisable(newDisable: boolean): void {
		let oldDisable = this.disable;
		this.disable = newDisable;
		this.eSetNotify(XLegendConfig.FEATURE_DISABLE, oldDisable, newDisable);
	}

	public getLabelFontSize(): number {
		return this.labelFontSize;
	}

	public setLabelFontSize(newLabelFontSize: number): void {
		let oldLabelFontSize = this.labelFontSize;
		this.labelFontSize = newLabelFontSize;
		this.eSetNotify(XLegendConfig.FEATURE_LABEL_FONT_SIZE, oldLabelFontSize, newLabelFontSize);
	}

}