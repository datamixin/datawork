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

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";

import * as directors from "padang/directors";

import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";
import XGraphic from "padang/model/XGraphic";

import Renderer from "padang/directors/renderers/Renderer";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

import GraphicWizardDialogRequest from "padang/requests/toolbox/GraphicWizardDialogRequest";

export default class GraphicWizardDialogHandler extends BaseHandler {

	private sheet: XSheet = null;

	public handle(_request: GraphicWizardDialogRequest, _callback?: (data?: any) => void): void {

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
		let structure = Renderer.ROUTINE;
		let dataset = this.sheet.getName();
		let director = directors.getGraphicPresentDirector(this.controller);
		director.createWizard(this.controller, structure, dataset,
			(dialog: GraphicWizardDialog) => {
				this.openDialog(dialog);
			}
		);
	}

	private openWizardWithDataset(_remove: boolean): void {
		let structure = Renderer.ROUTINE;
		let dataset = this.sheet.getName();
		let director = directors.getGraphicPresentDirector(this.controller);
		director.createWizardWithDataset(this.controller, structure, dataset,
			(dialog: GraphicWizardDialog) => {
				this.openDialog(dialog);
			}
		);
	}

	private openDialog(dialog: GraphicWizardDialog): void {
		dialog.open((result: string) => {
			let premise = dialog.getPremise();
			let graphic = <XGraphic>premise.getModel();
			if (result === GraphicWizardDialog.OK) {
				let director = directors.getGraphicPresentDirector(this.controller);
				let mapping = premise.getMapping();
				director.applyGraphic(graphic, mapping);
			} else {
				if (result === GraphicWizardDialog.CANCEL) {
					let sheet = <XSheet>util.getAncestor(graphic, XSheet);
					let command = new RemoveCommand();
					command.setModel(sheet);
					this.controller.execute(command);
				}
			}
		});
	}

}
