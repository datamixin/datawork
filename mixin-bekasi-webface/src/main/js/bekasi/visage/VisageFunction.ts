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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";

export default class VisageFunction extends VisageValue {

    public static LEAN_NAME = "VisageFunction";

    private type: string = null;
    private literal: string = null;

    constructor(type?: string, literal?: string) {
        super(VisageFunction.LEAN_NAME);
        this.type = type ? type : null;
        this.literal = literal ? literal : null;
    }

    public getType(): string {
        return this.type;
    }

    public getLiteral(): string {
        return this.literal;
    }

    public toString(): string {
        return this.literal;
    }

}

jsonLeanFactory.register(VisageFunction.LEAN_NAME, VisageFunction);