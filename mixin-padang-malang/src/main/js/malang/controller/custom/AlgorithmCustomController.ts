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
import EObjectController from "webface/wef/base/EObjectController";

import XAlgorithm from "malang/model/XAlgorithm";

import AlgorithmCustomView from "malang/view/custom/AlgorithmCustomView";

export default class AlgorithmCustomController extends EObjectController {

	constructor() {
		super();
	}

	public createView(): AlgorithmCustomView {
		return new AlgorithmCustomView(this);
	}

	public getView(): AlgorithmCustomView {
		return <AlgorithmCustomView>super.getView();
	}

	public getModel(): XAlgorithm {
		return <XAlgorithm>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let parameters = model.getHyperParameters();
		return parameters.toArray();
	}

}
