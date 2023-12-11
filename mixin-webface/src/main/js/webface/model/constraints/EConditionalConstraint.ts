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
import EConstraint from "webface/model/EConstraint";

export default class EConditionalConstraint extends EConstraint {

    private logical: EConstraint = null;
    private consequent: EConstraint = null;
    private alternate: EConstraint = null;

    constructor(logical: EConstraint, consequent: EConstraint, alternate?: EConstraint) {
        super();
        this.logical = logical;
        this.consequent = consequent;
        this.alternate = alternate === undefined ? null : alternate;
    }

    public getLogical(): EConstraint {
        return this.logical;
    }

    public getConsequent(): EConstraint {
        return this.consequent;
    }

    public getAlternate(): EConstraint {
        return this.alternate;
    }

}
