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
export default class CSVDataset {

	private static COMMA = ",";
	private static ENTER = "\n";

	private headers: string[] = [];
	private records: any[][] = [];

	public setHeaders(headers: string[]): void {
		this.headers = headers;
	}

	public append(values: any[]): void {
		this.records.push(values);
	}

	public toString(): string {
		let header = this.headers.join(CSVDataset.COMMA);
		let content = header.concat(CSVDataset.ENTER);
		for (let record of this.records) {
			let row = record.join(CSVDataset.COMMA);
			content = content.concat(row)
			content = content.concat(CSVDataset.ENTER)
		}
		return content;
	}

}
