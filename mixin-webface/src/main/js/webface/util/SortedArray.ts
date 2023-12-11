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
export default class SortedArray<V> {

    private array: V[] = [];

    private compare = (a: V, b: V): number => {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    };

    constructor(array?: V[], compare?: (a: V, b: V) => number) {

        this.array = [];
        if (compare) this.compare = compare;

        if (array) {
            let length = array.length;
            let index = 0;
            while (index < length) this.insert(array[index++]);
        }
    }

    public get(index: number): V {
        return this.array[index];
    }

    public length(): number {
        return this.array.length;
    }

    public insert(element: V): void {
        let array = this.array;
        let compare = this.compare;
        let index = array.length;
        array.push(element);

        while (index > 0) {
            let i = index, j = --index;
            if (compare(array[i], array[j]) < 0) {
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }

    public search(element: V): number {

        let array = this.array;
        let compare = this.compare;
        let high = array.length;
        let low = 0;

        while (high > low) {

            let index = (high + low) / 2 >>> 0;
            let ordering = compare(array[index], element);

            if (isNaN(ordering)) {
                throw new Error("Compare result return NaN");
            }

            if (ordering < 0) low = index + 1;
            else if (ordering > 0) high = index;
            else return index;
        }

        return -1;
    }

    private seek(element: V, highLow: boolean, equalsNot: boolean): number {

        let array = this.array;
        let compare = this.compare;
        let high = array.length;
        let low = 0;
        let index = -1;
        let lowIndex = -1;
        let highIndex = array.length;

        while (high > low) {

            index = (high + low) / 2 >>> 0;
            let ordering = compare(array[index], element);

            if (isNaN(ordering)) {
                throw new Error("Compare result return NaN");
            }

            if (ordering < 0) {
                lowIndex = index;
                low = index + 1;
            } else if (ordering > 0) {
                highIndex = index;
                high = index;
            } else {
                if (equalsNot) {
                    return index;
                } else {
                    break;
                }
            }
        }
        if (index === -1) {
            return -1;
        } else {
            if (highLow) {
                if (highIndex === array.length) {
                    return index + 1 === array.length ? -1 : index + 1;
                } else {
                    return highIndex;
                }
            } else {
                if (lowIndex === -1) {
                    return index - 1
                } else {
                    return lowIndex;
                }
            }
        }
    }

    public floor(element: V): number {
        return this.seek(element, false, true);
    }

    public lower(element: V): number {
        return this.seek(element, false, false);
    }

    public ceiling(element: V): number {
        return this.seek(element, true, true);
    }

    public higher(element: V): number {
        return this.seek(element, true, false);
    }

    public remove(element: V): void {
        let index = this.search(element);
        if (index >= 0) this.array.splice(index, 1);
    }
}
