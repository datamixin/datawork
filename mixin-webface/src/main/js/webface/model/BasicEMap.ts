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
import EMap from "webface/model/EMap";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import EMapEntry from "webface/model/EMapEntry";
import Notification from "webface/model/Notification";

export default class BasicEMap<V> extends EMap<V> {

	private map: { [key: string]: any } = {};

	constructor(owner: EObject, feature: EFeature) {
		super(owner, feature);
	}

	public containsKey(key: string): boolean {
		return this.map[key] !== undefined;
	}

	public get(key: string): V {
		let value = this.map[key];
		if (value === undefined) {
			return null;
		}
		return value;
	}

	public put(key: string, value: V): void {
		let oldElement = this.map[key] || null;
		this.delete(value);
		this.map[key] = value;
		this.owner.notify(Notification.SET, this.feature, oldElement, value, undefined, key);
	}

	public putAll(map: EMap<V>): void {
		let keys = map.keySet();
		for (var i = 0; i < keys.length; i++) {
			let key = keys[i];
			let oldElement = this.map[key] || null;
			let value = map.get(key);
			this.delete(value);
			this.map[key] = value;
			this.owner.notify(Notification.SET, this.feature, oldElement, value, undefined, key);
		}
	}

	public keySet(): string[] {
		return Object.keys(this.map);
	}

	public entries(): EMapEntry<V>[] {
		let entries: EMapEntry<V>[] = [];
		let keys = this.keySet();
		for (var i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.map[key];
			entries.push(new EMapEntry(key, value, this.owner, this.feature));
		}
		return entries;
	}

	public valueMap(): { [key: string]: string } {
		let map: { [key: string]: string } = {};
		let keys = this.keySet();
		for (let key of keys) {
			let value = this.map[key];
			map[key] = value;
		}
		return map;
	}

	// Remove terlebih dahulu element dari container sebelumnya.
	public delete(value: V | EObject): void {
		if (value instanceof EObject) {
			let eObject = <EObject><any>value;
			util.remove(eObject);
		}
	}

	public removeChild(value: V): void {
		this.removeValue(value);
	}

	public remove(key: string): void {
		let value = this.map[key];
		if (value !== undefined) {
			delete this.map[key];
			this.owner.notify(Notification.REMOVE, this.feature, value, null, undefined, key);
		}
	}

	public size(): number {
		return this.keySet().length;
	}

	public clear(): void {
		let removes = this.doClear();
		this.owner.notify(Notification.REMOVE_MANY, this.feature, removes, null);
	}

	private doClear(): { [key: string]: any } {
		let keys = this.keySet();
		let removes: { [key: string]: any } = {};
		for (var i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.map[key];
			removes[key] = value;
			delete this.map[key];
		}
		return removes;
	}

	public removeValue(value: V): void {
		let keys = this.keySet();
		for (var i = 0; i < keys.length; i++) {
			let key = keys[i];
			let val = this.map[key];
			if (val === value) {
				delete this.map[key];
				break;
			}
		}
	}

	public repopulate(entries: { [key: string]: any }): void {
		let removes = this.doClear();
		let keys = Object.keys(entries);
		for (let key of keys) {
			this.map[key] = entries[key];
		}
		this.owner.notify(Notification.REPLACE_MANY, this.feature, removes, entries);
	}

	public toString(): string {
		return this.map.toString();
	}
}
