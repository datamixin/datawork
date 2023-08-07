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

export default class VisageListMetadata extends VisageValue {

    public static LEAN_NAME = "VisageListMetadata";

    public static UNDETERMINED = -1;

    private elementCount = VisageListMetadata.UNDETERMINED;
    private partElementCount = VisageListMetadata.UNDETERMINED;

    constructor() {
        super(VisageListMetadata.LEAN_NAME);
    }

    public getElementCount(): number {
        return this.elementCount;
    }

    public getPartElementCount(): number {
        return this.partElementCount;
    }

}

jsonLeanFactory.register(VisageListMetadata.LEAN_NAME, VisageListMetadata);