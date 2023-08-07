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
import EReference from "webface/model/EReference";

import * as model from "malang/model/model";
import XLearning from "malang/model/XLearning";
import XTraining from "malang/model/XTraining";
import XValidation from "malang/model/XValidation";
import XPreprocessing from "malang/model/XPreprocessing";

export default class XSupervisedLearning extends XLearning {

	public static XCLASSNAME: string = model.getEClassName("XSupervisedLearning");

	public static FEATURE_PREPROCESSING = new EReference("preprocessing", XPreprocessing);
	public static FEATURE_VALIDATION = new EReference("validation", XValidation);
	public static FEATURE_TRAINING = new EReference("training", XTraining);

	private preprocessing: XPreprocessing = null;
	private validation: XValidation = null;
	private training: XTraining = null;

	constructor() {
		super(model.createEClass(XSupervisedLearning.XCLASSNAME), [
			XSupervisedLearning.FEATURE_PREPROCESSING,
			XSupervisedLearning.FEATURE_VALIDATION,
			XSupervisedLearning.FEATURE_TRAINING,
		]);
	}

	public getPreprocessing(): XPreprocessing {
		return this.preprocessing;
	}

	public setPreprocessing(newPreprocessing: XPreprocessing): void {
		let oldPreprocessing = this.preprocessing;
		this.preprocessing = newPreprocessing;
		this.eSetNotify(XSupervisedLearning.FEATURE_PREPROCESSING, oldPreprocessing, newPreprocessing);
	}

	public getValidation(): XValidation {
		return this.validation;
	}

	public setValidation(newValidation: XValidation): void {
		let oldValidation = this.validation;
		this.validation = newValidation;
		this.eSetNotify(XSupervisedLearning.FEATURE_VALIDATION, oldValidation, newValidation);
	}

	public getTraining(): XTraining {
		return this.training;
	}

	public setTraining(newTraining: XTraining): void {
		let oldTraining = this.training;
		this.training = newTraining;
		this.eSetNotify(XSupervisedLearning.FEATURE_TRAINING, oldTraining, newTraining);
	}

}
