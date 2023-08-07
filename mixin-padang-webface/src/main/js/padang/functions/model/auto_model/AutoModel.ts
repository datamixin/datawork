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
import Function from "padang/functions/Function";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

export abstract class AutoModel extends Function {

	public static TASK = "task";
	public static SETTINGS = "settings";

	public static TASK_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		AutoModel.TASK,
		"Task",
		"Task name"
	);

	public static SETTINGS_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		AutoModel.SETTINGS,
		"Settings",
		"Custom settings"
	);

}

export default AutoModel;