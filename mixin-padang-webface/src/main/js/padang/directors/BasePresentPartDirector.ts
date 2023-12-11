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

import * as util from "webface/model/util";

import Controller from "webface/wef/Controller";

import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import EObjectController from "webface/wef/base/EObjectController";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";
import XVariable from "padang/model/XVariable";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import PreparationFormulator from "padang/ui/PreparationFormulator";

import PresentPartDirector from "padang/directors/PresentPartDirector";

import PreparationComposerDialog from "padang/dialogs/PreparationComposerDialog";

import VariablePreparationSetCommand from "padang/commands/VariablePreparationSetCommand";

export default class BasePresentPartDirector implements PresentPartDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	public getContents(): Controller {
		let controller = this.viewer.getRootController();
		let contents = controller.getContents();
		return contents;
	}

	public refreshContent(callback: () => void): void {
		let model = this.getContents();
		if (model instanceof XSheet) {
			let foresee = model.getForesee();
			if (foresee instanceof XDataset) {
				let director = directors.getDatasetPresentDirector(this.viewer);
				director.computeResult(foresee, callback);
			}
		}
	}

	public getSelection(): EObjectController {
		let director = wef.getSelectionDirector(this.viewer);
		let selection = director.getSelection();
		return <EObjectController>selection.getFirstElement();
	}

	public prepareVariable(controller: Controller, variable: XVariable,
		formulator: PreparationFormulator, callback: (formula: string) => void): void {

		let formula = variable.getFormula();
		let newPreparation = formulator.createPreparation(formula);
		let thePreparation = variable.getPreparation();
		if (thePreparation === null) {

			this.onCommitPrepareVariable(controller, variable, formulator, callback);

			let command = new VariablePreparationSetCommand();
			command.setVariable(variable);
			command.setPreparation(newPreparation);
			controller.execute(command);

		} else {

			if (util.isEquals(thePreparation, newPreparation)) {

				this.doPrepareVariable(variable, formulator, callback);

			} else {

				this.onCommitPrepareVariable(controller, variable, formulator, callback);

				let command = new ReplaceCommand();
				command.setModel(thePreparation);
				command.setReplacement(newPreparation);
				controller.execute(command);

			}

		}

	}

	private onCommitPrepareVariable(controller: Controller, variable: XVariable,
		formulator: PreparationFormulator, callback: (formula: string) => void): void {
		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(() => {
			this.doPrepareVariable(variable, formulator, callback);
		});
	}

	private doPrepareVariable(variable: XVariable,
		formulator: PreparationFormulator, callback: (formula: string) => void): void {

		let preparation = variable.getPreparation();
		let controller = this.viewer.getRootController();
		let contents = controller.getContents();

		// Open composer
		let dialog = new PreparationComposerDialog(contents, preparation);
		dialog.open((result: string) => {

			if (result === FullDeckPanel.OK) {

				// Tetap menggunakan model original, hanya perlu apply result
				let director = directors.getProjectComposerDirector(this.viewer);
				director.inspectValue(preparation, padang.INSPECT_APPLY_RESULT, [], (result: VisageValue) => {

					if (result instanceof VisageError) {

						let message = result.getMessage();
						throw new Error(message);

					} else {

						// Replace display di dataset dengan display dari preparation
						let formula = formulator.createFormula(preparation);
						callback(formula);

					}
				});

			}
		});
	}

}
