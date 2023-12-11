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
import VisageType from "bekasi/visage/VisageType";
import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageTable from "bekasi/visage/VisageTable";
import VisageObject from "bekasi/visage/VisageObject";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageColumn from "bekasi/visage/VisageColumn";
import VisageLogical from "bekasi/visage/VisageLogical";

export default class VisageValueFactory {

	private static instance = new VisageValueFactory();

	constructor() {
		if (VisageValueFactory.instance) {
			throw new Error("Error: Instantiation failed: Use VisageValueFactory.getInstance() instead of new");
		}
		VisageValueFactory.instance = this;
	}

	public static getInstance(): VisageValueFactory {
		return VisageValueFactory.instance;
	}

	public create(source: any): VisageValue {
		if (source instanceof Array) {
			let list = <any[]>source;
			let result = new VisageList();
			for (let element of list) {
				let lean = this.create(element);
				result.add(lean);
			}
			return result;
		} else if (source instanceof Object) {
			if (source["type"] === VisageTable.LEAN_NAME) {
				let table = new VisageTable();
				let columnKeys = source[VisageTable.COLUMN_KEYS];
				let columnTypes = source[VisageTable.COLUMN_TYPES];
				let columns: VisageColumn[] = [];
				columns.push(new VisageColumn("RowLabel", VisageType.INT64));
				for (let i = 0; i < columnKeys.length; i++) {
					let key = columnKeys[i];
					let type = columnTypes[i];
					let column = new VisageColumn(key, type);
					columns.push(column);
				}
				table.setColumns(columns);
				let records = source[VisageTable.RECORDS];
				for (let i = 0; i < records.length; i++) {
					let values = <any[]>records[i];
					values.splice(0, 0, i);
					table.addRecord(values);
				}
				return table;
			} else {
				let keys = Object.keys(source);
				let result = new VisageObject();
				for (let key of keys) {
					let value = source[key];
					let lean = this.create(value);
					result.setField(key, lean);
				}
				return result;
			}
		} else if (typeof (source) === "string") {
			return new VisageText(<string>source);
		} else if (typeof (source) === "number") {
			return new VisageNumber(<number>source);
		} else if (typeof (source) === "boolean") {
			return new VisageLogical(<boolean>source);
		} else {
			throw "Only accept table, object, list, string, number or boolean";
		}
	}

}