/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
export default class TensorViewerStyle {

    public static CELL_HEIGHT: number = 24;   // Tinggi cell yang sama untuk semua-nya.
    public static CELL_WIDTH: number = 24;    // Lebar cell yang sama untuk semua-nya
    public static HEADER_HEIGHT: number = 26; // Tinggi header untuk bagian atas tensor.
    public static LEFTER_WIDTH: number = 26;  // Lebar marker sebelah kiri sebagai indicator row.
    public static SCROLL_SPACE: number = 12;  // Lebar space sebelah kanan atau bawah.
    public static SCROLL_STEPS: number = 3;   // Jumlah index yang akan di lewati untuk satu tahap scroll.

    // Garis pemisah antar rows
    public lineVisible?: boolean = true;

    // Lebar cell
    public cellWidth?: number = TensorViewerStyle.CELL_WIDTH;

    // Tinggi cell
    public cellHeight?: number = TensorViewerStyle.CELL_HEIGHT;

    // Tinggi header
    public headerHeight?: number = TensorViewerStyle.HEADER_HEIGHT;

    // Lebar lefter
    public lefterWidth?: number = TensorViewerStyle.LEFTER_WIDTH;

}

