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
export default class ListViewerStyle {

	public static SELECT = 0; // Menampilkan tanda sebuah element di select
	public static CHECK = 1; // Menampilkan tanda sebuah element di check
	public static NONE = 2; // Tidak manampilkan tanda apapun

	// Default mark selected
	public mark: number = ListViewerStyle.SELECT;

	// Flag to show icon
	public image: boolean = false;

	constructor(mark?: number) {
		if (mark !== undefined) {
			this.mark = mark;
		}
	}
}
