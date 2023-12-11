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
import EList from "webface/model/EList";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XOption from "padang/model/XOption";

export default class XMutation extends BasicEObject {

    public static XCLASSNAME = model.getEClassName("XMutation");

    public static FEATURE_OPERATION = new EAttribute("operation", EAttribute.STRING);
    public static FEATURE_OPTIONS = new EReference("options", XOption);

    private operation: string = null;
    private options = new BasicEList<XOption>(this, XMutation.FEATURE_OPTIONS);

    constructor() {
        super(model.createEClass(XMutation.XCLASSNAME), <EFeature[]>[
            XMutation.FEATURE_OPERATION,
            XMutation.FEATURE_OPTIONS
        ]);
    }

    public getOperation(): string {
        return this.operation;
    }

    public setOperation(newOperation: string): void {
        let oldOperation = this.operation;
        this.operation = newOperation;
        this.eSetNotify(XMutation.FEATURE_OPERATION, oldOperation, newOperation);
    }

    public getOptions(): EList<XOption> {
        return this.options;
    }

}
