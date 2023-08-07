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
import * as wef from "webface/wef";

import * as util from "webface/model/util";

import RemoveCommand from "webface/wef/base/RemoveCommand";

import * as directors from "padang/directors";

import XCell from "padang/model/XCell";
import XViewset from "padang/model/XViewset";
import PadangCreator from "padang/model/PadangCreator";

import ValueMapping from "padang/util/ValueMapping";

import CellFacetSetCommand from "padang/commands/CellFacetSetCommand";

import CellFacetSetHandler from "padang/handlers/CellFacetSetHandler";

import FigureCreateRequest from "padang/requests/FigureCreateRequest";

export default class FigureCreateHandler extends CellFacetSetHandler {

	public handle(request: FigureCreateRequest, _callback?: (data: any) => void): void {

		let model = this.getCell();
		if (model instanceof XCell) {

			// Create figure
			let creator = PadangCreator.eINSTANCE;
			let viewset = <XViewset>util.getAncestor(model, XViewset);
			let renderer = request.getStringData(FigureCreateRequest.RENDERER);
			let figure = creator.createFigure(viewset, renderer);

			// Execute create
			let command = new CellFacetSetCommand();
			command.setCell(model);
			command.setFacet(figure);

			let director = wef.getSynchronizationDirector(this.controller);
			director.onCommit(() => {

				// Open composer
				let mapping = new ValueMapping();
				let director = directors.getGraphicPresentDirector(this.controller);
				let graphic = figure.getGraphic();
				director.openGraphicComposer(graphic, mapping, (ok: boolean) => {

					if (ok === true) {

						this.controller.refresh();

						let director = directors.getViewsetPresentDirector(this.controller);
						let command = director.createSelectionSetCommand(model);
						this.controller.execute(command);


					} else {

						// Remove figure when not ok
						let command = new RemoveCommand();
						command.setModel(figure);
						this.controller.execute(command);
					}
				});

			});

			this.controller.execute(command);
		}

	}

}
