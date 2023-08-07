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
import FeatureKey from "webface/model/FeatureKey";

import { jsonLeanFactory } from "webface/constants";

export default class ListFeatureKey extends FeatureKey {

    public static LEAN_NAME = "ListFeatureKey";
    public static SEPARATOR = '#';

    private position: number = null;

    constructor(name: string, position: number) {
        super(name, ListFeatureKey.LEAN_NAME);
        if (position !== undefined) {
            this.position = position;
        }
    }

    public getPosition(): number {
        return this.position;
    }

    public toQualified(): string {
        return super.toQualified() + ListFeatureKey.SEPARATOR + this.position;
    }

    public toString(): string {
        return "ListFeatureKey{name=" + this.getName() + ", position=" + this.position + "}";
    }

}

jsonLeanFactory.register(ListFeatureKey.LEAN_NAME, <any>ListFeatureKey);
