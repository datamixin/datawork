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
import XViewlet from "vegazoo/model/XViewlet";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

export default class XVegalite extends XViewlet {

    public static XCLASSNAME = model.getEClassName("XVegalite");

    public static FEATURE_SPEC = new EReference("spec", XTopLevelSpec);

    private spec: XTopLevelSpec = null;

    constructor() {
        super(model.createEClass(XVegalite.XCLASSNAME), [
            XVegalite.FEATURE_SPEC,
        ]);
    }

    public getSpec(): XTopLevelSpec {
        return this.spec;
    }

    public setSpec(newSpec: XTopLevelSpec) {
        let oldSpec = this.spec;
        this.spec = newSpec;
        this.eSetNotify(XVegalite.FEATURE_SPEC, oldSpec, newSpec);
    }

}