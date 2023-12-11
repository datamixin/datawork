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
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";
import EConstraint from "webface/model/EConstraint";

export default class EReferenceConstraint extends EConstraint {

    private reference: EReference = null;
    private feature: EFeature = null;
    private constraints: EConstraint[] = [];

    constructor(reference: EReference, feature: EFeature, constraints: EConstraint[]) {
        super();
        this.reference = reference;
        this.feature = feature;
        this.constraints = constraints;
    }

    public getReference(): EReference {
        return this.reference;
    }

    public getFeature(): EFeature {
        return this.feature;
    }

    public getConstraints(): EConstraint[] {
        return this.constraints;
    }

}
