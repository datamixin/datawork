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
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";

import * as model from "padang/model/model";
import ValueField from "padang/model/ValueField";

export default class PointerField extends ValueField {

    public static XCLASSNAME = model.getEClassName("PointerField");

    public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);

    private name: string = null;

    constructor() {
        super(model.createEClass(PointerField.XCLASSNAME), <EFeature[]>[
            PointerField.FEATURE_NAME
        ]);
    }

    public getName(): string {
        return this.name;
    }

    public setName(newName: string) {
        let oldName = this.name;
        this.name = newName;
        this.eSetNotify(ValueField.FEATURE_TYPE, oldName, newName);
    }

}
