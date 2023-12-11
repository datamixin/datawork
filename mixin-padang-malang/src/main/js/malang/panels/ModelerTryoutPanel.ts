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
import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";
import LayoutablePart from "webface/wef/LayoutablePart";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageObject from "bekasi/visage/VisageObject";

import * as padang from "padang/padang";

import * as view from "padang/view/view";

import BuilderPremise from "padang/ui/BuilderPremise";

import XModeler from "malang/model/XModeler";

import OutputPartSupport from "malang/directors/OutputPartSupport";

import ModelConverter from "malang/directors/converters/ModelConverter";

export default class ModelerTryoutPanel extends ConductorPanel implements LayoutablePart {

	private composite: Composite = null;
	private premise: BuilderPremise = null;
	private tryoutPanel: ConductorPanel = null;

	constructor(conductor: Conductor, premise: BuilderPremise) {
		super(conductor);
		this.premise = premise;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "malang-modeler-trayout-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createModelPanel();
	}

	private createModelPanel(): void {
		let converter = new ModelConverter();
		let mapping = this.premise.getMapping();
		let object = mapping.getValue(padang.EXPLANATION);
		if (object instanceof VisageObject) {
			let model = <XModeler>converter.convertValueToModel(object);
			let support = new OutputPartSupport(this.premise);
			support.getTryoutPanel(model, (panel: ConductorPanel) => {
				this.createPanelControl(panel);
			});
		}
	}

	private createPanelControl(panel: ConductorPanel): void {
		if (this.tryoutPanel !== null) {
			view.dispose(this.tryoutPanel);
		}
		if (panel !== null) {
			panel.createControl(this.composite);
			view.setGridData(panel, true, true);
			this.tryoutPanel = panel;
		}
	}

	public relayout(): void {
		if (this.tryoutPanel !== null) {
			let part = <LayoutablePart><any>this.tryoutPanel;
			if (part.relayout) {
				part.relayout();
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}