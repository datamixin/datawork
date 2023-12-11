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
import FeatureKey from "webface/model/FeatureKey";

import { jsonLeanFactory } from "webface/constants";

export default class MapFeatureKey extends FeatureKey {

    public static LEAN_NAME = "MapFeatureKey";
    public static SEPARATOR = '$';

    private key: string = null;

    constructor(name: string, key: string) {
        super(name, MapFeatureKey.LEAN_NAME);
        if (key !== undefined) {
            this.key = key;
        }
    }

    public getKey(): string {
        return this.key;
    }

    public toQualified(): string {
        return super.toQualified() + MapFeatureKey.SEPARATOR + this.key;
    }

    public toString(): string {
        return "MapFeatureKey{name=" + this.getName() + ", key=" + this.key + "}";
    }

}

jsonLeanFactory.register(MapFeatureKey.LEAN_NAME, <any>MapFeatureKey);
