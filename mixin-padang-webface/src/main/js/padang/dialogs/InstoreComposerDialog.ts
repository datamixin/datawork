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

import XMutation from "padang/model/XMutation";

import * as widgets from "padang/widgets/widgets";

import InstoreComposer from "padang/ui/InstoreComposer";

export default class InstoreComposerDialog extends TitleAreaDialog {

	private static INIT_WIDTH = 920;
	private static INIT_HEIGHT = 640;

	private composite: Composite = null;
	private composer: InstoreComposer = null;

	constructor(conductor: Conductor, model: XMutation) {
		super();
		this.setDialogSize(InstoreComposerDialog.INIT_WIDTH, InstoreComposerDialog.INIT_HEIGHT);
		this.setWindowTitle("Instore Dialog");
		this.setTitle("Instore");
		this.setMessage("Please define preparation");
		this.prepareComposer(conductor, model);
	}

	private prepareComposer(conductor: Conductor, model: XMutation): void {
		this.composer = new InstoreComposer(model);
		let controller = <Controller>conductor;
		let viewer = controller.getViewer();
		this.composer.setParent(viewer);
	}

	protected createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.addClass(this.composite, "padang-instore-composer-dialog");
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