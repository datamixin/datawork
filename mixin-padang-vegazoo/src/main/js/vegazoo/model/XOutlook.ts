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
import EObject from "webface/model/EObject";
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "vegazoo/model/model";
import XViewlet from "vegazoo/model/XViewlet";

export default class XOutlook extends BasicEObject {

    public static XCLASSNAME: string = model.getEClassName("XOutlook");

    public static FEATURE_VIEWLET = new EReference("viewlet", EObject);

    private viewlet: XViewlet = null;

    constructor() {
        super(model.createEClass(XOutlook.XCLASSNAME), [
            XOutlook.FEATURE_VIEWLET,
        ]);
    }

    public getViewlet(): XViewlet {
        return this.viewlet;
    }

    public setViewlet(newViewlet: XViewlet) {
        let oldViewlet = this.viewlet;
        this.viewlet = newViewlet;
        this.eSetNotify(XOutlook.FEATURE_VIEWLET, oldViewlet, newViewlet);
    }

}
