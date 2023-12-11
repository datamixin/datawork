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
import Function from "padang/functions/Function";

import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

import DatabaseConnectors from "padang/functions/source/DatabaseConnectors";

export abstract class DatabaseFunction extends Function {

	public static SERVER_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"server",
		"Server",
		"Server address"
	);

	public static DATABASE_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"database",
		"Database",
		"Database name"
	);

	public static CONNECTOR_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"connector",
		"Connector",
		"Database Connector name",
		"",
		DatabaseConnectors.getDriversAssignable()
	);

	public static CREDENTIAL_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"credential",
		"Credential",
		"Credential information",
		"",
		Function.getCredentialAssignable()
	);

}

export default DatabaseFunction;