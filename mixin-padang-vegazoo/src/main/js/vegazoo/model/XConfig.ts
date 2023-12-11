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
import EMap from "webface/model/EMap";
import BasicEMap from "webface/model/BasicEMap";
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "vegazoo/model/model";
import XViewConfig from "vegazoo/model/XViewConfig";
import XAxisConfig from "vegazoo/model/XAxisConfig";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XAnyMarkConfig from "vegazoo/model/XAnyMarkConfig";

export default class XConfig extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XConfig");

	public static FEATURE_VIEW = new EReference("view", XViewConfig);
	public static FEATURE_AXIS_X = new EReference("axisX", XAxisConfig);
	public static FEATURE_LEGEND = new EReference("legend", XLegendConfig);
	public static FEATURE_STYLE = new EReference("style", XAnyMarkConfig);

	private view: XViewConfig = null;
	private axisX: XAxisConfig = null;
	private legend: XLegendConfig = null;
	private style = new BasicEMap<XAnyMarkConfig>(this, XConfig.FEATURE_STYLE);

	constructor() {
		super(model.createEClass(XConfig.XCLASSNAME), [
			XConfig.FEATURE_VIEW,
			XConfig.FEATURE_AXIS_X,
			XConfig.FEATURE_LEGEND,
			XConfig.FEATURE_STYLE,
		]);
	}

	public getView(): XViewConfig {
		return this.view;
	}

	public setView(newView: XViewConfig): void {
		let oldView = this.view;
		this.view = newView;
		this.eSetNotify(XConfig.FEATURE_VIEW, oldView, newView);
	}

	public getAxisX(): XAxisConfig {
		return this.axisX;
	}

	public setAxisX(newAxisX: XAxisConfig): void {
		let oldAxisX = this.axisX;
		this.axisX = newAxisX;
		this.eSetNotify(XConfig.FEATURE_AXIS_X, oldAxisX, newAxisX);
	}

	public getLegend(): XLegendConfig {
		return this.legend;
	}

	public setLegend(newLegend: XLegendConfig): void {
		let oldLegend = this.legend;
		this.legend = newLegend;
		this.eSetNotify(XConfig.FEATURE_LEGEND, oldLegend, newLegend);
	}

	public getStyle(): EMap<XAnyMarkConfig> {
		return this.style;
	}

}