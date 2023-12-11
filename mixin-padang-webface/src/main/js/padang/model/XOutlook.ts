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

import * as model from "padang/model/model";
import XViewset from "padang/model/XViewset";
import XForesee from "padang/model/XForesee";

export default class XOutlook extends XForesee {

    public static XCLASSNAME: string = model.getEClassName("XOutlook");

    public static FEATURE_VIEWSET = new EReference("viewset", XViewset);

    private viewset: XViewset = null;

    constructor() {
        super(model.createEClass(XOutlook.XCLASSNAME), [
            XOutlook.FEATURE_VIEWSET,
        ]);
    }

    public getViewset(): XViewset {
        return this.viewset;
    }

    public setViewset(newViewset: XViewset): void {
        let oldViewset = this.viewset;
        this.viewset = newViewset;
        this.eSetNotify(XOutlook.FEATURE_VIEWSET, oldViewset, newViewset);
    }

}