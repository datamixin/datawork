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

export default class ReadCsv extends Function {

	public static FUNCTION_NAME = "ReadCsv";

	constructor(
		public path: string,
		public delimiter: string,
		public firstRowHeader: boolean,
		public quoteCharacter: string,
	) {
		super(ReadCsv.FUNCTION_NAME);
	}

	public static PATH_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"path",
		"Path",
		"File or directory path"
	);
	public static DELIMITER_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"delimiter",
		"Value Delimiter",
		"Character separating values",
		",",
		"={Comma: ',', Colon: ':', Tab: '\\t', Space:' '}"
	);
	public static FIRST_ROW_HEADER_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
		"firstRowHeader",
		"First Row Header",
		"First row is a header (column names)",
		true
	);
	public static QUOTE_CHARACTER_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"quoteCharacter",
		"Quote Character",
		"Single character as start and end quoted value",
		'"',
		"={DoubleQuote: '\"', SingleQuote: '\\''}"
	);
	public static PARSE_DATES_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"parseDates",
		"Parse Dates",
		"Parse date columns",
		"=[]"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ReadCsv.FUNCTION_NAME,
			"Read CSV",
			"mdi-file-delimited-outline",
			"Create dataset from CSV File"
		);
		let list = plan.getParameterList();
		list.add(ReadCsv.PATH_PLAN);
		list.add(ReadCsv.DELIMITER_PLAN);
		list.add(ReadCsv.FIRST_ROW_HEADER_PLAN);
		list.add(ReadCsv.QUOTE_CHARACTER_PLAN);
		list.add(ReadCsv.PARSE_DATES_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ReadCsv.getPlan());