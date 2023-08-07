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
import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";

import Composite from "webface/widgets/Composite";

import DialogButtons from "webface/dialogs/DialogButtons";
import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

import MakeoverComposer from "padang/ui/MakeoverComposer";

export default class MakeoverComposerDialog extends TitleAreaDialog {

	private static INIT_WIDTH = 640;
	private static INIT_HEIGHT = 480;

	private composite: Composite = null;
	private composer: MakeoverComposer = null;

	constructor(conductor: Conductor, model: any) {
		super();
		this.setDialogSize(MakeoverComposerDialog.INIT_WIDTH, MakeoverComposerDialog.INIT_HEIGHT);
		this.setWindowTitle("Makeover Dialog");
		this.setTitle("Makeover");
		this.setMessage("Please define model");
		this.prepareComposer(conductor, model);
	}

	private prepareComposer(conductor: Conductor, model: any): void {
		this.composer = new MakeoverComposer(model);
		let controller = <Controller>conductor;
		let viewer = controller.getViewer();
		this.composer.setParent(viewer);
	}

	protected createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1);
		this.createComposer(this.composite);
	}

	private createComposer(parent: Composite): void {
		this.composer.createControl(parent);
		widgets.setGridData(this.composer, true, true);
		this.composer.configure();
	}

	protected createButtons(buttons: DialogButtons): void {
		super.createButtons(buttons);
		this.okButton.setEnabled(true);
	}

}