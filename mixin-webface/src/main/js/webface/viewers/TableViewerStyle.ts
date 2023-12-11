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
export default class TableViewerStyle {

    public static ITEM_HEIGHT: number = 24;   // Tinggi item yang sama untuk semua-nya.
    public static HEADER_HEIGHT: number = 26; // Tinggi header untuk menampung satu baris.
    public static CELL_WIDTH: number = 80;    // Label cell default sebelum di resize oleh user.
    public static MARKER_WIDTH: number = 50;  // Lebar marker sebelah kiri sebagai indicator record.
    public static SCROLL_SPACE: number = 12;  // Lebar space sebelah kanan atau bawah.
    public static SCROLL_STEPS: number = 3;   // Jumlah index yang akan di lewati untuk satu tahap scroll.

    // Bagian row indicator
    public marker: boolean = false;

    // Lebar marker
    public markerWidth: number = TableViewerStyle.MARKER_WIDTH;

    // Tinggi item
    public itemHeight: number = TableViewerStyle.ITEM_HEIGHT;

    // Garis pemisah antar rows
    public lineVisible: boolean = true;

    // Column header
    public headerVisible: boolean = true;

    // Tinggi header
    public headerHeight: number = TableViewerStyle.HEADER_HEIGHT;

    // Selection full satu row
    public fullSelection: boolean = false;

    // Cell dapat di edit dengan double click
    public cellEditable: boolean = false;

}

