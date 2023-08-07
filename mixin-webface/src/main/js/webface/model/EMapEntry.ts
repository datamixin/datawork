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
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

export default class EMapEntry<V> {

    private key: string;
    private value: V;

    private owner: EObject;
    private feature: EFeature;

    constructor(key: string, value: V, owner: EObject, feature: EFeature) {
        this.key = key;
        this.value = value;
        this.owner = owner;
        this.feature = feature;
    }

    public getKey(): string {
        return this.key;
    }

    public getValue(): V {
        return this.value;
    }

    public eOwner(): EObject {
        return this.owner;
    }

    public eFeature(): EFeature {
        return this.feature;
    }

}

