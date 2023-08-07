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

import DatabaseFunction from "padang/functions/source/DatabaseFunction";

export default class ImportDatabase extends DatabaseFunction {

	public static FUNCTION_NAME = "ImportDatabase";

	constructor(
		public server: string,
		public database: string,
		public connector: string,
		public credential: boolean,
		public table: string,
		public query: string,
	) {
		super(ImportDatabase.FUNCTION_NAME);
	}

	public static TABLE_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"table",
		"Table",
		"Table name"
	);

	public static QUERY_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"query",
		"Query",
		"Query statement"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ImportDatabase.FUNCTION_NAME,
			"Import Database",
			"mdi-database-arrow-right-outline",
			"Import dataset from database"
		);
		let list = plan.getParameterList();
		list.add(ImportDatabase.SERVER_PLAN);
		list.add(ImportDatabase.DATABASE_PLAN);
		list.add(ImportDatabase.CONNECTOR_PLAN);
		list.add(ImportDatabase.CREDENTIAL_PLAN);
		list.add(ImportDatabase.TABLE_PLAN);
		list.add(ImportDatabase.QUERY_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ImportDatabase.getPlan());