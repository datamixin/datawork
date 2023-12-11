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
import * as util from "webface/model/util";
import Controller from "webface/wef/Controller";

import FormulaParser from "bekasi/FormulaParser";

import BuilderPremise from "padang/ui/BuilderPremise";

import XPreprocessing from "malang/model/XPreprocessing";
import PreprocessingReader from "malang/directors/PreprocessingReader";
import ModelPreparationFormulator from "malang/directors/ModelerPreparationFormulator";
import PreprocessingDirector from "malang/directors/PreprocessingDirector";

import PreprocessingRecipeSetCommand from "malang/commands/PreprocessingRecipeSetCommand";

export default class BasePreprocessingDirector implements PreprocessingDirector {

	private premise: BuilderPremise = null;

	constructor(premise: BuilderPremise) {
		this.premise = premise;
	}

	public preparePreprocessingVariable(preprocessing: XPreprocessing, callback: () => void): void {

		if (this.premise.isVariableExists(PreprocessingReader.PREPROCESSED)) {

			// Sudah ada
			let recipe = preprocessing.getRecipe();
			let parser = new FormulaParser();
			let edited = parser.parse(recipe);
			let stored = this.premise.getVariableExpression(PreprocessingReader.PREPROCESSED);
			if (util.isEquals(edited, stored)) {

				// Masih sama
				callback();

			} else {

				// Berbeda
				this.premise.setVariableExpression(PreprocessingReader.PREPROCESSED, recipe, () => {
					callback();
				});

			}

		} else {

			// Tambah baru
			let recipe = preprocessing.getRecipe();
			this.premise.addVariable(PreprocessingReader.PREPROCESSED, recipe, () => {
				callback();
			});
		}
	}

	public openPreprocessingComposer(controller: Controller, preprocessing: XPreprocessing): void {
		this.preparePreprocessingVariable(preprocessing, () => {
			this.composePreprocessing(controller, preprocessing);
		});
	}

	private composePreprocessing(controller: Controller, preprocessing: XPreprocessing): void {
		let formulator = new ModelPreparationFormulator();
		this.premise.prepareVariable(PreprocessingReader.PREPROCESSED, formulator, (recipe: string) => {
			let command = new PreprocessingRecipeSetCommand();
			command.setPreprocessing(preprocessing);
			command.setRecipe(recipe);
			controller.execute(command);
		});
	}

}