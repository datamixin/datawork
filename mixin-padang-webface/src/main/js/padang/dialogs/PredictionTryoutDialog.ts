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
import Panel from "webface/wef/Panel";
import Conductor from "webface/wef/Conductor";
import LayoutablePart from "webface/wef/LayoutablePart";

import Composite from "webface/widgets/Composite";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

import BuilderTryoutPanelRequest from "padang/requests/present/BuilderTryoutPanelRequest";

export default class PredictionTryoutDialog extends TitleAreaDialog {

	private conductor: Conductor = null;
	private panel: Panel = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(560, 540);
		this.setWindowTitle("Prediction Tryout Dialog");
		this.setTitle("Prediction Tryout");
		this.setMessage("Please specify predictor features");
	}

	protected createControl(parent: Composite): void {
		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 1);
		this.createTryoutPart(composite);
	}

	private createTryoutPart(parent: Composite): void {

		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 1, 0, 0, 0, 0);
		widgets.setGridData(composite, true, true);

		let request = new BuilderTryoutPanelRequest();
		this.conductor.submit(request, (panel: Panel) => {
			panel.createControl(composite);
			widgets.setGridData(panel, true, true);
			this.panel = panel;
		});
	}

	protected postOpen(): void {
		if (this.panel !== null) {
			let part = <LayoutablePart><any>this.panel;
			if (part.relayout) {
				part.relayout();
			}
		}
	}

}
