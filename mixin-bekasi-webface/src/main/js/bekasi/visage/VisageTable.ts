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

import VisageText from "bekasi/visage/VisageText";
import VisageNull from "bekasi/visage/VisageNull";
import VisageValue from "bekasi/visage/VisageValue";
import VisageRecord from "bekasi/visage/VisageRecord";
import VisageColumn from "bekasi/visage/VisageColumn";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageLogical from "bekasi/visage/VisageLogical";
import VisageTableMetadata from "bekasi/visage/VisageTableMetadata";

export default class VisageTable extends VisageValue {

	public static LEAN_NAME = "VisageTable";

	public static ALL_RECORD_COUNT = "all-record-count";
	public static PART_RECORD_COUNT = "part-record-count";
	public static ORDERED_COLUMNS = "ordered-columns";
	public static COLUMN_KEYS = "columnsKeys";
	public static COLUMN_TYPES = "columnsTypes";
	public static RECORDS = "records";

	private metadata: VisageTableMetadata = null;
	private columnKeys: any[] = [];
	private columns: VisageColumn[] = [];
	private records: VisageRecord[] = [];
	private parts: number[] = [0];

	constructor(columns?: VisageColumn[]) {
		super(VisageTable.LEAN_NAME);
		this.columns = columns === undefined ? [] : columns;
	}

	public getMetadata(): VisageTableMetadata {
		return this.metadata;
	}

	public setColumns(columns: VisageColumn[]) {
		this.columns = columns;
	}

	public getColumns(): VisageColumn[] {
		return this.columns;
	}

	public recordCount(): number {
		return this.records.length;
	}

	public addRecord(values: any[]) {
		let record = new VisageRecord(values);
		this.records.push(record);
	}

	public getRecord(index: number): VisageRecord {
		if (this.columnKeys.length === 0) {
			for (let column of this.columns) {
				let key = column.getKey();
				this.columnKeys.push(key);
			}
		}
		let record = this.records[index] || null;
		if (record !== null) {
			let values = record.getValues();
			let objects: any[] = [];
			for (let i = 0; i < values.length; i++) {
				let value = values[i];
				if (typeof (value) === "number") {
					let object = new VisageNumber(value);
					let column = this.columns[i];
					let subtype = column.getType();
					object.setSubtype(subtype);
					objects.push(object);
				} else if (typeof (value) === "boolean") {
					objects.push(new VisageLogical(value));
				} else if (typeof (value) === "string") {
					objects.push(new VisageText(value));
				} else if (value === null) {
					objects.push(new VisageNull());
				} else {
					objects.push(value);
				}
			}
			let result = new VisageRecord(objects);
			record.setColumns(this.columnKeys);
			return result;
		} else {
			return null;
		}
	}

	public listParts(): number[] {
		let parts: number[] = [];
		for (let part of this.parts) {
			parts.push(part);
		}
		return parts;
	}

	public toString(): string {
		return "Table{" + this.columns.length + " columns " + this.records.length + " rows}";
	}

}

jsonLeanFactory.register(VisageTable.LEAN_NAME, <any>VisageTable);