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

public class HistogramSetup {

	private double farStart;
	private double farEnd;
	private double binWidth;

	public HistogramSetup(double minimum, double maximum) {

		if (minimum >= maximum) {
			throw new UnsupportedOperationException("Start must be less then end");
		}

		// Normalize range factor
		double range = maximum - minimum;
		int exp = 0;
		double factor = range / 10;
		while (factor >= 10) {
			factor = factor / 10;
			exp++;
		}
		while (factor < 1) {
			factor = factor * 10;
			exp--;
		}

		// Select slicer
		double[] slicers = new double[] { 2, 2.5, 5, 10 };
		double slicer = 1;
		for (int i = 0; i < slicers.length; i++) {
			if (slicers[i] > factor) {
				slicer = slicers[i];
				break;
			}
		}

		// Bin width
		this.binWidth = slicer * (Math.pow(10, exp));

		// Far start
		double prev = minimum % binWidth;
		farStart = minimum - prev;

		// Far end
		double next = maximum % binWidth;
		double right = maximum - next + binWidth;
		farEnd = right == maximum ? right + binWidth : right;

	}

	public double getFarStart() {
		return farStart;
	}

	public double getFarEnd() {
		return farEnd;
	}

	public double getBinWidth() {
		return binWidth;
	}

	@Override
	public String toString() {
		return "Histogram{farStart: " + farStart + ", farEnd: " + farEnd + ", bindWidth: " + binWidth + "}";
	}

}
