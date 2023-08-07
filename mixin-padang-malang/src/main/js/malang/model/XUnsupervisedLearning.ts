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

export default class XUnsupervisedLearning extends XLearning {

	public static XCLASSNAME: string = model.getEClassName("XUnsupervisedLearning");

	public static FEATURE_TRAINING = new EReference("training", XTraining);

	private training: XTraining = null;

	constructor() {
		super(model.createEClass(XUnsupervisedLearning.XCLASSNAME), [
			XUnsupervisedLearning.FEATURE_TRAINING,
		]);
	}

	public getTraining(): XTraining {
		return this.training;
	}

	public setTraining(newTraining: XTraining): void {
		let oldTraining = this.training;
		this.training = newTraining;
		this.eSetNotify(XUnsupervisedLearning.FEATURE_TRAINING, oldTraining, newTraining);
	}

}
