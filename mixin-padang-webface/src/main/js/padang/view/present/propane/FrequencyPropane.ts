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
import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import VisageType from "bekasi/visage/VisageType";
import VisageTable from "bekasi/visage/VisageTable";

import * as padang from "padang/padang";

import * as view from "padang/view/view";

import IsNull from "padang/functions/logical/IsNull";

import Propane from "padang/view/present/propane/Propane";
import { BarFigure } from "padang/view/present/propane/Propane";
import PropaneFactory from "padang/view/present/propane/PropaneFactory";
import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";
import PropaneValuePanel from "padang/view/present/propane/PropaneValuePanel";

import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";
import TabularColumnFrequencySortRequest from "padang/requests/TabularColumnFrequencySortRequest";

export default class FrequencyPropane extends Propane {

	public static LIMIT = 11;
	public static OTHERS_LABEL = "Others ";

	private figures = new Map<string | boolean, BarFigure>();
	private initialProfile: VisageTable = null;
	private inspectProfile: VisageTable = null;
	private selectionValues = new Map<string, BarFigure>();
	private nulls: number = 0;
	private hides: number = 0;
	private total: number = 0;
	private exists: number = 0;
	private distincts: number = 0;
	private othersFigure: BarFigure = null;
	private iconListPart: Composite = null;
	private currentIcon: WebFontIcon = null;
	private labelCounts: LabelCount[] = [];
	private chartPart: Composite = null;

	public setInitialProfile(table: VisageTable): void {
		this.initialProfile = table;
		view.dispose(this.nullPart);
		view.dispose(this.nullFigure);
		view.dispose(this.chartPart);
		view.dispose(this.iconListPart);
	}

	public populateFigure(): void {
		this.buildDistribution();
		this.createIconListPart(this.composite);
		this.createNullPart(this.composite);
		this.populateBarFigures(this.composite);
		this.composite.relayout();
	}

	private buildDistribution(): void {
		this.nulls = 0;
		this.total = 0;
		this.hides = 0;
		this.exists = 0;
		this.distincts = 0;
		this.maximum = 0;
		this.labelCounts = [];
		this.figures.clear();
		let recordCount = this.initialProfile.recordCount();
		for (let i = 0; i < recordCount; i++) {
			let record = this.initialProfile.getRecord(i);
			let label = record.getValue(1);
			let count = record.getValue(2);
			if (label === padang.NULL_FLAG) {
				this.nulls = count;
			} else {
				if (label === padang.EXISTS_FLAG) {
					this.exists = count;
				} else if (label === padang.DISTINCTS_FLAG) {
					this.distincts = count;
				} else {
					if (i < FrequencyPropane.LIMIT + 2) {
						let labelCount = new LabelCount(label, count);
						this.labelCounts.push(labelCount);
					} else {
						this.hides += count;
					}
					this.total += count;
					this.maximum = Math.max(this.maximum, count);
				}
			}
		}
		if (this.hides > 0) {
			this.adjustLastLabelCount();
		}
	}

	private adjustLastLabelCount(): void {
		let last = this.labelCounts[this.labelCounts.length - 1];
		let others = 1 + this.distincts - this.labelCounts.length;
		last.label = FrequencyPropane.OTHERS_LABEL + others;
		last.count = last.count + (this.exists - this.total + this.hides);
		this.maximum = Math.max(this.maximum, last.count);
	}

	private createIconListPart(parent: Composite): void {
		this.iconListPart = new Composite(parent);
		view.addClass(this.iconListPart, "padang-frequency-propane-icon-list-part");
		view.setAbsoluteLayout(this.iconListPart);
		view.setGridData(this.iconListPart, true, Propane.BAR_HEIGHT);
		let icon = this.createIcon(this.iconListPart, ["mdi-sort-alphabetical-ascending"], 3, true, true);
		this.createIcon(this.iconListPart, ["mdi-sort-alphabetical-descending"], 2, true, false);
		this.createIcon(this.iconListPart, ["mdi-sort-variant", "mdi-flip-v"], 1, false, true);
		this.createIcon(this.iconListPart, ["mdi-sort-variant"], 0, false, false);
		this.currentIcon = icon;
		view.setSelected(this.currentIcon, true);
	}

	private createIcon(parent: Composite, paths: string[],
		index: number, label: boolean, ascending: boolean): WebFontIcon {
		let icon = new WebFontIcon(parent);
		icon.addClass("mdi");
		for (let path of paths) {
			icon.addClass(path);
		}
		let element = icon.getElement();
		element.css("line-height", Propane.BAR_HEIGHT + "px");
		element.css("font-size", Propane.BAR_HEIGHT + "px");
		element.css("cursor", "pointer");
		icon.onSelection(() => {

			if (this.distincts < FrequencyPropane.LIMIT) {
				this.labelCounts = this.labelCounts.sort((a: LabelCount, b: LabelCount) => {
					if (label) {
						let aLabel = a.label.toString();
						let bLabel = b.label.toString();
						return (ascending ? 1 : -1) * aLabel.localeCompare(bLabel);
					} else {
						return (ascending ? 1 : -1) * (a.count - b.count);
					}
				});

				this.populateBarFigures(this.composite);
				this.setInspectProfile(this.inspectProfile);
				this.setSelectionValues(this.selectionValues);
				this.selectIcon(index);

			} else {
				let request = new TabularColumnFrequencySortRequest(this.column, label, ascending);
				this.conductor.submit(request, (table: VisageTable) => {

					// Total pilihan valu sebelum-nya	
					let previous = 0;
					for (let selection of this.selections) {
						let control = selection.getControl();
						let labelCount = <LabelCount>control.getData();
						previous += labelCount.count;
					}

					this.setInitialProfile(table);
					this.populateFigure();
					this.setInspectProfile(this.inspectProfile);
					this.setSelectionValues(this.selectionValues);
					this.selectIcon(index);

					if (this.selections.length === 0) {
						this.othersFigure.setInspectValue(previous);
					}
				});
			}

		});
		let layoutData = view.setAbsoluteData(icon, -1, 0, Propane.BAR_HEIGHT, Propane.BAR_HEIGHT);
		layoutData.right = index * (Propane.BAR_HEIGHT + 4);
		return icon;
	}

