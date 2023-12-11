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
import ObjectMap from "webface/util/ObjectMap";

import { jsonLeanFactory } from "webface/constants";

import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageLogical from "bekasi/visage/VisageLogical";
import VisageConstant from "bekasi/visage/VisageConstant";
import VisageStructure from "bekasi/visage/VisageStructure";

export default class VisageObject extends VisageStructure {

	public static LEAN_NAME = "VisageObject";

	private fields = new ObjectMap<VisageValue>();

	constructor() {
		super(VisageObject.LEAN_NAME);
	}

	public fieldNames(): string[] {
		return this.fields.keySet();
	}

	public getField(name: string): VisageValue {
		return this.fields.get(name);
	}

	public setField(name: string, value: any): void {
		if (typeof (value) === "string") {
			this.fields.put(name, new VisageText(value));
		} else if (typeof (value) === "number") {
			this.fields.put(name, new VisageNumber(value));
		} else if (typeof (value) === "boolean") {
			this.fields.put(name, new VisageLogical(value));
		} else {
			this.fields.put(name, value);
		}
	}

	public containsField(name: string): boolean {
		return this.fields.containsKey(name);
	}

	public getFieldObject(name: string): any {
		let value = this.fields.get(name) || null;
		if (value instanceof VisageConstant) {
			return value.getValue();
		} else if (value instanceof VisageStructure) {
			return value.toValue();
		} else {
			return value;
		}
	}

	public getObjectMap(): Map<string, any> {
		let map = new Map<string, any>();
		let names = this.fieldNames();
		for (let name of names) {
			let field = this.getFieldObject(name);
			map.set(name, field);
		}
		return map;
	}

	public toObject(): any {
		let object = {};
		let names = this.fieldNames();
		for (let name of names) {
			object[name] = this.getFieldObject(name);
		}
		return object;
	}

	public toValue(): any {
		return this.toObject();
	}

	public toString(): string {
		return this.fields.toString();
	}

}

jsonLeanFactory.register(VisageObject.LEAN_NAME, VisageObject);