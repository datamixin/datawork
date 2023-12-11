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
import BaseHandler from "webface/wef/base/BaseHandler";

import XCell from "padang/model/XCell";

import * as directors from "padang/directors";

export abstract class CellFacetSetHandler extends BaseHandler {

	protected getCell(): XCell {

		// Model
		let model = this.controller.getModel();
		if (!(model instanceof XCell)) {

			// Ambil selection di present part
			let director = directors.getPresentPartDirector(this.controller);
			let selection = director.getSelection();
			model = selection.getModel();
		}

		return model;

	}

}

export default CellFacetSetHandler;