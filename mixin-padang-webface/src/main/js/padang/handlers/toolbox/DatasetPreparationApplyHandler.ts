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

import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XDataset from "padang/model/XDataset";
import XDisplay from "padang/model/XDisplay";
import XPreparation from "padang/model/XPreparation";

import DatasetPreparationApplyRequest from "padang/requests/toolbox/DatasetPreparationApplyRequest";

export default class DatasetPreparationApplyHandler extends BaseHandler {

	public handle(request: DatasetPreparationApplyRequest, _callback: (data: any) => void): void {
		let source = request.getStringData(DatasetPreparationApplyRequest.SOURCE);
		let director = directors.getProjectComposerDirector(this.controller);
		let project = director.getProject();
		let sheets = project.getSheets();
		for (let sheet of sheets) {
			if (sheet.getName() === source) {
				let dataset = <XDataset>sheet.getForesee();
				let preparation = <XPreparation>dataset.getSource();
				this.applyPreparation(preparation);
			}
		}
	}

	public applyPreparation(preparation: XPreparation): void {

		let director = directors.getProjectComposerDirector(this.controller);
		director.inspectValue(preparation, padang.INSPECT_APPLY_RESULT, [], (result: VisageValue) => {

			if (result instanceof VisageError) {

				let message = result.getMessage();
				throw new Error(message);

			} else {

				// Replace display di dataset dengan display dari preparation
				let dataset = <XDataset>preparation.eContainer();
				let newDisplay = preparation.getDisplay();
				let mapDisplay = <XDisplay>util.copy(newDisplay);
				let oldDisplay = dataset.getDisplay();
				let command = new ReplaceCommand();
				command.setModel(oldDisplay);
				command.setReplacement(mapDisplay);
				this.controller.execute(command);

			}
		});

	}

}
