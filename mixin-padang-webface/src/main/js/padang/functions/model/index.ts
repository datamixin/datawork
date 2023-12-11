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
import * as svm from "padang/functions/model/svm";
import * as tree from "padang/functions/model/tree";
import * as neighbors from "padang/functions/model/neighbors";
import * as auto_model from "padang/functions/model/auto_model";
import * as naive_bayes from "padang/functions/model/naive_bayes";
import * as linear_model from "padang/functions/model/linear_model";

import Learning from "padang/functions/model/Learning";
import Predict from "padang/functions/model/Predict";
import TrainTest from "padang/functions/model/TrainTest";
import Transmute from "padang/functions/model/Transmute";
import Preprocessing from "padang/functions/model/Preprocessing";
import RegressionLearning from "padang/functions/model/RegressionLearning";
import ClassificationLearning from "padang/functions/model/ClassificationLearning";

export {

	svm,
	tree,
	neighbors,
	auto_model,
	naive_bayes,
	linear_model,

	Learning,
	Predict,
	TrainTest,
	Transmute,
	Preprocessing,
	RegressionLearning,
	ClassificationLearning,

}