	private selectIcon(index: number): void {
		if (this.currentIcon !== null) {
			view.setSelected(this.currentIcon, false);
			let children = this.iconListPart.getChildren();
			let pos = children.length - (index + 1);
			this.currentIcon = <WebFontIcon>children[pos];
			view.setSelected(this.currentIcon, true);
		}
	}

	private createNullPart(parent: Composite): void {
		if (this.nulls > 0) {
			this.createNullFigure(parent, this.nulls);
		}
	}

	private populateBarFigures(parent: Composite): void {

		if (this.chartPart !== null) {
			this.chartPart.dispose();
		}

		this.chartPart = new Composite(parent);
		view.addClass(this.chartPart, "padang-frequency-propane-chart-part");
		view.setAbsoluteLayout(this.chartPart);
		let layoutData = view.setGridData(this.chartPart, true, this.labelCounts.length * Propane.BAR_HEIGHT);
		layoutData.verticalIndent = this.nulls === 0 ? 0 : -3;

		// Figure and Label
		for (let i = 0; i < this.labelCounts.length; i++) {

			// Label count
			let labelCount = this.labelCounts[i];
			let label = labelCount.label;
			let count = labelCount.count;

			// Action
			let others = false;
			let logical = false;
			if (label === true || label === false) {
				logical = true;
			} else {
				others = label.startsWith(FrequencyPropane.OTHERS_LABEL);
			}
			let action: GroupAction;
			if (!others) {
				action = new FrequencyLabelAction(this.column, this.menuSet, label);
			}

			// Figure
			let figure = this.createLabelFigure(this.chartPart, i, label, logical, count, action);
			let control = figure.getControl();
			control.setData(labelCount);
			if (others) {
				this.othersFigure = figure;
			}

		}
		this.composite.relayout();
	}

	private createLabelFigure(parent: Composite, index: number, label: string | boolean,
		logical: boolean, count: number, action?: GroupAction): BarFigure {

		// Bar Figure
		let figure = this.createBarFigure(parent, index, count, 1, 0);
		this.figures.set(label, figure);

		// Category Label
		let blank = "";
		let text = label === blank ? "Blank" : label.toString();
		let caption = this.createValuePanel(parent, index, text, count, 0, action);
		caption.setOnSelection(() => {
			let text = label.toString();
			if (!text.startsWith(FrequencyPropane.OTHERS_LABEL)) {
				let map = new Map<string, any>();
				let values = map.set(TabularColumnInspectApplyRequest.EQ, label);
				let request = new TabularColumnInspectApplyRequest(this.column, this.type, values);
				this.conductor.submit(request);
			}
		});

		let special = label === blank;
		if (logical === false && special === false) {
			let text = <string>label;
			special = text.startsWith(FrequencyPropane.OTHERS_LABEL);
		}
		if (special) {
			view.css(caption, "font-style", "italic");
			view.css(caption, "color", "#888");
		}

		return figure;

	}

	public setInspectProfile(table: VisageTable): void {
		if (this.nullFigure !== null) {
			this.nullFigure.setInspectValue(0);
		}
		if (table === null) {
			for (let key of this.figures.keys()) {
				let figure = this.figures.get(key);
				figure.setInspectValue(0);
			}
		} else {
			let recordCount = table.recordCount();
			let labels: (string | boolean)[] = [];
			for (let i = 0; i < recordCount; i++) {
				let record = table.getRecord(i);
				let label = record.getValue(1);
				let inspected = record.getValue(2);
				labels.push(label);
				if (label === padang.NULL_FLAG) {
					if (this.nullFigure !== null) {
						this.nullFigure.setInspectValue(inspected);
					}
				} else {
					if (this.figures.has(label)) {
						let figure = this.figures.get(label);
						figure.setInspectValue(inspected);
					}
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
		this.inspectProfile = table;
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
		return height + FrequencyPropane.LIMIT * Propane.BAR_HEIGHT;
	}

}

class LabelCount {
	constructor(
		public label: string | boolean,
		public count: number) {
	}
}

class FrequencyLabelAction extends GroupAction {

	private column: string = null;
	private menuSet: PropaneMenuSet = null;
	private label: string | boolean = null;

	constructor(column: string, menuSet: PropaneMenuSet, label: string | boolean) {
		super();
		this.column = column;
		this.menuSet = menuSet;
		this.label = label;
	}

	public getActions(): Action[] {
		return this.menuSet.listCategoryActions(this.column, this.label);
	}

}

let factory = PropaneFactory.getInstance();
factory.register(VisageType.STR, <any>FrequencyPropane);
factory.register(VisageType.STRING, <any>FrequencyPropane);
factory.register(VisageType.BOOL, <any>FrequencyPropane);
factory.register(VisageType.BOOL_, <any>FrequencyPropane);
