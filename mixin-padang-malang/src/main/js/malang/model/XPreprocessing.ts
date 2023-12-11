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
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "malang/model/model";

export default class XPreprocessing extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XPreprocessing");

	public static FEATURE_RECIPE = new EAttribute("recipe", EAttribute.STRING);

	private recipe: string = null;

	constructor() {
		super(model.createEClass(XPreprocessing.XCLASSNAME), [
			XPreprocessing.FEATURE_RECIPE,
		]);
	}

	public getRecipe(): string {
		return this.recipe;
	}

	public setRecipe(newRecipe: string): void {
		let oldRecipe = this.recipe;
		this.recipe = newRecipe;
		this.eSetNotify(XPreprocessing.FEATURE_RECIPE, oldRecipe, newRecipe);
	}

}
