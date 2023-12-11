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
import Point from "webface/graphics/Point";

import XExpression from "sleman/model/XExpression";

import VisageTable from "bekasi/visage/VisageTable";

import GraphicPremise from "padang/ui/GraphicPremise";

import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import PlotMaker from "rinjani/directors/plots/PlotMaker";

import * as malang from "malang/malang";

import XModeler from "malang/model/XModeler";

import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";

import FlamlLibrary from "malang/directors/libraries/auto_model/FlamlLibrary";

import AutomatedModelChartPreload from "malang/directors/preloads/AutomatedModelChartPreload";
import AutomatedModelDatasetPreload from "malang/directors/preloads/AutomatedModelDatasetPreload";

export default class FlamlPreload {

	public static GROUP = "FlamlModeler";

	public static ATTR_BEST_LOSS = "best_loss";
	public static ATTR_BEST_ESTIMATOR = "best_estimator";
	public static ATTR_MODEL_COUNT = "modelcount";

	public static ATTR_BEST_CONFIG = "best_config";
	public static ATTR_BEST_LOSS_PER_ESTIMATOR = "best_loss_per_estimator";
	public static ATTR_FEATURE_IMPORTANCE = "feature_importances_";

}

export class SummaryPreload extends AutomatedModelDatasetPreload {

	constructor() {
		super(FlamlPreload.GROUP, "Summary", 3, FlamlLibrary.getPlan());
	}

	public createExpression(_premise: GraphicPremise, _model: XModeler): XExpression {

		let keys = this.maker.createTextList("Best Loss", "Best Estimator", "Modeler Count");

		let values = this.creator.createList();
		this.maker.addModelPropertyElement(values, FlamlPreload.ATTR_BEST_LOSS);
		this.maker.addModelPropertyElement(values, FlamlPreload.ATTR_BEST_ESTIMATOR);
		this.maker.addModelPropertyElement(values, FlamlPreload.ATTR_MODEL_COUNT);

		// CreateDataset
		let object = this.creator.createObject();
		this.creator.addField(object, "Evaluation", keys);
		this.creator.addField(object, "Result", values);
		return this.maker.createDataset(object);
	}

}

export class BestConfigPreload extends AutomatedModelDatasetPreload {

	constructor() {
		super(FlamlPreload.GROUP, "BestConfig", 4, FlamlLibrary.getPlan());
	}

	public createExpression(_premise: GraphicPremise, _model: XModeler): XExpression {
		let object = this.maker.createModelProperty(FlamlPreload.ATTR_BEST_CONFIG);
		return this.maker.createObjectToTable(object);
	}

}

export class BestLossPerEstimatorPreload extends AutomatedModelDatasetPreload {

	constructor() {
		super(FlamlPreload.GROUP, "BestLossPerEstimator", 5, FlamlLibrary.getPlan());
	}

	public createExpression(_premise: GraphicPremise, _model: XModeler): XExpression {
		let object = this.maker.createModelProperty(FlamlPreload.ATTR_BEST_LOSS_PER_ESTIMATOR);
		return this.maker.createObjectToTable(object);
	}

}

export class FeatureImportancePreload extends AutomatedModelChartPreload {

	private static FEATURE = "Feature";
	private static IMPORTANCE = "Importance";

	constructor() {
		super(FlamlPreload.GROUP, "FeatureImportance", 6, malang.RESULT_ICON_MAP.BAR, FlamlLibrary.getPlan());
	}

	public createExpression(_premise: GraphicPremise, model: XModeler): XExpression {

		// Columns
		let firstColumn = this.maker.getInputFeatureNameList(model);
		let secondColumn = this.maker.createModelProperty(FlamlPreload.ATTR_FEATURE_IMPORTANCE);


		// CreateDataset
		let object = this.creator.createObject();
		this.creator.addField(object, FeatureImportancePreload.FEATURE, firstColumn);
		this.creator.addField(object, FeatureImportancePreload.IMPORTANCE, secondColumn);
		return this.maker.createDataset(object);

	}

	public createSpec(table: VisageTable, size: Point, callback: (spec: XTopLevelSpec) => void): void {

		let maker = new PlotMaker();
		let spec = maker.createBarTopLevelUnitSpec();
		maker.setCSVDatasetFromTable(spec, table);
		maker.adjustTopLevelSizeWithSpace(spec, size, 80, 40);

		// X
		let x = maker.addXFieldDef(spec, FeatureImportancePreload.IMPORTANCE);
		maker.setFieldTypeQuantitative(x);

		// Y
		maker.addYFieldDef(spec, FeatureImportancePreload.FEATURE);

		callback(spec);
	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new SummaryPreload());
registry.register(new BestConfigPreload());
registry.register(new BestLossPerEstimatorPreload());
registry.register(new FeatureImportancePreload());
