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
import List from "webface/util/List";
import EHolder from "webface/model/EHolder";

export abstract class EList<T> extends EHolder implements List<T> {

    public abstract get(index: number): T;

    public abstract set(index: number, element: T): void;

    public abstract add(element: T, index?: number): void;

    public abstract remove(element: T): boolean;

    public abstract move(element: T, index: number): void;

    public abstract indexOf(element: T): number;

    public abstract size: number;

    public abstract forEach(callback: (element: T, index: number) => void): void;

    public abstract clear(): void;

    public abstract addAll(elements: T[]): void;

    public abstract removeRange(start: number, end: number): void;

    public abstract insertRange(elements: T[], start: number): void;

    public abstract repopulate(elements: T[]): void;

    public abstract toArray(): T[];

    public abstract [Symbol.iterator](): Iterator<T>;

}

export default EList;

