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
import * as directors from "malang/directors";

import AutomatedTaskHandler from "malang/handlers/AutomatedTaskHandler";

import AutomatedTaskDetailRequest from "malang/requests/AutomatedTaskDetailRequest";

export default class AutomatedTaskDetailHandler extends AutomatedTaskHandler {

	public handle(request: AutomatedTaskDetailRequest, callback: (detail: any) => void): void {
		let name = this.getLibraryName();
		let task = request.getStringData(AutomatedTaskDetailRequest.NAME);
		let director = directors.getLibraryPlanDirector(this.controller);
		let detail = director.getTaskDescriptionDetail(name, task);
		callback(detail);
	}

}
