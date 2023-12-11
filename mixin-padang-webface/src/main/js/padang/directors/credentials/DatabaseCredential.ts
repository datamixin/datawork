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
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

import Credential from "padang/directors/credentials/Credential";
import CredentialFactory from "padang/directors/credentials/CredentialFactory";

import DatabaseTables from "padang/functions/source/DatabaseTables";
import ImportDatabase from "padang/functions/source/ImportDatabase";

export default class DatabaseCredential extends Credential {

	public getOptionPlans(): ParameterPlan[] {
		let plans: ParameterPlan[] = [];
		plans.push(ParameterPlanUtils.createTextPlan("username", "Username", "Database username"));
		plans.push(ParameterPlanUtils.createTextPlan("password", "Password", "Database password"));
		return plans;
	}

}

let registry = CredentialFactory.getInstance();
registry.register(DatabaseTables.FUNCTION_NAME, DatabaseCredential);
registry.register(ImportDatabase.FUNCTION_NAME, DatabaseCredential);
