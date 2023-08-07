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

import LibraryPlan from "malang/plan/LibraryPlan";

import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import ModelChartPreload from "malang/directors/preloads/ModelChartPreload";

import AutomatedChecker from "malang/directors/preloads/AutomatedChecker";

export abstract class AutomatedModelChartPreload extends ModelChartPreload {

	protected checker: AutomatedChecker = null;

	constructor(name: string, group: string, sequence: number, presume: string, plan: LibraryPlan) {
		super(name, group, sequence, presume);
		this.checker = new AutomatedChecker(plan);
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		return this.checker.isApplicable(support, model);
	}

}

export default AutomatedModelChartPreload;
