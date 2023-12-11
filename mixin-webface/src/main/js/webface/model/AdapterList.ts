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
import Adapter from "webface/model/Adapter";

/**
 * Object penampung khusus daftar adapter untuk mendukung fungsi EObject
 */
export default class AdapterList {

    private adapters: Adapter[] = [];

    constructor(adapters?: AdapterList) {
        if (adapters !== undefined) {
            for (let i = 0; i < adapters.size(); i++) {
                let adapter = adapters.get(i);
                this.adapters.push(adapter);
            }
        }
    }

    public get(index: number): Adapter {
        return this.adapters[index];
    }

    public indexOf(adapter: Adapter): number {
        return this.adapters.indexOf(adapter);
    }

    public add(adapter: Adapter): boolean {
        if (this.indexOf(adapter) === -1) {
            this.adapters.push(adapter);
            return true;
        } else {
            return false;
        }
    }

    public remove(adapter: Adapter): boolean {
        let index = this.indexOf(adapter);
        if (index !== -1) {
            this.adapters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    public size(): number {
        return this.adapters.length;
    }
}
