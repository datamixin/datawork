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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import XInput from "padang/model/XInput";
import XForesee from "padang/model/XForesee";

export abstract class XReceipt extends XForesee {

    public static FEATURE_INPUTS = new EReference("inputs", XInput);

    private inputs: EList<XInput> = new BasicEList<XInput>(this, XReceipt.FEATURE_INPUTS);

    constructor(xClass: EClass, features: EFeature[]) {
        super(xClass, features.concat([
            XReceipt.FEATURE_INPUTS,
        ]));
    }

    public getInputs(): EList<XInput> {
        return this.inputs;
    }

}

export default XReceipt;