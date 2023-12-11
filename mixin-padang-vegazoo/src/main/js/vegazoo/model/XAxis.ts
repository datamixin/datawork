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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";

export default class XAxis extends XObjectDef {

    public static XCLASSNAME: string = model.getEClassName("XAxis");

    public static FEATURE_LABEL_ANGLE = new EAttribute("labelAngle", EAttribute.NUMBER);

    private labelAngle: number = null;

    constructor() {
        super(model.createEClass(XAxis.XCLASSNAME), [
            XAxis.FEATURE_LABEL_ANGLE
        ]);
    }

    public getLabelAngle(): number {
        return this.labelAngle;
    }

    public setLabelAngle(newLabelAngle: number): void {
        let oldLabelAngle = this.labelAngle;
        this.labelAngle = newLabelAngle;
        this.eSetNotify(XAxis.FEATURE_LABEL_ANGLE, oldLabelAngle, newLabelAngle);
    }

}