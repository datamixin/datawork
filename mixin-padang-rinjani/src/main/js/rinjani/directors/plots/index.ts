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
import Plot from "rinjani/directors/plots/Plot";
import BasePlot from "rinjani/directors/plots/BasePlot";
import BaseMaker from "rinjani/directors/plots/BaseMaker";
import PlotMaker from "rinjani/directors/plots/PlotMaker";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import MessagePanel from "rinjani/directors/plots/MessagePanel";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";
import MappingMaker from "rinjani/directors/plots/MappingMaker";
import ParameterMaker from "rinjani/directors/plots/ParameterMaker";

import BarChart from "rinjani/directors/plots/BarChart";
import PieChart from "rinjani/directors/plots/PieChart";
import RadVizPlot from "rinjani/directors/plots/RadVizPlot";
import MatrixPlot from "rinjani/directors/plots/MatrixPlot";
import ScatterPlot from "rinjani/directors/plots/ScatterPlot";
import ResidualsPlot from "rinjani/directors/plots/ResidualsPlot";
import FrequencyPlot from "rinjani/directors/plots/FrequencyPlot";
import HistogramPlot from "rinjani/directors/plots/HistogramPlot";
import ErrorNumberPlot from "rinjani/directors/plots/ErrorNumberPlot";
import VariableRankPlot from "rinjani/directors/plots/VariableRankPlot";
import CategoricalBoxPlot from "rinjani/directors/plots/CategoricalBoxPlot";
import AccuracyNumberPlot from "rinjani/directors/plots/AccuracyNumberPlot";
import CorrelationRankPlot from "rinjani/directors/plots/CorrelationRankPlot";
import ParallelCoordinatePlot from "rinjani/directors/plots/ParallelCoordinatePlot";
import ClassificationMatrixPlot from "rinjani/directors/plots/ClassificationMatrixPlot";
import RegressionCorrelationPlot from "rinjani/directors/plots/RegressionCorrelationPlot";
import ClassificationPerformancePlot from "rinjani/directors/plots/ClassificationPerformancePlot";
import ClassificationCorrelationPlot from "rinjani/directors/plots/ClassificationCorrelationPlot";

export {

	Plot,
	BarChart,
	PieChart,
	CategoricalBoxPlot,
	BasePlot,
	BaseMaker,
	PlotMaker,
	ScatterPlot,
	PlotFactory,
	MessagePanel,
	VegazooPanel,
	MappingMaker,
	ParameterMaker,

	RadVizPlot,
	MatrixPlot,
	ResidualsPlot,
	FrequencyPlot,
	HistogramPlot,
	ErrorNumberPlot,
	VariableRankPlot,
	AccuracyNumberPlot,
	CorrelationRankPlot,
	ParallelCoordinatePlot,
	ClassificationMatrixPlot,
	RegressionCorrelationPlot,
	ClassificationPerformancePlot,
	ClassificationCorrelationPlot,

}