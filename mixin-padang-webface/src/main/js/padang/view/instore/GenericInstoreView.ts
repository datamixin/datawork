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

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import VisageError from "bekasi/visage/VisageError";

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";

import GenericResultPanel from "padang/view/instore/GenericResultPanel";
import MutationInstoreView from "padang/view/instore/MutationInstoreView";

export default class GenericInstoreView extends MutationInstoreView {

	private margin: number = 10;
	private border: boolean = false;
	private composite: Composite = null;
	private container: Composite = null;
	private resultPanel: GenericResultPanel = null;

	constructor(conductor: Conductor, margin?: number, border?: boolean) {
		super(conductor);
		this.resultPanel = new GenericResultPanel(conductor);
		this.margin = margin !== undefined ? margin : this.margin;
		this.border = border !== undefined ? border : this.border;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		view.addClass(this.composite, "padang-generic-instore-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createContainer(this.composite);
		this.createResultPanel(this.composite);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "padang-generic-instore-view-container");
		view.setGridLayout(this.container, 1, this.margin, this.margin);
		view.setGridData(this.container, true, 0);
	}

	private createResultPanel(parent: Composite): void {
		this.resultPanel.createControl(parent);
		view.css(this.resultPanel, this.border ? "border" : "border-top", "1px solid " + grid.BORDER_COLOR);
		view.setGridData(this.resultPanel, true, true);
	}

	public refresh(): void {
		this.resultPanel.refresh();
	}

	public mutate(mutation: VisageMutation): void {
		this.resultPanel.mutate(mutation);
	}

	public setError(error: VisageError): void {
		this.resultPanel.setError(error);
	}

	public relayout(): void {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		view.setGridData(this.container, true, height);
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setControlData(child);
		view.setGridData(child, true, true);
	}

}
