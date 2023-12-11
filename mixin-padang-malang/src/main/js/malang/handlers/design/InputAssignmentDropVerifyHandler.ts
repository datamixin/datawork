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
import Map from "webface/util/Map";

import BaseHandler from "webface/wef/base/BaseHandler";

import VisageType from "bekasi/visage/VisageType";

import * as padang from "padang/padang";

import * as directors from "malang/directors";

import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

import InputAssignmentDropVerifyRequest from "malang/requests/design/InputAssignmentDropVerifyRequest";

export default class InputAssignmentDropVerifyHandler extends BaseHandler {

	public handle(request: InputAssignmentDropVerifyRequest, callback: (data: any) => void): void {
		let data = <Map<any>>request.getData(InputAssignmentDropVerifyRequest.DATA);
		if (data.containsKey(padang.FIELD_FORMULA)) {

			if (data.containsKey(padang.FIELD_PRESUME)) {
				let fieldPresume = <string>data.get(padang.FIELD_PRESUME);
				if (fieldPresume !== VisageType.COLUMN) {
					callback("Expected table column, actually '" + fieldPresume + "'");
					return;
				}
			}

			if (data.containsKey(padang.FIELD_TYPE)) {

				let formula = data.get(padang.FIELD_FORMULA);
				let director = directors.getDesignPartDirector(this.controller);
				let reader = director.createInputFeatureReader();
				let parser = new FeatureFormulaParser();
				let name = parser.getColumnName(formula);
				let names = reader.buildFeatureNameFormulas();
				if (names.has(name)) {
					callback("Feature '" + name + "' already used");
				} else {
					callback(null);
				}

			} else {
				callback("Missing drag data '" + padang.FIELD_TYPE + "'");
			}

		} else {
			callback("Missing drag data '" + padang.FIELD_FORMULA + "'");
		}
	}

}
