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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";

export abstract class XFacetMapping extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XFacetMapping");

	public static FEATURE_ROW = new EReference("row", XFacetFieldDef);
	public static FEATURE_COLUMN = new EReference("column", XFacetFieldDef);

	private row: XFacetFieldDef = null;
	private column: XFacetFieldDef = null;

	private static FEATURES = new Array<EFeature>(
		XFacetMapping.FEATURE_ROW,
		XFacetMapping.FEATURE_COLUMN,
	);

	constructor(xClass?: EClass, features?: EFeature[]) {
		super(
			xClass ? xClass : model.createEClass(XFacetMapping.XCLASSNAME),
			features ? XFacetMapping.FEATURES.concat(features) : XFacetMapping.FEATURES
		);
	}

	public getRow(): XFacetFieldDef {
		return this.row;
	}

	public setRow(newRow: XFacetFieldDef): void {
		let oldRow = this.row;
		this.row = newRow;
		this.eSetNotify(XFacetMapping.FEATURE_ROW, oldRow, newRow);
	}

	public getColumn(): XFacetFieldDef {
		return this.column;
	}

	public setColumn(newColumn: XFacetFieldDef): void {
		let oldColumn = this.column;
		this.column = newColumn;
		this.eSetNotify(XFacetMapping.FEATURE_ROW, oldColumn, newColumn);
	}

}

export default XFacetMapping;