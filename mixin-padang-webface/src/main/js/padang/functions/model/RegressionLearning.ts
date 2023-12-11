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
import Learning from "padang/functions/model/Learning";

export default class RegressionLearning extends Learning {

	public static MAE = "mae";
	public static MSE = "mse";
	public static RMSE = "rmse";

	public static RESIDUALS = "residuals";
	public static PREDICTION = "prediction";
	public static ERROR = "error";
	public static STAGE = "stage";
	public static TRAIN = "train";
	public static TEST = "test";
	public static TRAIN_SCORE = "trainScore";
	public static TEST_SCORE = "testScore";

}