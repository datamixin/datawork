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
import Conductor from "webface/wef/Conductor";

import VisageNull from "bekasi/visage/VisageNull";
import VisageType from "bekasi/visage/VisageType";
import VisageText from "bekasi/visage/VisageText";
import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageLogical from "bekasi/visage/VisageLogical";
import VisageConstant from "bekasi/visage/VisageConstant";
import VisageMutation from "padang/visage/VisageMutation";

import ProvisionFactory from "padang/provisions/ProvisionFactory";

import GridOperations from "padang/grid/GridOperations";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridContentProvider from "padang/grid/GridContentProvider";

import DefaultColumnLabel from "padang/view/DefaultColumnLabel";

import MutationProvisionRequest from "padang/requests/instore/MutationProvisionRequest";
import MutationTextParseRequest from "padang/requests/instore/MutationTextParseRequest";

export default class DataFormContentProvider implements GridContentProvider {

	private editing = false;
	private columnNames: string[] = [];
	private dataVectors: { [column: string]: VisageValue[] } = {};
	private dataTypes: { [column: string]: string } = {};
	private factory = ProvisionFactory.getInstance();
	private rowCount = 0;
	private conductor: Conductor = null;
	private onErrorRaised: (error: VisageError) => void = () => { };
	private onCountChanged: (row: number, column: number) => void = () => { };
	private onContentChanged: (mutation: VisageMutation) => void = () => { };

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

	public getColumnLabels(callback: (labels: GridColumnLabel[]) => void): void {
		if (this.editing === false) {

			let provision = this.factory.createColumnKeys();
			let request = new MutationProvisionRequest(provision);
			this.conductor.submit(request, (columns: string[]) => {

				if (columns instanceof VisageError) {

					this.errorRaised(columns);
					callback([]);

				} else {

					this.columnNames = columns;

					let provision = this.factory.createColumnTypes(0, -1);
					let request = new MutationProvisionRequest(provision);
					this.conductor.submit(request, (types: string[]) => {

						let labels: DefaultColumnLabel[] = [];
						for (let i = 0; i < columns.length; i++) {
							let label = columns[i];
							this.dataVectors[label] = [];
							this.dataTypes[label] = types[i];
							labels.push(new DefaultColumnLabel(label, types[i]))
						}
						callback(labels);

						this.countChanged();

					});
				}
			});
		} else {

			let labels: DefaultColumnLabel[] = [];
			for (let i = 0; i < this.columnNames.length; i++) {
				let column = this.columnNames[i];
				let type = this.dataTypes[column];
				labels.push(new DefaultColumnLabel(column, type))
			}
			callback(labels);

		}
	}

	public getRowCount(callback: (count: number) => void): void {
		if (this.editing === false) {
			let provision = this.factory.createRowRange(0, -1, 0, -1);
			let request = new MutationProvisionRequest(provision);
			this.conductor.submit(request, (map: Map<any, VisageValue[]>) => {
				if (map instanceof VisageError) {
					this.errorRaised(map);
					this.rowCount = 0;
				} else {
					let positions = map.keys();
					for (let position of positions) {
						let values = map.get(position);
						for (let i = 0; i < values.length; i++) {
							let column = this.columnNames[i];
							let array = this.dataVectors[column];
							array[position] = values[i];
						}
					}
					this.rowCount = map.size;
				}
				this.countChanged();
				callback(this.rowCount);
				this.editing = true;
			});
		} else {
			let keys = Object.keys(this.dataVectors);
			if (keys.length > 0) {
				let array = this.dataVectors[keys[0]];
				callback(array.length);
			}
		}
	}

	private countChanged(): void {
		let rowCount = 0;
		let columnCount = this.columnNames.length;
		if (columnCount > 0) {
			let keys = Object.keys(this.dataVectors);
			if (keys.length > 0) {
				let array = this.dataVectors[keys[0]];
				rowCount = array.length;
			}
		}
		this.onCountChanged(rowCount, columnCount);
	}

	private errorRaised(error: VisageError): void {
		this.onErrorRaised(error);
	}

	private contentChanged(operation: string, rowStart: number, rowEnd: number,
		columnStart: number, columnEnd: number): void {
		let mutation = new VisageMutation();
		mutation.setOperation(operation);
		mutation.setRowCount(this.rowCount);
		mutation.setRowStart(rowStart);
		mutation.setRowEnd(rowEnd);
		mutation.setColumnCount(this.columnNames.length);
		mutation.setColumnStart(columnStart);
		mutation.setColumnEnd(columnEnd);
		this.onContentChanged(mutation);
	}

