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
package com.andia.mixin.util;

public class TensorMapper {

	private int length = 1;
	private int[] shape;

	public TensorMapper() {

	}

	public TensorMapper(int[] shape) {
		this.shape = shape;
		for (int i = 0; i < shape.length; i++) {
			length *= shape[i];
		}
	}

	public int getLength() {
		return length;
	}

	public int[] getPositions(int index) {
		int[] positions = new int[shape.length];
		int spare = index;
		for (int i = 0; i < shape.length; i++) {
			int pass = 1;
			for (int j = i + 1; j < shape.length; j++) {
				pass *= shape[j];
			}
			positions[i] = spare / pass;
			spare -= pass * positions[i];
		}
		return positions;
	}

	public int getIndex(int[] positions) {
		int index = 0;
		for (int i = 0; i < positions.length; i++) {
			int pass = 1;
			for (int j = i + 1; j < shape.length; j++) {
				pass *= shape[j];
			}
			index += positions[i] * pass;
		}
		return index;
	}

}
