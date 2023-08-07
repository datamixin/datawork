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
import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import Composite from "webface/widgets/Composite";

import VisageTable from "bekasi/visage/VisageTable";

import * as padang from "padang/padang";

import * as view from "padang/view/view";

import IsNull from "padang/functions/logical/IsNull";

import Propane from "padang/view/present/propane/Propane";
import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import PropaneValuePanel from "padang/view/present/propane/PropaneValuePanel";
import { BarFigure, PropaneNullAction } from "padang/view/present/propane/Propane";

import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";

export default class GenericPropane extends Propane {

	public static LIMIT = 8;

	private figures = new Map<string, BarFigure>();
	private initialProfile: VisageTable = null;
	private selectionValues = new Map<string, any>();
	private labelCounts: LabelCount[] = [];
	private chartPart: Composite = null;

	public setInitialProfile(table: VisageTable): void {
		this.initialProfile = table;
		view.dispose(this.chartPart);
		this.labelCounts = [];
		this.figures.clear();
		this.selectionValues.clear();
	}

	public populateFigure(): void {
		this.buildDataset();
		this.createBarFigures(this.composite);
		this.composite.relayout();
	}

	private buildDataset(): void {

		let recordCount = this.initialProfile.recordCount();
		for (let i = 0; i < recordCount; i++) {
			let record = this.initialProfile.getRecord(i);
			let label = record.getValue(1);
			let count = record.getValue(2);
			if (label === padang.EXISTS_FLAG || label === padang.DISTINCTS_FLAG) {
				continue;
			} else {
				this.maximum = Math.max(this.maximum, count);
				this.labelCounts.push(new LabelCount(label, count));
			}
		}
	}

	private createBarFigures(parent: Composite): void {

		if (this.chartPart !== null) {
			this.chartPart.dispose();
		}

		this.chartPart = new Composite(parent);
		view.addClass(this.chartPart, "padang-frequency-propane-chart-part");
		view.setAbsoluteLayout(this.chartPart);
		view.setGridData(this.chartPart, true, true);

		// Figure and Label
		for (let i = 0; i < this.labelCounts.length; i++) {

			let labelCount = this.labelCounts[i];
			let label = labelCount.label;
			let count = labelCount.count;

			let action: GroupAction;
			if (label === padang.NULL || label === padang.NULL_FLAG) {
				action = new PropaneNullAction(this.column, this.menuSet);
			} else if (label === padang.ERROR) {
				action = new GenericErrorAction(this.column, this.menuSet);
			}
			this.createLabelFigure(this.chartPart, i, label, count, action);

		}

		this.composite.relayout();
	}

	private createLabelFigure(parent: Composite, index: number, label: string,
		count: number, action?: GroupAction): BarFigure {

		// Bar Figure
		let figure = this.createBarFigure(parent, index, count, 1, 0, true);
		this.figures.set(label, figure);

		// Category Label
		let caption = this.createValuePanel(parent, index, label, count, 0, action);
		if (label === padang.NULL || label === padang.NULL_FLAG) {
			caption.setLabel("null");
			caption.setTextCss("color", "#888");
			caption.setTextCss("font-style", "italic");
		} else if (label === padang.ERROR) {
			caption.setTextCss("color", "#C44");
			caption.setTextCss("font-style", "italic");
		}

		return figure;

	}

	public setInspectProfile(table: VisageTable): void {
		if (table === null) {
			if (this.nullFigure !== null) {
				this.nullFigure.setInspectValue(0);
			}
			for (let key of this.figures.keys()) {
				let figure = this.figures.get(key);
				figure.setInspectValue(0);
			}
		} else {
			let recordCount = table.recordCount();
			let labels: string[] = [];
			for (let i = 0; i < recordCount; i++) {
				let record = table.getRecord(i);
				let label = record.getValue(1);
				let inspected = record.getValue(2);
				labels.push(label);
				if (this.figures.has(label)) {
					let figure = this.figures.get(label);
					figure.setInspectValue(inspected);
				}
				let children = this.chartPart.getChildren();
				for (let child of children) {
					let panel = child.getData();
					if (panel instanceof PropaneValuePanel) {
						if (panel.getLabel() === label) {
							panel.setInspect(inspected);
							panel.updateHint();
							break;
						}
					}
				}
			}
			for (let key of this.figures.keys()) {
				if (labels.indexOf(key) === -1) {
					let figure = this.figures.get(key);
					figure.setInspectValue(0);
				}
			}
		}
	}

	public setSelectionValues(values: Map<string, any>): void {
		let selections: BarFigure[] = [];
		if (values.has(IsNull.FUNCTION_NAME)) {
			selections.push(this.nullFigure);
		} else {
			for (let operator of values.keys()) {
				let label = values.get(operator);
				if (operator === TabularColumnInspectApplyRequest.EQ) {
					if (this.figures.has(label)) {
						let figure = this.figures.get(label);
						selections.push(figure);
					}
				}
			}
		}
		this.setSelections(selections);
		this.selectionValues = values;
	}

	public adjustHeight(): number {
		let height = super.adjustHeight();
		let keys = this.initialProfile.recordCount();
		return height + (keys * Propane.BAR_HEIGHT) + Propane.BAR_DOWN * 2;
	}

}

class LabelCount {
	constructor(
		public label: string,
		public count: number) {
	}
}

class GenericErrorAction extends GroupAction {

	private column: string = null;
	private menuSet: PropaneMenuSet = null;

	constructor(column: string, menuSet: PropaneMenuSet) {
		super();
		this.column = column;
		this.menuSet = menuSet;
	}

	public getActions(): Action[] {
		return this.menuSet.listErrorActions(this.column);
	}

}
