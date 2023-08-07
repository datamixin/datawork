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
import VisageBytesMetadata from "bekasi/visage/VisageBytesMetadata";

export default class VisageBytes extends VisageValue {

    public static LEAN_NAME = "VisageBytes";

    private metadata: VisageBytesMetadata = null;
    private mediaType: string = null;
    private bytes: string = null;

    constructor() {
        super(VisageBytes.LEAN_NAME);
    }

    public getMetadata(): VisageBytesMetadata {
        return this.metadata;
    }

    public getMediaType(): string {
        return this.mediaType;
    }

    public getBytes(): string {
        return this.bytes;
    }

}

jsonLeanFactory.register(VisageBytes.LEAN_NAME, VisageBytes);