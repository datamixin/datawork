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
import * as webface from "webface/webface";

export default class FillData {

	// Weight adalah proporsi
	public weight: number = 1;

	// Pixels adalah lebar/tinggi yang akan override weight.
	public pixels: number = webface.DEFAULT;

	// Jumlah pixel minimum
	public minimumPixels: number = webface.DEFAULT;

	constructor(weight?: number) {
		if (typeof (weight) === "number") {
			this.weight = weight;
		}
	}

}

