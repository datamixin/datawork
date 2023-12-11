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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import FormulaPanel from "padang/view/FormulaPanel";

export default class ParameterDesignView extends ConductorView {

	private static HEIGHT = 30;

	private static LABEL_WIDTH = 100;

	private composite: Composite = null;
	private labelPanel = new LabelPanel();
	private literalPanel: FormulaPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("rinjani-routing-parameter-custom-view");

		view.setGridLayout(this.composite, 3, 0, 0);
		this.createNamePanel(this.composite);
		this.createLiteralPanel(this.composite);

	}

	private createNamePanel(parent: Composite): void {
		this.labelPanel.createControl(parent);
		view.setGridData(this.labelPanel, ParameterDesignView.LABEL_WIDTH, true);
		view.css(this.labelPanel, "line-height", ParameterDesignView.HEIGHT + "px");
	}

	private createLiteralPanel(parent: Composite): void {
		this.literalPanel = new FormulaPanel(this.conductor);
		this.literalPanel.createControl(parent);
		view.setGridData(this.literalPanel, true, true);
	}

	public setLabel(label: string): void {
		this.labelPanel.setText(label);
	}

	public setType(type: string): void {
		this.literalPanel.setType(type);
	}

	public setValue(formula: string): void {
		this.literalPanel.setFormula(formula);
	}

	public setAssignable(assignable: string): void {
		this.literalPanel.setAssignable(assignable);
	}

	public setDescription(description: string): void {
		let control = this.literalPanel.getControl();
		let element = control.getElement();
		element.attr("title", description);
	}

	public adjustHeight(): number {
		return ParameterDesignView.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
