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
import InputPlan from "rinjani/plan/InputPlan";

export let WHITE_RED = ["#FFF", "#C88", "#900"];
export let BLUE_WHITE_RED = ["#009", "#88C"].concat(WHITE_RED);

export let PRELOAD = "preload";

export let INSTANT_RESULT = "instantResult";

export let TYPE_ICON_MAP = {

}

TYPE_ICON_MAP[InputPlan.TYPE_CONTINUOUS] = "mdi-numeric";
TYPE_ICON_MAP[InputPlan.TYPE_DISCRETE] = "mdi-shape-outline";
TYPE_ICON_MAP[InputPlan.TYPE_TEMPORAL] = "mdi-calendar-clock";
TYPE_ICON_MAP[InputPlan.TYPE_UNKNOWN] = "mdi-help-circle-outline";

export let RESULT_ICON_MAP = {
	TABLE: "mdi-grid",
	NUMBER: "mdi-numeric",
	BAR: "mdi-chart-bar",
	LINE: "mdi-chart-line",
	SCATTER: "mdi-chart-scatter-plot",
	MATRIX: "mdi-grid",
}

export {

}