	public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
		callback: (map: Map<any, any[]>) => void): void {
		let result = new Map<any, any[]>();
		for (let i = rowStart; i < rowEnd; i++) {
			let values: any[] = [];
			for (let j = columnStart; j < columnEnd; j++) {
				let column = this.columnNames[j];
				let array = this.dataVectors[column];
				values[j] = array[i];
			}
			result.set(i, values);
		}
		callback(result);
	}

	public selectColumnKeys(): string[] {
		return this.columnNames;
	}

	public appendColumn(name: string): void {
		this.columnNames.push(name);
		this.dataTypes[name] = VisageType.STRING;
		let array: any[] = [];
		this.dataVectors[name] = array;
		for (let i = 0; i < this.rowCount; i++) {
			this.addDefaultValue(name);
		}
		this.countChanged();
		let length = this.columnNames.length;
		this.contentChanged(GridOperations.COLUMN_INSERT, 0, this.rowCount, length - 1, length);
	}

	public appendRow(): boolean {
		for (let j = 0; j < this.columnNames.length; j++) {
			let column = this.columnNames[j];
			this.addDefaultValue(column);
		}
		this.rowCount += 1;
		this.contentChanged(GridOperations.ROW_INSERT, this.rowCount - 1, this.rowCount, 0, this.columnNames.length);
		return true;
	}

	private addDefaultValue(column: string): void {
		let vector = this.dataVectors[column];
		let type = this.dataTypes[column];
		if (type === VisageType.STRING) {
			vector.push(new VisageText(""));
		} else if (type === VisageType.FLOAT64) {
			vector.push(new VisageNumber(0));
		} else if (type === VisageType.BOOL) {
			vector.push(new VisageLogical(false));
		} else {
			vector.push(new VisageNull());
		}
	}

	public insertRowRange(start: number, end: number): void {
		for (let i = start; i < end; i++) {
			for (let j = 0; j < this.columnNames.length; j++) {
				let column = this.columnNames[j];
				let array = this.dataVectors[column];
				array.splice(i, 0, null);
			}
			this.rowCount += 1;
		}
		this.contentChanged(GridOperations.ROW_INSERT, start, end, 0, this.columnNames.length);
	}

	public removeRowRange(start: number, end: number): void {
		for (let i = start; i < end; i++) {
			for (let j = 0; j < this.columnNames.length; j++) {
				let column = this.columnNames[j];
				let array = this.dataVectors[column];
				array.splice(i, 1);
			}
			this.rowCount -= 1;
		}
		this.contentChanged(GridOperations.ROW_DELETE, start, end, 0, this.columnNames.length);
	}

	public chanceColumnType(name: string, type: string): void {
		this.dataTypes[name] = type;
		let index = this.columnNames.indexOf(name);
		this.contentChanged(GridOperations.COLUMN_UPDATE, 0, this.rowCount, index, index + 1);
	}

	public removeColumnKeys(names: string[]): void {
		let columnStart = this.columnNames.length;
		let columnEnd = 0;
		for (let name of names) {
			let index = this.columnNames.indexOf(name);
			if (index !== -1) {
				this.columnNames.splice(index, 1);
				delete this.dataVectors[name];
				if (columnStart > index) columnStart = index;
				if (columnEnd < index + 1) columnEnd = index + 1;
			}
		}
		this.contentChanged(GridOperations.COLUMN_DELETE, 0, this.rowCount, columnStart, columnEnd);
	}

	public selectColumnExists(newName: string): boolean {
		return this.columnNames.indexOf(newName) !== -1;
	}

	public renameColumn(oldName: string, newName: string): void {
		let index = this.columnNames.indexOf(oldName);
		if (index !== -1) {

			// Change name
			this.columnNames[index] = newName;

			// Relocate data
			let array = this.dataVectors[oldName];
			delete this.dataVectors[oldName];
			this.dataVectors[newName] = array;

			// Relocate type
			if (this.dataTypes[oldName] !== undefined) {
				let type = this.dataTypes[oldName];
				delete this.dataTypes[oldName];
				this.dataTypes[newName] = type;
			}

			// Notify
			this.contentChanged(GridOperations.COLUMN_UPDATE, 0, this.rowCount, index, index + 1);
		}
	}

	public updateCell(rowPos: number, columnPos: number, newValue: any): void {
		if (typeof (newValue) === "string") {
			let columnName = this.columnNames[columnPos];
			if (this.dataTypes[columnName] === VisageType.STRING) {
				this.updateCellValue(rowPos, columnPos, new VisageText(newValue));
			} else {
				let request = new MutationTextParseRequest(newValue);
				this.conductor.submit(request, (result: VisageConstant) => {
					this.updateCellValue(rowPos, columnPos, result);
				});
			}
		} else {
			this.updateCellValue(rowPos, columnPos, newValue);
		}
	}

	private updateCellValue(rowPos: number, columnPos: number, value: any): void {
		let name = this.columnNames[columnPos];
		let array = this.dataVectors[name];
		array[rowPos] = value;
		this.contentChanged(GridOperations.ROW_UPDATE, rowPos, rowPos + 1, columnPos, columnPos + 1);
	}

	public setOnErrorRaised(callback: (error: VisageError) => void): void {
		this.onErrorRaised = callback;
	}

	public setOnCountChanged(callback: (row: number, column: number) => void): void {
		this.onCountChanged = callback;
	}

	public setOnContentChanged(callback: (mutation: VisageMutation) => void): void {
		this.onContentChanged = callback;
	}

	public getData(): { [column: string]: any[] } {
		let data: { [key: string]: any[] } = {};
		for (let columnName of this.columnNames) {
			let values = this.dataVectors[columnName];
			let record: any[] = [];
			for (let value of values) {
				if (value instanceof VisageConstant) {
					let field = value.getValue();
					record.push(field);
				} else {
					record.push(value);
				}
			}
			data[columnName] = record;
		}
		return data;
	}

	public getTypes(): { [column: string]: string } {
		return this.dataTypes;
	}

}