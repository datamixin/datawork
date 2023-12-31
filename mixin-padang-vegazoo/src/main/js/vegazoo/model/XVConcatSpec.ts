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
import EList from "webface/model/EList";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "vegazoo/model/model";
import XViewSpec from "vegazoo/model/XViewSpec";

export default class XVConcatSpec extends XViewSpec {

    public static XCLASSNAME: string = model.getEClassName("XVConcatSpec");

    public static FEATURE_VCONCAT = new EReference("vconcat", XViewSpec);

    private vconcat: EList<XViewSpec> = new BasicEList<XViewSpec>(this, XVConcatSpec.FEATURE_VCONCAT);

    constructor() {
        super(model.createEClass(XVConcatSpec.XCLASSNAME), [
            XVConcatSpec.FEATURE_VCONCAT,
        ]);
    }

    public getVconcat(): EList<XViewSpec> {
        return this.vconcat;
    }

}