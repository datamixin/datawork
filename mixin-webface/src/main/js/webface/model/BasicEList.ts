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

import * as util from "webface/model/util";

import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import Notification from "webface/model/Notification";

export default class BasicEList<T> extends EList<T> implements List<T>{

	private elements: T[] = [];

	constructor(owner: EObject, feature: EFeature) {
		super(owner, feature);
	}

	public get(index: number): T {
		return this.elements[index] || null;
	}

	public set(index: number, element: T) {
		let oldElement = this.elements[index];
		this.delete(element);
		this.elements[index] = element;
		this.owner.notify(Notification.SET, this.feature, oldElement, element, index);
	}

	// Remove terlebih dahulu element dari container sebelumnya.
	private delete(element: T): void {
		if (element instanceof EObject) {
			let eObject = <EObject><any>element;
			util.remove(eObject);
		}
	}

	public add(element: T, index?: number): void {

		this.delete(element);

		if (index === undefined || index == this.elements.length) {

			// Lakukan penambahan di bagian akhir
			this.elements.push(element);
			let position = this.elements.length - 1;
			this.owner.notify(Notification.ADD, this.feature, null, element, position);

		} else if (index >= 0 && index < this.elements.length) {

			// Lakukan penambahan di index tersebut
			let position = index;
			this.elements.splice(index, 0, element);
			this.owner.notify(Notification.ADD, this.feature, null, element, position);

		} else {

			// Lakukan penambahan di akhir elements
			let position = this.elements.length;
			this.elements.push(element);
			this.owner.notify(Notification.ADD, this.feature, null, element, position);
		}
	}

	public remove(element: T): boolean {
		let position = this.elements.indexOf(element);
		if (position !== -1) {
			let removed = this.elements.splice(position, 1);
			this.owner.notify(Notification.REMOVE, this.feature, element, null, position);
			return removed.length > 0;
		} else {
			return false;
		}
	}

	public removeChild(child: T): void {
		this.remove(child);
	}

	public move(element: T, index: number): void {
		let position = this.elements.indexOf(element);
		if (position !== -1) {
			let removed = this.elements.splice(position, 1)[0];
			this.elements.splice(index, 0, removed);
			this.owner.notify(Notification.MOVE, this.feature, position, index, position);
		}
	}

	public indexOf(element: T): number {
		return this.elements.indexOf(element);
	}

	public get size(): number {
		return this.elements.length;
	}

	public forEach(callback: (element: T, index: number) => void): void {
		for (var i = 0; i < this.elements.length; i++) {
			let element = this.elements[i];
			callback(element, i);
		}
	}

	public clear(): void {
		let elements = this.doClear();
		this.owner.notify(Notification.REMOVE_MANY, this.feature, elements, null);
	}

	private doClear(): any[] {
		let elements = this.elements;
		this.elements = [];
		return elements;
	}

	public addAll(elements: T[]): void {
		for (var i = 0; i < elements.length; i++) {
			let element = elements[i];
			this.delete(element);
			this.elements.push(element);
		}
		this.owner.notify(Notification.ADD_MANY, this.feature, null, elements);
	}

	public removeRange(start: number, end: number): void {
		let count = end - start;
		let removed = this.elements.splice(start, count);
		this.owner.notify(Notification.REMOVE_MANY, this.feature, removed, null, start);
	}

	public insertRange(elements: T[], start: number): void {
		for (var i = 0; i < elements.length; i++) {
			let element = elements[i];
			this.delete(element);
			this.elements.splice(start, start + 1, element);
		}
		this.owner.notify(Notification.ADD_MANY, this.feature, null, elements, start);
	}

	public repopulate(elements: T[]): void {
		let removes = this.doClear();
		for (var i = 0; i < elements.length; i++) {
			let element = elements[i];
			this.delete(element);
			this.elements.push(element);
		}
		this.owner.notify(Notification.REPLACE_MANY, this.feature, removes, elements);
	}

	public toArray(): T[] {
		let array: T[] = [];
		for (var i = 0; i < this.elements.length; i++) {
			array[i] = this.elements[i];
		}
		return array;
	}

	public [Symbol.iterator](): Iterator<T> {
		return new BasicEListIterator<T>(this.elements);
	}
}

class BasicEListIterator<T> implements Iterator<T> {

	private index = 0;
	private elements: T[] = null;

	constructor(elements: T[]) {
		this.elements = elements;
	}

	public next(): IteratorResult<T> {
		let done = this.index === this.elements.length;
		return <IteratorResult<T>>{
			done: done,
			value: this.elements[this.index++]
		};
	}

}
