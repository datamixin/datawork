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
import * as svm from "malang/directors/algorithms/svm";
import * as tree from "malang/directors/algorithms/tree";
import * as neighbors from "malang/directors/algorithms/neighbors";
import * as naive_bayes from "malang/directors/algorithms/naive_bayes";
import * as linear_model from "malang/directors/algorithms/linear_model";

import Algorithm from "malang/directors/algorithms/Algorithm";
import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import RegressionAlgorithm from "malang/directors/algorithms/RegressionAlgorithm";
import ClassificationAlgorithm from "malang/directors/algorithms/ClassificationAlgorithm";

export {

	svm,
	tree,
	neighbors,
	naive_bayes,
	linear_model,

	Algorithm,
	AlgorithmFactory,
	RegressionAlgorithm,
	ClassificationAlgorithm,

}