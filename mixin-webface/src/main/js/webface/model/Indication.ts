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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

import FeaturePath from "webface/model/FeaturePath";

export default class Indication extends Lean {

    public static LEAN_NAME = "Indication";

    private path: FeaturePath = null;
    private key: string = null;
    private values: any[] = [];

    constructor() {
        super(Indication.LEAN_NAME);
    }

    public getKey(): string {
        return this.key;
    }

    public getPath(): FeaturePath {
        return this.path;
    }

    public getValues(): any[] {
        return this.values;
    }

}

jsonLeanFactory.register(Indication.LEAN_NAME, Indication);
