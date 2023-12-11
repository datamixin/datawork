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
import Map from "webface/util/Map";
import MapEntry from "webface/util/MapEntry";

export default class ObjectMap<V> implements Map<V> {

    private map: { [key: string]: V } = {};

    public constructor(map?: { [key: string]: V }) {
        if (map) {
            let keys = Object.keys(map);
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i];
                this.map[key] = map[key];
            }
        }
    }

    public put(key: string, value: V): void {
        this.map[key] = value;
    }

    public get(key: string): V {
        let value = this.map[key];
        if (value === undefined) {
            return null;
        }
        return value;
    }

    public containsKey(key: string): boolean {
        return this.map[key] !== undefined;
    }

    public keySet(): string[] {
        return Object.keys(this.map);
    }

    public getKeyFromValue(value: V): string {
        let keys = this.keySet();
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (this.map[key] === value) {
                return key;
            }
        }
        return null;
    }

    public remove(key: string): V {
        let value = this.map[key];
        delete this.map[key];
        return value;
    }

    public entries(): MapEntry<V>[] {
        let entries: MapEntry<V>[] = [];
        let keys = this.keySet();
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = this.map[key];
            entries.push(new MapEntry(key, value));
        }
        return entries;
    }

    public values(): V[] {
        let values: V[] = [];
        let keys = this.keySet();
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = this.map[key];
            values.push(value);
        }
        return values;
    }

    public copy(): Map<V> {
        return new ObjectMap<V>(this.map);
    }

    public get size(): number {
        return this.keySet().length;
    }

    public clear(): void {
        this.map = {};
    }

    public toString(): string {
        return JSON.stringify(this.map);
    }

}
