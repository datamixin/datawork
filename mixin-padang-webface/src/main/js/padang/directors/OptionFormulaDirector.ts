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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export let OPTION_FORMULA_DIRECTOR = "option-formula-director";

import XOption from "padang/model/XOption";

import ParameterPlan from "padang/plan/ParameterPlan";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";

export interface OptionFormulaDirector {

	evaluateValue(value: string, callback: (result: any) => void): void;

	evaluateAssignable(context: OptionFormulaContext, literal: string, callback: (result: any) => void): void;

	getParameterPlan(parameter: XOption): ParameterPlan;

	getDefaultLiteral(plan: ParameterPlan): string;

	getDefaultValue(plan: ParameterPlan): any;

}

export function getOptionFormulaDirector(host: Controller | PartViewer): OptionFormulaDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <OptionFormulaDirector>viewer.getDirector(OPTION_FORMULA_DIRECTOR);
}

export default OptionFormulaDirector;

