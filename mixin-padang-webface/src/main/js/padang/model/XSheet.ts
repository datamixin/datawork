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
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XForesee from "padang/model/XForesee";

export default class XSheet extends BasicEObject {

    public static XCLASSNAME: string = model.getEClassName("XSheet");

    public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
    public static FEATURE_FORESEE = new EReference("foresee", XForesee);

    private name: string = null;
    private foresee: XForesee = null;

    constructor() {
        super(model.createEClass(XSheet.XCLASSNAME), [
            XSheet.FEATURE_NAME,
            XSheet.FEATURE_FORESEE,
        ]);
    }

    public getName(): string {
        return this.name;
    }

    public setName(newName: string) {
        let oldName = this.name;
        this.name = newName;
        this.eSetNotify(XSheet.FEATURE_NAME, oldName, newName);
    }

    public getForesee(): XForesee {
        return this.foresee;
    }

    public setForesee(newForesee: XForesee): void {
        let oldForesee = this.foresee;
        this.foresee = newForesee;
        this.eSetNotify(XSheet.FEATURE_FORESEE, oldForesee, newForesee);
    }

}
