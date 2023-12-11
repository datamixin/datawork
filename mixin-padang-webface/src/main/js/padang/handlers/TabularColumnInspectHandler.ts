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
import * as wef from "webface/wef";

import BaseHandler from "webface/wef/base/BaseHandler";

export abstract class TabularColumnInspectHandler extends BaseHandler {

	public onCommit(): void {
		let director = wef.getSynchronizationDirector(this.controller);
		director.onCommit(() => {
			let controller: any = this.controller;
			if (controller.refreshContent !== undefined) {
				controller.refreshContent();
			}
		});
	}

}

export default TabularColumnInspectHandler;