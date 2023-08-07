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
import ListPlan from "webface/plan/ListPlan";

import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";
import XList from "sleman/model/XList";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import LabelNameListComboPanel from "padang/dialogs/guide/LabelNameListComboPanel";
import LabelItemListComboPanel from "padang/dialogs/guide/LabelItemListComboPanel";
import LabelNameElementListPanel from "padang/dialogs/guide/LabelNameElementListPanel";

import PivotRows from "padang/functions/dataset/PivotRows";
import GroupRows from "padang/functions/dataset/GroupRows";

export default class PivotRowsDialog extends GuideDialog {

	private composite: Composite = null;
	private support: NameListSupport = null;
	private rows: XList = null;
	private columns: XText = null;
	private values: XText = null;
	private aggregate: XText = null;

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1, 10, 10);

		let listPlan = <ListPlan>PivotRows.ROWS_PLAN.getAssignedPlan();
		let elementPlan = listPlan.getElement();
		this.support = new NameListSupport(this.conductor, elementPlan);

		this.createRowsPart(this.composite);
		this.createColumnsPart(this.composite);
		this.createValuesPart(this.composite);
		this.createAggregatePart(this.composite);

	}

	private createRowsPart(parent: Composite): void {
		this.rows = this.getList(PivotRows.ROWS_PLAN);
		let panel = new LabelNameElementListPanel("Rows", this.support, this.rows);
		panel.createControl(parent);
		this.relayoutRowsPanel();
	}

	private relayoutRowsPanel(): void {
		guide.relayoutPanel(this.composite, LabelNameElementListPanel);
	}

	private createColumnsPart(parent: Composite): void {
		this.columns = this.getText(PivotRows.COLUMNS_PLAN);
		let panel = new LabelNameListComboPanel("Columns", this.support, this.columns);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createValuesPart(parent: Composite): void {
		this.values = this.getText(PivotRows.VALUES_PLAN);
		let panel = new LabelNameListComboPanel("Values", this.support, this.values);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createAggregatePart(parent: Composite): void {
		this.aggregate = this.getText(PivotRows.AGGREGATE_PLAN);
		let functions = GroupRows.FUNCTIONS.concat(GroupRows.NONE);
		let panel = new LabelItemListComboPanel("Aggregate", functions, this.aggregate);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	public notifyChanged(): void {
		this.relayoutRowsPanel();
		this.updatePageComplete();
	}

	public updatePageComplete(): void {
		this.okButton.setEnabled(false);
		if (this.rows.getElementCount() === 0) {
			this.setErrorMessage("Please specify rows");
			return;
		}
		if (this.columns.getValue() === "") {
			this.setErrorMessage("Please specify columns");
			return;
		}
		if (this.values.getValue() === "") {
			this.setErrorMessage("Please specify values");
			return;
		}
		this.setErrorMessage(null);
		this.okButton.setEnabled(true);
	}

}

let factory = GuideDialogFactory.getInstance();
factory.register(PivotRows.FUNCTION_NAME, PivotRowsDialog);