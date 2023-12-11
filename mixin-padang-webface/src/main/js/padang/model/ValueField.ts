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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";
import BasicEList from "webface/model/BasicEList";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import PointerField from "padang/model/PointerField";

export abstract class ValueField extends BasicEObject {

    public static XCLASSNAME = model.getEClassName("ValueField");

    public static FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
    public static FEATURE_PROPOSE = new EAttribute("propose", EAttribute.STRING);
    public static FEATURE_DIGEST = new EAttribute("digest", EAttribute.STRING);
    public static FEATURE_LIST = new EReference("list", ValueField);
    public static FEATURE_PREFACE = new EAttribute("preface", EAttribute.STRING);

    private type: string = null;
    private propose: string = null;
    private digest: string = null;
    private preface: string = null;
    private list: EList<PointerField> = new BasicEList<PointerField>(this, ValueField.FEATURE_LIST);

    constructor(xClass: EClass, features: EFeature[]) {
        super(xClass, features.concat([
            ValueField.FEATURE_TYPE,
            ValueField.FEATURE_DIGEST,
            ValueField.FEATURE_LIST,
        ]));
    }

    public getType(): string {
        return this.type;
    }

    public setType(newType: string) {
        let oldType = this.type;
        this.type = newType;
        this.eSetNotify(ValueField.FEATURE_TYPE, oldType, newType);
    }

    public getPropose(): string {
        return this.propose;
    }

    public setPropose(newPropose: string) {
        let oldPropose = this.propose;
        this.propose = newPropose;
        this.eSetNotify(ValueField.FEATURE_TYPE, oldPropose, newPropose);
    }

    public getDigest(): string {
        return this.digest;
    }

    public setDigest(newDigest: string) {
        let oldDigest = this.digest;
        this.digest = newDigest;
        this.eSetNotify(ValueField.FEATURE_DIGEST, oldDigest, newDigest);
    }

    public getPreface(): string {
        return this.preface;
    }

    public setPreface(newPreface: string) {
        let oldPreface = this.preface;
        this.preface = newPreface;
        this.eSetNotify(ValueField.FEATURE_PREFACE, oldPreface, newPreface);
    }

    public getList(): EList<PointerField> {
        return this.list;
    }

}

export default ValueField;
