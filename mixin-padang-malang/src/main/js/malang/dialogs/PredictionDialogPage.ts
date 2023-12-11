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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import WizardContainer from "webface/dialogs/WizardContainer";

import BaseWizardDialogPage from "webface/wef/base/BaseWizardDialogPage";

import * as widgets from "padang/widgets/widgets";

import BuilderPremise from "padang/ui/BuilderPremise";

import ModelerTryoutPanel from "malang/panels/ModelerTryoutPanel";

export default class PredictionDialogPage extends BaseWizardDialogPage implements LayoutablePart {

	private premise: BuilderPremise = null;
	private composite: Composite = null;
	private resultPart: Composite = null;
	private result: Panel = null;

	constructor(container: WizardContainer, conductor: Conductor, premise: BuilderPremise) {
		super(container, conductor, "Prediction");
		this.premise = premise;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.addClass(this.composite, "malang-prediction-dialog-page");
		widgets.setGridLayout(this.composite, 1);
		this.createContainer(this.composite);
	}

	private createContainer(parent: Composite): void {
		this.resultPart = new Composite(parent);
		widgets.addClass(this.resultPart, "malang-prediction-dialog-page-container");
		widgets.setGridLayout(this.resultPart, 1, 10, 10);
		widgets.css(this.resultPart, "border", "1px solid #E8E8E8");
		widgets.css(this.resultPart, "background-color", "#F8F8F8");
		widgets.setGridData(this.resultPart, true, true);
		this.populateTryoutPanel();
	}

	private populateTryoutPanel(): void {
		if (this.result !== null) {
			widgets.dispose(this.result);
		}
		this.result = new ModelerTryoutPanel(this.conductor, this.premise);
		this.result.createControl(this.resultPart);
		widgets.setGridData(this.result, true, true);
	}

	public refresh(): void {
		this.populateTryoutPanel();
		this.composite.relayout();
		this.resultPart.relayout();
	}

	public relayout(): void {
		if (this.result !== null) {
			let part = <LayoutablePart><any>this.result;
			if (part.relayout) {
				part.relayout();
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}
