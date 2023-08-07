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
import XModeler from "malang/model/XModeler";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";

import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import ModelDatasetPreload from "malang/directors/preloads/ModelDatasetPreload";

import EstimatorChecker from "malang/directors/preloads/EstimatorChecker";

export abstract class SupervisedModelDatasetPreload extends ModelDatasetPreload {

	protected checker: EstimatorChecker = null;

	constructor(group: string, name: string, sequence: number, plan: AlgorithmPlan) {
		super(group, name, sequence);
		this.checker = new EstimatorChecker(plan);
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		return this.checker.isApplicable(support, model);
	}

}

export default SupervisedModelDatasetPreload;
