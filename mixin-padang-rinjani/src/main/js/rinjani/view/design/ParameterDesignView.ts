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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import FormulaPanel from "padang/view/FormulaPanel";

export default class ParameterDesignView extends ConductorView implements HeightAdjustablePart {

	private static NAME_WIDTH = 72;
	private static MIN_HEIGHT = 26;

	private composite: Composite = null;
	private namePanel: LabelPanel = null;
	private valuePanel: FormulaPanel = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index)
		this.composite.setData(this);
		view.addClass(this.composite, "rinjani-parameter-design-view");
		view.setGridLayout(this.composite, 2, 0, 0);
		this.createNamePanel(this.composite);
		this.createValuePanel(this.composite);
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel = new LabelPanel();
		this.namePanel.createControl(parent);
		this.namePanel.setTextIndent(5);
		view.css(this.namePanel, "line-height", ParameterDesignView.MIN_HEIGHT + "px");
		view.setGridData(this.namePanel, ParameterDesignView.NAME_WIDTH, true);
	}

	private createValuePanel(parent: Composite): void {
		this.valuePanel = new FormulaPanel(this.conductor, ParameterDesignView.MIN_HEIGHT, 1);
		this.valuePanel.createControl(parent);
		view.setGridData(this.valuePanel, true, true);
	}

	public setName(name: string): void {
		this.namePanel.setText(name);
	}

	public setValue(value: string): void {
		this.valuePanel.setFormula(value);
	}

	public setType(type: string): void {
		this.valuePanel.setType(type);
	}

	public setAssignable(option: any): void {
		this.valuePanel.setAssignable(option);
	}

	public adjustHeight(): number {
		return ParameterDesignView.MIN_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}