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

import * as model from "vegazoo/model/model";
import XEncoding from "vegazoo/model/XEncoding";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

export default class XFacetedEncoding extends XEncoding {

    public static XCLASSNAME: string = model.getEClassName("XFacetedEncoding");

    public static FEATURE_FACET = new EReference("facet", XFacetEncodingFieldDef);
    public static FEATURE_ROW = new EReference("row", XRowColumnEncodingFieldDef);
    public static FEATURE_COLUMN = new EReference("column", XRowColumnEncodingFieldDef);

    private facet: XFacetEncodingFieldDef = null;
    private row: XRowColumnEncodingFieldDef = null;
    private column: XRowColumnEncodingFieldDef = null;

    constructor() {
        super(model.createEClass(XFacetedEncoding.XCLASSNAME), [
            XFacetedEncoding.FEATURE_FACET,
            XFacetedEncoding.FEATURE_ROW,
            XFacetedEncoding.FEATURE_COLUMN,
        ]);
    }

    public getFacet(): XFacetEncodingFieldDef {
        return this.facet;
    }

    public setFacet(newFacet: XFacetEncodingFieldDef) {
        let oldFacet = this.facet;
        this.facet = newFacet;
        this.eSetNotify(XFacetedEncoding.FEATURE_FACET, oldFacet, newFacet);
    }

    public getRow(): XRowColumnEncodingFieldDef {
        return this.row;
    }

    public setRow(newRow: XRowColumnEncodingFieldDef) {
        let oldRow = this.row;
        this.row = newRow;
        this.eSetNotify(XFacetedEncoding.FEATURE_ROW, oldRow, newRow);
    }

    public getColumn(): XRowColumnEncodingFieldDef {
        return this.column;
    }

    public setColumn(newColumn: XRowColumnEncodingFieldDef) {
        let oldColumn = this.column;
        this.column = newColumn;
        this.eSetNotify(XFacetedEncoding.FEATURE_COLUMN, oldColumn, newColumn);
    }

}