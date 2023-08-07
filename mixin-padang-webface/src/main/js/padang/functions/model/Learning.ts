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
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

export default class Learning {

	public static MODEL = "model";
	public static FEATURES = "features";
	public static FEATURES_LABEL = "Features";
	public static TARGET = "target";
	public static TARGET_LABEL = "Target";

	public static MODEL_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.MODEL,
		"Model",
		"Model instance"
	);

	public static FEATURES_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.FEATURES,
		Learning.FEATURES_LABEL,
		"Input features"
	);

	public static TARGET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.TARGET,
		Learning.TARGET_LABEL,
		"Target values"
	);

}