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
export default class MultikeyProperties {

    private map = new Map<string[], any>();

    public getKeys(): IterableIterator<string[]> {
        return this.map.keys();
    }

    public hasKey(newKey: string[]): boolean {
        return this.getKey(newKey) !== null;
    }

    public setValue(newKey: string[], value: any) {
        let oldKey = this.getKey(newKey);
        if (oldKey !== null) {
            this.map.set(oldKey, value);
        } else {
            this.map.set(newKey, value);
        }
    }

    public getValue(newKey: string[]): any {
        let oldKey = this.getKey(newKey);
        if (oldKey !== null) {
            return this.map.get(oldKey);
        } else {
            return null;
        }
    }

    private getKey(newKey: string[]): any {
        for (let oldKey of this.map.keys()) {
            let matched = 0;
            if (oldKey.length === newKey.length) {
                for (let i = 0; i < oldKey.length; i++) {
                    if (oldKey[i] === newKey[i]) {
                        matched++;
                    }
                }
            }
            if (matched === oldKey.length) {
                return oldKey;
            }
        }
        return null;
    }

}