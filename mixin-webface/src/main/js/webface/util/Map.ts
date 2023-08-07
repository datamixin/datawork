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
import MapEntry from "webface/util/MapEntry";

export interface Map<V> {

    put(key: string, value: V): void;

    get(key: string): V;

    containsKey(key: string): boolean;

    keySet(): string[];

    getKeyFromValue(value: V): string;

    remove(key: string): V;

    entries(): MapEntry<V>[];

    values(): V[];

    size: number;

    clear(): void;

}

export default Map;