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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import XData from "vegazoo/model/XData";
import XConfig from "vegazoo/model/XConfig";
import * as model from "vegazoo/model/model";
import XTransform from "vegazoo/model/XTransform";
import XObjectDef from "vegazoo/model/XObjectDef";

export abstract class XTopLevelSpec extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XTopLevelSpec");

	public static FEATURE_TITLE = new EAttribute("title", EAttribute.STRING);
	public static FEATURE_DATA = new EReference("data", XData);
	public static FEATURE_TRANSFORM = new EReference("transform", XTransform);
	public static FEATURE_CONFIG = new EReference("config", XConfig);

	private title: string = null;
	private data: XData = null;
	private transform: EList<XTransform> = new BasicEList<XTransform>(this, XTopLevelSpec.FEATURE_TRANSFORM);
	private config: XConfig = null;

	constructor(xClass: EClass, features: EFeature[]) {
		super(xClass, new Array<EFeature>(
			XTopLevelSpec.FEATURE_TITLE,
			XTopLevelSpec.FEATURE_DATA,
			XTopLevelSpec.FEATURE_TRANSFORM,
			XTopLevelSpec.FEATURE_CONFIG,
		).concat(features));
	}

	public getTitle(): string {
		return this.title;
	}

	public getData(): XData {
		return this.data;
	}

	public setData(newData: XData) {
		let oldData = this.data;
		this.data = newData;
		this.eSetNotify(XTopLevelSpec.FEATURE_DATA, oldData, newData);
	}

	public getTransform(): EList<XTransform> {
		return this.transform;
	}

	public setTitle(newTitle: string): void {
		let oldTitle = this.title;
		this.title = newTitle;
		this.eSetNotify(XTopLevelSpec.FEATURE_TITLE, oldTitle, newTitle);
	}

	public getConfig(): XConfig {
		return this.config;
	}

	public setConfig(newConfig: XConfig) {
		let oldConfig = this.config;
		this.config = newConfig;
		this.eSetNotify(XTopLevelSpec.FEATURE_CONFIG, oldConfig, newConfig);
	}
}

export default XTopLevelSpec;