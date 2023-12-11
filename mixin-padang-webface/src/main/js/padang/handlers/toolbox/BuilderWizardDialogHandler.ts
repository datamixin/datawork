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
import RemoveCommand from "webface/wef/base/RemoveCommand";

import * as directors from "padang/directors";

import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";
import XBuilder from "padang/model/XBuilder";

import Structure from "padang/directors/structures/Structure";

import BuilderWizardDialog from "padang/dialogs/BuilderWizardDialog";

import BuilderWizardDialogRequest from "padang/requests/toolbox/BuilderWizardDialogRequest";

export default class BuilderWizardDialogHandler extends BaseHandler {

	private sheet: XSheet = null;

	public handle(_request: BuilderWizardDialogRequest, _callback?: (data?: any) => void): void {

		// Get current sheet
		let director = directors.getPresentPartDirector(this.controller);
		let controller = director.getContents();
		let sheet = <XSheet>controller.getModel();
		let foresee = sheet.getForesee();
		if (foresee instanceof XDataset) {

			this.sheet = sheet;
			let source = foresee.getSource();
			if (source === null) {

				this.openWizardWithDataset(false);

			} else {

				this.openWizard();

			}

		} else {

			this.onCreateDataset();
			let director = directors.getToolboxPartDirector(this.controller);
			this.sheet = director.executeAddDatasetSheet(this.controller);

		}
	}

	private onCreateDataset(): void {
		let director = wef.getSynchronizationDirector(this.controller);
		director.onCommit(() => {
			this.openWizardWithDataset(true);
		});
	}

	private openWizard(): void {
		let structure = Structure.MODEL;
		let dataset = this.sheet.getName();
		let director = directors.getBuilderPresentDirector(this.controller);
		director.createWizard(this.controller, structure, dataset,
			(dialog: BuilderWizardDialog) => {
				this.openDialog(dialog);
			}
		);
	}

	private openWizardWithDataset(_remove: boolean): void {
		let structure = Structure.MODEL;
		let dataset = this.sheet.getName();
		let director = directors.getBuilderPresentDirector(this.controller);
		director.createWizardWithDataset(this.controller, structure, dataset,
			(dialog: BuilderWizardDialog) => {
				this.openDialog(dialog);
			}
		);
	}

	private openDialog(dialog: BuilderWizardDialog): void {

		dialog.open((result: string) => {

			let premise = dialog.getPremise();
			let builder = <XBuilder>premise.getModel();
			if (result === BuilderWizardDialog.OK) {

				let director = directors.getBuilderPresentDirector(this.controller);
				let mapping = premise.getMapping();
				director.applyBuilder(builder, mapping)

			} else if (result === BuilderWizardDialog.CANCEL) {

				let command = new RemoveCommand();
				let container = builder.eContainer();
				command.setModel(container);
				this.controller.execute(command);

			}
		});
	}

}
