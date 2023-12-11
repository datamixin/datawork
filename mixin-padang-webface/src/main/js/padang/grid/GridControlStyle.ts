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
export default class GridControlStyle {

	public static MIN_COLUMN_WIDTH = 64;
	public static DEFAULT_COLUMN_WIDTH = 96;
	public static HEADER_HEIGHT: number = 28; // Tinggi header untuk menampung satu baris.
	public static MARKER_WIDTH: number = 50;  // Lebar marker sebelah kiri sebagai indicator record.
	public static ROW_HEIGHT: number = 26;   // Tinggi item yang sama untuk semua-nya.

	// Header visible
	public headerVisible: boolean = true;

	// Tinggi header
	public headerHeight: number = GridControlStyle.HEADER_HEIGHT;

	// Marker visible
	public markerVisible: boolean = true;

	// Lebar marker
	public markerWidth: number = GridControlStyle.MARKER_WIDTH;

	// Tinggi item
	public rowHeight: number = GridControlStyle.ROW_HEIGHT;

}

