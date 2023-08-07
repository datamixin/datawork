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
import EMap from "webface/model/EMap";
import EFeature from "webface/model/EFeature";
import BasicEMap from "webface/model/BasicEMap";
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";

import XSource from "padang/model/XSource";
import * as model from "padang/model/model";
import XDisplay from "padang/model/XDisplay";
import XReceipt from "padang/model/XReceipt";

export default class XDataset extends XReceipt {

    public static XCLASSNAME = model.getEClassName("XDataset");

    public static FEATURE_SOURCE = new EReference("source", XSource);
    public static FEATURE_DISPLAY = new EReference("display", XDisplay);
    public static FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

    private source: XSource = null;
    private display: XDisplay = null;
    private properties: EMap<string> = new BasicEMap<string>(this, XDataset.FEATURE_PROPERTIES);

    constructor() {
        super(model.createEClass(XDataset.XCLASSNAME), <EFeature[]>[
            XDataset.FEATURE_SOURCE,
            XDataset.FEATURE_DISPLAY,
            XDataset.FEATURE_PROPERTIES
        ]);
    }

    public getSource(): XSource {
        return this.source;
    }

    public setSource(newSource: XSource): void {
        let oldSource = this.source;
        this.source = newSource;
        this.eSetNotify(XDataset.FEATURE_SOURCE, oldSource, newSource);
    }

    public getDisplay(): XDisplay {
        return this.display;
    }

    public setDisplay(newDisplay: XDisplay): void {
        let oldDisplay = this.display;
        this.display = newDisplay;
        this.eSetNotify(XDataset.FEATURE_DISPLAY, oldDisplay, newDisplay);
    }

    public getProperties(): EMap<string> {
        return this.properties;
    }

}
