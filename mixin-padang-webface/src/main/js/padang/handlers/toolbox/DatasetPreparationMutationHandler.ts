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

import BaseHandler from "webface/wef/base/BaseHandler";

import XDataset from "padang/model/XDataset";
import XMutation from "padang/model/XMutation";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import DatasetSourceSetCommand from "padang/commands/DatasetSourceSetCommand";

import DatasetPreparationRequest from "padang/requests/toolbox/DatasetPreparationRequest";

export abstract class DatasetPreparationMutationHandler extends BaseHandler {

	public handle(request: DatasetPreparationRequest, callback: (data: any) => void): void {

		// Find sheet
		let source = request.getStringData(DatasetPreparationRequest.SOURCE);
		let director = directors.getProjectComposerDirector(this.controller);
		let project = director.getProject();
		let sheets = project.getSheets();
		for (let sheet of sheets) {
			if (sheet.getName() === source) {

				// Set preparation
				let dataset = <XDataset>sheet.getForesee();
				let creator = PadangCreator.eINSTANCE;
				let preparation = creator.createPreparation();
				let mutations = preparation.getMutations();
				let mutation = this.createMutation(request);
				mutations.add(mutation);

				let director = wef.getSynchronizationDirector(this.controller);
				director.onCommit(() => {
					callback(mutation);
				});

				// Add mutation
				let command = new DatasetSourceSetCommand();
				command.setDataset(dataset);
				command.setSource(preparation);
				this.controller.execute(command);

			}
		}

	}

	protected abstract createMutation(request: DatasetPreparationRequest): XMutation;

}

export default DatasetPreparationMutationHandler;