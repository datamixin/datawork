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
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";

export default class XFacetEncodingFieldDef extends XFacetFieldDef {

	public static XCLASSNAME: string = model.getEClassName("XFacetEncodingFieldDef");

	public static FEATURE_COLUMNS = new EAttribute("columns", EAttribute.NUMBER);

	private columns: number = null;

	constructor() {
		super(model.createEClass(XFacetEncodingFieldDef.XCLASSNAME), [
			XFacetEncodingFieldDef.FEATURE_COLUMNS,
		]);
	}

	public getColumns(): number {
		return this.columns;
	}

	public setColumns(newColumns: number): void {
		let oldColumns = this.columns;
		this.columns = newColumns;
		this.eSetNotify(XFacetEncodingFieldDef.FEATURE_COLUMNS, oldColumns, newColumns);
	}

}
