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
import * as util from "webface/model/util";

import XCell from "padang/model/XCell";
import XViewset from "padang/model/XViewset";
import PadangCreator from "padang/model/PadangCreator";

import CellFacetSetCommand from "padang/commands/CellFacetSetCommand";

import CellFacetSetHandler from "padang/handlers/CellFacetSetHandler";

import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";

export default class OutcomeCreateHandler extends CellFacetSetHandler {

	public handle(request: OutcomeCreateRequest, _callback?: (data: any) => void): void {

		let model = this.getCell();
		if (model instanceof XCell) {

			// Create outcome
			let creator = PadangCreator.eINSTANCE;
			let viewset = <XViewset>util.getAncestor(model, XViewset);
			let formula = request.getStringData(OutcomeCreateRequest.FORMULA);
			let outcome = creator.createOutcome(viewset, formula);

			// Execute create
			let command = new CellFacetSetCommand();
			command.setCell(model);
			command.setFacet(outcome);
			this.controller.execute(command);

		}
	}

}
