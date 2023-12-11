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
import List from "webface/util/List";

export default class ArrayList<T> implements List<T>{

    private elements: T[] = new Array();

    public add(element: T, index?: number): void {
        if (index !== undefined) {
            this.elements[index] = element;
        } else {
            this.elements[this.elements.length] = element;
        }
    }

    public remove(element: T): boolean {
        let index = this.elements.indexOf(element);
        if (index !== -1) {
            return this.elements.splice(index, 1).length > 0;
        } else {
            return false;
        }
    }

    public indexOf(element: T): number {
        return this.elements.indexOf(element);
    }

    public get size(): number {
        return this.elements.length;
    }

    public get(index: number): T {
        return this.elements[index];
    }

}