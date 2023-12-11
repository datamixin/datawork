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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

import VisageConstant from "bekasi/visage/VisageConstant";
import VisageStructure from "bekasi/visage/VisageStructure";
import VisageListMetadata from "bekasi/visage/VisageListMetadata";

export default class VisageList extends VisageStructure {

	public static LEAN_NAME = "VisageList";

	private metadata: VisageListMetadata = null;
	private itemType: string = null;
	private values: Lean[] = [];
	private parts: number[] = [0];

	constructor() {
		super(VisageList.LEAN_NAME);
	}

	public getItemType(): string {
		return this.itemType;
	}

	public getMetadata(): VisageListMetadata {
		return this.metadata;
	}

	public size(): number {
		return this.values.length;
	}

	public get(index: number): Lean {
		return this.values[index] || null;
	}

	public getValues(): Lean[] {
		return this.values;
	}

	public add(element: Lean, index?: number): void {
		if (index === undefined) {
			this.values.push(element);
		} else {
			this.values.splice(index, 0, element);
		}
	}

	public listParts(): number[] {
		let parts: number[] = [];
		for (let part of this.parts) {
			parts.push(part);
		}
		return parts;
	}

	public getElementObject(index: number): any {
		let value = this.values[index];
		if (value instanceof VisageConstant) {
			return value.getValue();
		} else if (value instanceof VisageStructure) {
			return value.toValue();
		} else {
			return value;
		}
	}

	public toArray(): any[] {
		let list: any[] = [];
		for (let i = 0; i < this.values.length; i++) {
			let object = this.getElementObject(i);
			list.push(object);
		}
		return list;
	}

	public toValue(): any {
		return this.toArray();
	}

	public toString(): string {
		return "{size: " + this.values.length + "}";
	}

}

jsonLeanFactory.register(VisageList.LEAN_NAME, VisageList);