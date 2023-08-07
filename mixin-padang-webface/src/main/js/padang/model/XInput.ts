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
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";

export default class XInput extends BasicEObject {

    public static XCLASSNAME = model.getEClassName("XInput");

    public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
    public static FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);
    public static FEATURE_FOREPART = new EAttribute("forepart", EAttribute.STRING);
    public static FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

    private name: string = null;
    private value: string = null;
    private forepart: string = null;
    private properties: EMap<string> = new BasicEMap<string>(this, XInput.FEATURE_PROPERTIES);

    constructor() {
        super(model.createEClass(XInput.XCLASSNAME), <EFeature[]>[
            XInput.FEATURE_NAME,
            XInput.FEATURE_VALUE,
            XInput.FEATURE_FOREPART,
            XInput.FEATURE_PROPERTIES
        ]);
    }

    public getName(): string {
        return this.name;
    }

    public setName(newName: string): void {
        let oldName = this.name;
        this.name = newName;
        this.eSetNotify(XInput.FEATURE_NAME, oldName, newName);
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(newValue: string): void {
        let oldValue = this.value;
        this.value = newValue;
        this.eSetNotify(XInput.FEATURE_VALUE, oldValue, newValue);
    }

    public getForepart(): string {
        return this.forepart;
    }

    public setForepart(newForepart: string): void {
        let oldForepart = this.forepart;
        this.value = newForepart;
        this.eSetNotify(XInput.FEATURE_FOREPART, oldForepart, newForepart);
    }

    public getProperties(): EMap<string> {
        return this.properties;
    }

}
