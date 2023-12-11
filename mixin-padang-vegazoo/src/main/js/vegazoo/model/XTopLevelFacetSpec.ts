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
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XViewSpec from "vegazoo/model/XViewSpec";
import XFacetMapping from "vegazoo/model/XFacetMapping";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";

export default class XTopLevelFacetSpec extends XTopLevelSpec {

	public static XCLASSNAME: string = model.getEClassName("XTopLevelFacetSpec");

	public static FEATURE_FACET = new EReference("facet", XFacetFieldDef);
	public static FEATURE_SPEC = new EReference("spec", XViewSpec);
	public static FEATURE_COLUMNS = new EAttribute("columns", EAttribute.NUMBER);

	private facet: XFacetFieldDef | XFacetMapping = null;
	private spec: XViewSpec = null;
	private columns: number = null;

	constructor() {
		super(model.createEClass(XTopLevelFacetSpec.XCLASSNAME), [
			XTopLevelFacetSpec.FEATURE_FACET,
			XTopLevelFacetSpec.FEATURE_SPEC,
			XTopLevelFacetSpec.FEATURE_COLUMNS,
		]);
	}

	public getFacet(): XFacetFieldDef | XFacetMapping {
		return this.facet;
	}

	public setFacet(newFacet: XFacetFieldDef) {
		let oldFacet = this.facet;
		this.facet = newFacet;
		this.eSetNotify(XTopLevelFacetSpec.FEATURE_FACET, oldFacet, newFacet);
	}

	public getSpec(): XViewSpec {
		return this.spec;
	}

	public setSpec(newSpec: XViewSpec) {
		let oldSpec = this.spec;
		this.spec = newSpec;
		this.eSetNotify(XTopLevelFacetSpec.FEATURE_SPEC, oldSpec, newSpec);
	}

	public getColumns(): number {
		return this.columns;
	}

	public setColumns(newColumns: number): void {
		let oldColumns = this.columns;
		this.columns = newColumns;
		this.eSetNotify(XTopLevelFacetSpec.FEATURE_COLUMNS, oldColumns, newColumns);
	}

}