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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";

export default class VisageBytesMetadata extends VisageValue {

    public static LEAN_NAME = "VisageBytesMetadata";

    private byteCount = 0;

    constructor() {
        super(VisageBytesMetadata.LEAN_NAME);
    }

    public getByteCount(): number {
        return this.byteCount;
    }

}

jsonLeanFactory.register(VisageBytesMetadata.LEAN_NAME, VisageBytesMetadata);