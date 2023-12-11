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
import { jsonLeanFactory } from "webface/constants";

import VisageValue from "bekasi/visage/VisageValue";

export default class VisageType extends VisageValue {

	public static BOOL = "bool";
	public static BOOL_ = "bool_";
	public static BOOLEAN = "boolean";
	public static INT32 = "int32";
	public static INT64 = "int64";
	public static STR = "str";
	public static STRING = "string";
	public static OBJECT = "object";
	public static NUMBER = "number";
	public static FLOAT32 = "float32";
	public static FLOAT64 = "float64";
	public static UNKNOWN = "unknown";

	public static DATE = "date";
	public static TIME = "time";
	public static DURATION = "duration";
	public static TIMESTAMP = "timestamp";
	public static DATETIME = "datetime";
	public static DATETIME64 = "datetime64";

	public static LIST = "list";
	public static TABLE = "table";
	public static COLUMN = "column";

	public static MIXINPLOT = "MIXINPLOT";
	public static MIXINLIST = "MIXINLIST";
	public static MIXINTABLE = "MIXINTABLE";
	public static MIXINOBJECT = "MIXINOBJECT";

	public static NUMBERS = [
		VisageType.INT32,
		VisageType.INT64,
		VisageType.NUMBER,
		VisageType.FLOAT32,
		VisageType.FLOAT64,
	];

	public static LABEL_TYPE_MAP = {
		String: VisageType.STRING,
		Number: VisageType.FLOAT64,
		Boolean: VisageType.BOOL,
	}

	public static NUMERICS = VisageType.NUMBERS.concat([
	]);

	public static CATEGORIES = [
		VisageType.STR,
		VisageType.STRING,
		VisageType.BOOL,
		VisageType.BOOL_,
		VisageType.BOOLEAN,
	];

	public static TEMPORALS = [
		VisageType.DATE,
		VisageType.TIME,
		VisageType.DATETIME,
		VisageType.DATETIME64,
		VisageType.TIMESTAMP,
	];

	public static LEAN_NAME = "VisageType";

	private name: string = null;

	constructor(name?: string) {
		super(VisageType.LEAN_NAME);
		this.name = name === undefined ? null : name;
	}

	public setName(value: string): void {
		this.name = value;
	}

	public getName(): string {
		return this.name;
	}

	public toObject(): string {
		return this.name;
	}

	public toString(): string {
		return this.name;
	}

	public toLiteral(): string {
		return this.name;
	}

	public static isMetric(type: string): boolean {
		let lowercase = type.toLowerCase();
		return VisageType.NUMERICS.indexOf(lowercase) !== -1;
	}

	public static isTemporal(type: string): boolean {
		let lowercase = type.toLowerCase();
		let timestamp = VisageType.isTimestamp(lowercase);
		let datetime = VisageType.isDatetime(lowercase);
		let date = VisageType.isDate(lowercase);
		return timestamp || datetime || date;
	}

	public static isCategory(type: string): boolean {
		let lowercase = type.toLowerCase()
		return VisageType.CATEGORIES.indexOf(lowercase) !== -1;
	}

	public static isNumeric(type: string): boolean {
		let lowercase = type.toLowerCase()
		return VisageType.NUMBERS.indexOf(lowercase) !== -1;
	}

	public static isDate(type: string): boolean {
		let lowercase = type.toLowerCase()
		return VisageType.DATE === lowercase;
	}

	public static isDatetime(type: string): boolean {
		let lowercase = type.toLowerCase()
		return VisageType.DATETIME === lowercase || VisageType.DATETIME64 === lowercase;
	}

	public static isTimestamp(type: string): boolean {
		let lowercase = type.toLowerCase()
		return VisageType.TIMESTAMP === lowercase;
	}

	public static isNumericOrCategory(type: string): boolean {
		return VisageType.isNumeric(type) || VisageType.isCategory(type);
	}

	public static isList(type: string): boolean {
		let name = type.toLowerCase()
		return VisageType.LIST === name || VisageType.MIXINLIST === name;
	}

	public static isTable(type: string): boolean {
		let name = type.toLowerCase()
		return VisageType.TABLE === name || VisageType.MIXINTABLE === name;
	}

	public static isObject(type: string): boolean {
		let name = type.toLowerCase()
		return VisageType.OBJECT === name || VisageType.MIXINOBJECT === name;
	}

	public static getLabel(type: string): string {
		let labels = Object.keys(VisageType.LABEL_TYPE_MAP);
		for (let label of labels) {
			if (VisageType.LABEL_TYPE_MAP[label] === type) {
				return label;
			}
		}
		return null;
	}

}

jsonLeanFactory.register(VisageType.LEAN_NAME, VisageType);