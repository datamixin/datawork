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
import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class ReadExcel extends Function {

	public static FUNCTION_NAME = "ReadExcel";

	constructor(
		public path: string,
		public sheet: string,
		public firstRowHeader: boolean,
		public quoteCharacter: string,
	) {
		super(ReadExcel.FUNCTION_NAME);
	}

	public static PATH_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"path",
		"Path",
		"File or directory path"
	);
	public static SHEET_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"sheet",
		"Sheet",
		"Sheet name or index",
		"0"
	);
	public static HEADER_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"header",
		"Row Header",
		"Row index to use for column label",
		0
	);
	public static PARSE_DATES_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"parseDates",
		"Parse Dates",
		"Parse date columns",
		"=[]"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ReadExcel.FUNCTION_NAME,
			"Read Excel",
			"mdi-file-excel-outline",
			"Create dataset from excel file"
		);
		let list = plan.getParameterList();
		list.add(ReadExcel.PATH_PLAN);
		list.add(ReadExcel.SHEET_PLAN);
		list.add(ReadExcel.HEADER_PLAN);
		list.add(ReadExcel.PARSE_DATES_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ReadExcel.getPlan());