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
import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export let COLUMN_PROFILE_DIRECTOR = "column-profile-director";

import DatasetQuery from "padang/query/DatasetQuery";
import SummaryQuery from "padang/query/SummaryQuery";
import HistogramQuery from "padang/query/HistogramQuery";

export interface ColumnProfileDirector {

	loadProfile(controller: Controller, column: string, type: string,
		display: boolean, label: boolean, ascending: boolean, callback: (value: any) => void): void;

	createConditionFormula(column: string, type: string, values: Map<string, any>): string;

	readInspectSelections(controller: Controller): Map<string, Map<string, any>>;

	createFrequencyQuery(display: boolean): SummaryQuery;

	createHistogramQuery(display: boolean): HistogramQuery;

	getResult(model: EObject, query: DatasetQuery, callback: (result: any) => void): void;

}

export function getColumnProfileDirector(host: Controller | PartViewer): ColumnProfileDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ColumnProfileDirector>viewer.getDirector(COLUMN_PROFILE_DIRECTOR);
}

export default ColumnProfileDirector;

