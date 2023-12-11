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
import VisageList from "bekasi/visage/VisageList";
import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageTable from "bekasi/visage/VisageTable";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageObject from "bekasi/visage/VisageObject";
import VisageLogical from "bekasi/visage/VisageLogical";
import VisageConstant from "bekasi/visage/VisageConstant";

import { expressionFactory as factory } from "sleman/ExpressionFactory";

import Provision from "padang/provisions/Provision";

export abstract class Examination {

	public createOptions(provision: Provision): { [name: string]: any } {
		let names = Object.keys(provision);
		let map: { [name: string]: any } = {};
		for (let name of names) {
			if (name === "provisionName") {
				continue;
			}
			let object = provision[name];
			map[name] = factory.createValue(object);
		}
		return map;
	}

	public convertValue(value: VisageValue): any {
		return value;
	}

	protected asConstantList(value: VisageValue): (number | string | boolean)[] {
		let list = this.asList(value);
		let array: (number | string | boolean)[] = [];
		for (let value of list) {
			let constant = this.asConstant(value);
			array.push(constant);
		}
		return array;
	}

	protected asList(value: VisageValue): any[] {
		if (value instanceof VisageList) {
			return value.getValues();
		}
		throw new Error("Value expected to be a list, actually is " + value);
	}

	protected asValueMap(value: VisageValue): Map<string, any> {
		if (value instanceof VisageObject) {
			let map = value.getObjectMap();
			return map;
		}
		throw new Error("Value expected to be an object, actually is " + value);
	}

	protected asMapOfMap(value: VisageValue): Map<string, Map<string, any>> {
		if (value instanceof VisageObject) {
			let map = value.getObjectMap();
			let result = new Map<string, Map<string, any>>();
			for (let key of result.keys()) {
				let value = <Map<string, any>>map.get(key);
				result.set(key, value);
			}
			return result;
		}
		throw new Error("Value expected to be an object, actually is " + value);
	}

	protected asTable(value: VisageValue): VisageTable {
		if (value instanceof VisageTable) {
			return value;
		}
		throw new Error("Value expected to be a table, actually is " + value);
	}

	protected asMapList(value: VisageValue): Map<string, any>[] {
		let list = this.asList(value);
		let array: Map<string, any>[] = [];
		for (let value of list) {
			let map = this.asValueMap(value);
			array.push(map);
		}
		return array;
	}

	protected asTextList(value: VisageValue): string[] {
		let list = this.asList(value);
		let array: string[] = [];
		for (let value of list) {
			let str = this.asText(value);
			array.push(str);
		}
		return array;
	}

	protected asNumberList(value: VisageValue): number[] {
		let list = this.asList(value);
		let array: number[] = [];
		for (let value of list) {
			let object = this.asNumber(value);
			array.push(object);
		}
		return array;
	}

	protected asConstant(value: VisageValue): number | string | boolean {
		if (value instanceof VisageConstant) {
			return value.getValue();
		}
		throw new Error("Value expected to be a number, actually is " + value);
	}

	protected asText(value: VisageValue): string {
		if (value instanceof VisageText) {
			return value.getValue();
		}
		throw new Error("Value expected to be a text, actually is " + value);
	}

	protected asNumber(value: VisageValue): number {
		if (value instanceof VisageNumber) {
			return value.getValue();
		}
		throw new Error("Value expected to be a number, actually is " + value);
	}

	protected asLogical(value: VisageValue): boolean {
		if (value instanceof VisageLogical) {
			return value.getValue();
		}
		throw new Error("Value expected to be a logical, actually is " + value);
	}

	protected asRowMap(value: VisageValue): Map<any, VisageValue[]> {
		let table = this.asTable(value);
		let map = new Map<any, any[]>();
		let recordCount = table.recordCount();
		for (let i = 0; i < recordCount; i++) {
			let record = table.getRecord(i);
			let values = record.getValues();
			let keyLean = <VisageConstant>values.shift();
			let key = keyLean.getValue();
			let objects: VisageValue[] = [];
			for (let value of values) {
				objects.push(value);
			}
			map.set(key, objects);
		}
		return map;
	}
}

export default Examination;