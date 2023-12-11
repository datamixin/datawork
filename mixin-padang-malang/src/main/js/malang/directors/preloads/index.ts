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
import * as svm from "malang/directors/preloads/svm";
import * as tree from "malang/directors/preloads/tree";
import * as neighbors from "malang/directors/preloads/neighbors";
import * as auto_model from "malang/directors/preloads/auto_model";
import * as naive_bayes from "malang/directors/preloads/naive_bayes";
import * as linear_model from "malang/directors/preloads/linear_model";

import Preload from "malang/directors/preloads/Preload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";
import BasePreloadPanel from "malang/directors/preloads/BasePreloadPanel";
import ChartPreloadPanel from "malang/directors/preloads/ChartPreloadPanel";
import DatasetPreloadPanel from "malang/directors/preloads/DatasetPreloadPanel";
import ModelExpressionMaker from "malang/directors/preloads/ModelExpressionMaker";

import EstimatorChecker from "malang/directors/preloads/EstimatorChecker";
import AutomatedChecker from "malang/directors/preloads/AutomatedChecker";

import ModelChartPreload from "malang/directors/preloads/ModelChartPreload";
import ModelDatasetPreload from "malang/directors/preloads/ModelDatasetPreload";
import SupervisedModelChartPreload from "malang/directors/preloads/SupervisedModelChartPreload";
import AutomatedModelChartPreload from "malang/directors/preloads/AutomatedModelChartPreload";
import SupervisedModelDatasetPreload from "malang/directors/preloads/SupervisedModelDatasetPreload";
import AutomatedModelDatasetPreload from "malang/directors/preloads/AutomatedModelDatasetPreload";

import PlotPreload from "malang/directors/preloads/PlotPreload";
import ChartPreload from "malang/directors/preloads/ChartPreload";
import DatasetPreload from "malang/directors/preloads/DatasetPreload";
import InputDatasetPreload from "malang/directors/preloads/InputDatasetPreload";
import RegressionTaskPreload from "malang/directors/preloads/RegressionTaskPreload";
import InputFeaturesPlotPreload from "malang/directors/preloads/InputFeaturesPlotPreload";
import ClassificationTaskPreload from "malang/directors/preloads/ClassificationTaskPreload";
import PreprocessedDatasetPreload from "malang/directors/preloads/PreprocessedDatasetPreload";

export {

	svm,
	tree,
	neighbors,
	auto_model,
	naive_bayes,
	linear_model,

	Preload,
	PreloadSupport,
	PreloadRegistry,
	BasePreloadPanel,
	ChartPreloadPanel,
	DatasetPreloadPanel,
	ModelExpressionMaker,

	EstimatorChecker,
	AutomatedChecker,

	ModelChartPreload,
	ModelDatasetPreload,
	SupervisedModelChartPreload,
	AutomatedModelChartPreload,
	SupervisedModelDatasetPreload,
	AutomatedModelDatasetPreload,

	PlotPreload,
	ChartPreload,
	DatasetPreload,
	InputDatasetPreload,
	RegressionTaskPreload,
	InputFeaturesPlotPreload,
	ClassificationTaskPreload,
	PreprocessedDatasetPreload,

}
