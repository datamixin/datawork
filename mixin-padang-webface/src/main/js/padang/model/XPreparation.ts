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
import EFeature from "webface/model/EFeature";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";

import XSource from "padang/model/XSource";
import * as model from "padang/model/model";
import XDisplay from "padang/model/XDisplay";
import XMutation from "padang/model/XMutation";

export default class XPreparation extends XSource {

    public static XCLASSNAME = model.getEClassName("XPreparation");

    public static FEATURE_DISPLAY = new EReference("display", XDisplay);
    public static FEATURE_MUTATIONS = new EReference("mutations", XMutation);

    private display: XDisplay = null;
    private mutations: EList<XMutation> = new BasicEList<XMutation>(this, XPreparation.FEATURE_MUTATIONS);

    constructor() {
        super(model.createEClass(XPreparation.XCLASSNAME), <EFeature[]>[
            XPreparation.FEATURE_DISPLAY,
            XPreparation.FEATURE_MUTATIONS,
        ]);
    }

    public getDisplay(): XDisplay {
        return this.display;
    }

    public setDisplay(newDisplay: XDisplay): void {
        let oldDisplay = this.display;
        this.display = newDisplay;
        this.eSetNotify(XPreparation.FEATURE_DISPLAY, oldDisplay, newDisplay);
    }

    public getMutations(): EList<XMutation> {
        return this.mutations;
    }

}