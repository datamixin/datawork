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
import * as webface from "webface/webface";

import EFeature from "webface/model/EFeature";

export default class EAttribute extends EFeature {

    public static STRING = webface.STRING;
    public static NUMBER = webface.NUMBER;
    public static BOOLEAN = webface.BOOLEAN;

    private type: string = null;

    constructor(id: string, type: string) {
        super(id);
        this.type = type;
    }

    public getType(): string {
        return this.type;
    }

}
