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
package com.andia.mixin.padang.demo;

public class GradientDescent {

	public static void main(String[] args) {
		double[][] data = new double[][] {
				{ -9, -19 },
				{ -8, -17 },
				{ -7, -15 },
				{ -6, -13 },
				{ -5, -11 },
				{ -4, -9 },
				{ -3, -7 },
				{ -2, -5 },
				{ -1, -3 },
				{ 0, -1 },
				{ 1, 1 },
				{ 2, 3 },
				{ 3, 5 },
				{ 4, 7 },
				{ 5, 9 },
				{ 6, 11 },
				{ 7, 13 },
				{ 8, 15 },
				{ 9, 17 },
		};

		double b = -100;
		double m = -100;

		double learningRate = 0.02;
		System.out.println("LearningRate " + learningRate);
		for (int epoch = 1; epoch < 100; epoch++) {
			System.out.println("  Epoch " + epoch);
			double sqe = 0;
			for (int i = 0; i < data.length; i++) {
				double[] point = data[i];
				double x = point[0];
				double y = point[1];
				double guess = b + m * x;
				double error = y - guess;
				double errlr = error * learningRate;
				sqe += error * error;
				m = m + (errlr * x);
				b = b + (errlr);
				System.out.format("    %d x=%.0f y=%.0f guess=%.5f error=%.5f m=%.4f b=%.5f sqe=%.5f\n",
						i, x, y, guess, error, m, b, (error * error));
			}
			System.out.format("    Epoch %d m=%.5f b=%.5f sqe=%.5f\n", epoch, m, b, sqe);
		}
	}

}
