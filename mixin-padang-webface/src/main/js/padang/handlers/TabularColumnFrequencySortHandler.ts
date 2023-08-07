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
import BaseHandler from "webface/wef/base/BaseHandler";

import VisageType from "bekasi/visage/VisageType";

import * as directors from "padang/directors";

import TabularColumnFrequencySortRequest from "padang/requests/TabularColumnFrequencySortRequest";

export default class TabularColumnFrequencySortHandler extends BaseHandler {

	public handle(request: TabularColumnFrequencySortRequest, callback: (data?: any) => void): void {

		let column = request.getStringData(TabularColumnFrequencySortRequest.NAME);
		let label = request.getBooleanData(TabularColumnFrequencySortRequest.LABEL);
		let ascending = request.getBooleanData(TabularColumnFrequencySortRequest.ASCENDING);

		let director = directors.getColumnProfileDirector(this.controller);
		director.loadProfile(this.controller, column, VisageType.STRING, false, label, ascending, (result: any) => {
			callback(result);
		});

	}

}

