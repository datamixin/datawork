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
import VisageConstant from "bekasi/visage/VisageConstant";
import VisageTable from "bekasi/visage/VisageTable";

export default class TableConverter {

	public convertToJsonspec(table: VisageTable): any {

		// Baca dataset
		let result: any[] = [];
		for (let i = 0; i < table.recordCount(); i++) {
			let columns = table.getColumns();
			let record = table.getRecord(i);
			let values = record.getValues();
			let object: any = {};
			for (let j = 0; j < columns.length; j++) {
				let column = columns[j];
				let key = column.getKey();
				let value = values[j];
				if (value instanceof VisageConstant) {
					object[key] = value.getValue();
				} else {
					object[key] = value.toString();
				}
			}
			result.push(object);
		}

		return result;

	}

}
