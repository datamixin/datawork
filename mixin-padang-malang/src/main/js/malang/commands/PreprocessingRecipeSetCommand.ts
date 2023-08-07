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
import Command from "webface/wef/Command";

import XPreprocessing from "malang/model/XPreprocessing";

export default class PreprocessingRecipeSetCommand extends Command {

	private preprocessing: XPreprocessing = null;
	private oldRecipe: string = null;
	private newRecipe: string = null;

	public setPreprocessing(preprocessing: XPreprocessing): void {
		this.preprocessing = preprocessing;
	}

	public setRecipe(transformation: string): void {
		this.newRecipe = transformation;
	}

	public execute(): void {
		this.oldRecipe = this.preprocessing.getRecipe();
		this.preprocessing.setRecipe(this.newRecipe);
	}

	public undo(): void {
		this.preprocessing.setRecipe(this.oldRecipe);
	}

	public redo(): void {
		this.preprocessing.setRecipe(this.newRecipe);
	}

}