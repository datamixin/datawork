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

import * as directors from "padang/directors";

import TabularPart from "padang/view/TabularPart";

import TabularColumnProfileRequest from "padang/requests/TabularColumnProfileRequest";

export default class TabularColumnProfileHandler extends BaseHandler {

	public handle(request: TabularColumnProfileRequest, callback: (result?: any) => void): void {

		let column = request.getStringData(TabularColumnProfileRequest.NAME);
		let type = request.getStringData(TabularColumnProfileRequest.TYPE);
		let both = request.getBooleanData(TabularColumnProfileRequest.BOTH);

		if (both === true) {

			let active = this.controller.isActive();
			if (active === false) {
				return;
			}

			let director = directors.getColumnProfileDirector(this.controller);
			director.loadProfile(this.controller, column, type, false, true, true, (result: any) => {

				let active = this.controller.isActive();
				if (active === false) {
					return;
				}

				callback(result);
				this.refreshColumnInspection(column, type);
			});
		} else {
			this.refreshColumnInspection(column, type, callback);
		}
	}

	private refreshColumnInspection(column: string, type: string, callback?: () => void): void {

		let active = this.controller.isActive();
		if (active === false) {
			return;
		}

		let part = <TabularPart><any>this.controller.getView();

		let director = directors.getColumnProfileDirector(this.controller);
		let map = director.readInspectSelections(this.controller);
		let model = this.controller.getModel();
		let mutations = model.getMutations();
		if (mutations.size === 0) {

			part.setInspectProfile(column, null);
			part.setInspectSelection(column, new Map<string, any>());
			if (callback !== undefined) callback();

		} else {

			director.loadProfile(this.controller, column, type, true, true, true, (result: any) => {

				let active = this.controller.isActive();
				if (active === false) {
					return;
				}

				part.setInspectProfile(column, result);

				if (map.has(column)) {
					let values = map.get(column);
					part.setInspectSelection(column, values);
				} else {
					part.setInspectSelection(column, new Map<string, any>());
				}
				if (callback !== undefined) callback();

			});
		}
	}

}