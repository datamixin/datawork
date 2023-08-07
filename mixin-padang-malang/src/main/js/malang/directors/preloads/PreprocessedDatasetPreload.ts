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
import Point from "webface/graphics/Point";

import XExpression from "sleman/model/XExpression";

import VisageTable from "bekasi/visage/VisageTable";
import VisageObject from "bekasi/visage/VisageObject";

import BuilderPremise from "padang/ui/BuilderPremise";

import Preprocessing from "padang/functions/model/Preprocessing";

import XModeler from "malang/model/XModeler";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import DatasetPreload from "malang/directors/preloads/DatasetPreload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";
import DatasetPreloadPanel from "malang/directors/preloads/DatasetPreloadPanel";

import PreprocessingReader from "malang/directors/PreprocessingReader";

export default class PreprocessedDatasetPreload extends DatasetPreload {

	private static GROUP = "Preprocessing";
	private static NAME = "PreprocessedDataset";

	constructor() {
		super(PreprocessedDatasetPreload.GROUP, PreprocessedDatasetPreload.NAME);
	}

	public getSequence(): number {
		return 2;
	}

	public getCaption(): string {
		return "Preprocessed Dataset";
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		let learning = model.getLearning();
		if (learning instanceof XSupervisedLearning) {
			let preprocessing = learning.getPreprocessing();
			let recipe = preprocessing.getRecipe();
			if (recipe !== null) {
				let premise = support.getPremise();
				let reader = new PreprocessingReader(premise, preprocessing);
				if (reader.isPreparationResultExists()) {
					return true;
				}
			}
		}
		return false;
	}

	public createExpression(premise: BuilderPremise, model: XModeler): XExpression {
		let learning = model.getLearning();
		if (learning instanceof XSupervisedLearning) {
			let preprocessing = learning.getPreprocessing();
			let reader = new PreprocessingReader(premise, preprocessing);
			return reader.getPreprocessedResultPointer();
		}
		return null;
	}

	public alternateResult(value: VisageObject, size: Point, callback: (panel: DatasetPreloadPanel) => void): void {
		let caption = this.getCaption();
		let result = <VisageTable>value.getField(Preprocessing.RESULT);
		let panel = new DatasetPreloadPanel(caption, result, size);
		callback(panel);
	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new PreprocessedDatasetPreload());
