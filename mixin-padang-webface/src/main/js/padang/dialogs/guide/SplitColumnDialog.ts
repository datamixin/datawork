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

import Notification from "webface/model/Notification";

import XText from "sleman/model/XText";
import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XNumber from "sleman/model/XNumber";
import XLogical from "sleman/model/XLogical";
import XReference from "sleman/model/XReference";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import FunctionPanel from "padang/dialogs/guide/FunctionPanel";
import ValueTextPanel from "padang/dialogs/guide/ValueTextPanel";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import ValueNumberPanel from "padang/dialogs/guide/ValueNumberPanel";
import ValueLogicalPanel from "padang/dialogs/guide/ValueLogicalPanel";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import ValueNumberListPanel from "padang/dialogs/guide/ValueNumberListPanel";

import SplitColumn from "padang/functions/dataset/SplitColumn";

import SplitByDelimiter from "padang/functions/splitter/SplitByDelimiter";
import SplitByPositions from "padang/functions/splitter/SplitByPositions";

export default class SplitColumnDialog extends GuideDialog {

	private composite: Composite = null;
	private columnSupport: NameListSupport = null;
	private columnText: XText = null;
	private splitterSupport: NameListSupport = null;
	private splitterCall: XCall = null;
	private splitterPart: Composite = null;
	private splitterPanel: FunctionPanel = null;
	private panelRegistry = {
		SplitByDelimiter: SplitByDelimiterPanel,
		SplitByPositions: SplitByPositionsPanel
	}

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 10, 10);

		this.columnSupport = new NameListSupport(this.conductor, SplitColumn.COLUMN_PLAN);
		this.splitterSupport = new NameListSupport(this.conductor, SplitColumn.SPLITTER_PLAN);

		this.createColumnPart(this.composite);
		this.createSplitterCombo(this.composite);
		this.createSplitterPart(this.composite);
		this.updatePageComplete();
	}

	private createColumnPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Column");
		this.columnText = this.getText(SplitColumn.COLUMN_PLAN);
		let panel = new NameListComboPanel(this.columnSupport, this.columnText);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createSplitterCombo(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Splitter");
		this.splitterCall = this.getCall(SplitColumn.SPLITTER_PLAN);
		let callee = <XReference>this.splitterCall.getCallee();
		let panel = new NameListComboPanel(this.splitterSupport, callee);
		panel.createControl(parent);
		panel.setOnChange((name: string) => {
			this.createSplitterPanel(name, this.splitterCall, true);
		});
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createSplitterPanel(name: string, call: XCall, reset: boolean): void {
		let panelType = this.panelRegistry[name];
		if (this.splitterPanel !== null) {
			widgets.dispose(this.splitterPanel);
		}
		this.splitterPanel = new panelType(this, call, reset);
		this.splitterPanel.createControl(this.splitterPart);
		widgets.setGridData(this.splitterPanel, true, true);
		this.splitterPart.relayout();
	}

	private createSplitterPart(parent: Composite): void {
		this.splitterPart = new Composite(parent);
		widgets.setGridLayout(this.splitterPart, 1, 0, 0);
		let layoutData = widgets.setGridData(this.splitterPart, true, true);
		layoutData.horizontalSpan = 2;
		let callee = <XReference>this.splitterCall.getCallee();
		let name = callee.getName();
		this.createSplitterPanel(name, this.splitterCall, false);
	}

	public notifyChanged(_notification: Notification): void {
		this.updatePageComplete();
	}

	public updatePageComplete(): void {
		this.setErrorMessage(null);
		if (this.columnText.getValue() === "") {
			this.setErrorMessage("Please specify column");
			return;
		}
		let message = this.splitterPanel.validate();
		if (message !== null) {
			this.setErrorMessage(message);
			return;
		}
		this.okButton.setEnabled(true);
	}

}

class SplitByDelimiterPanel extends FunctionPanel {

	private composite: Composite = null;
	private delimiter: XText = null;
	private regex: XLogical = null;
	private limit: XNumber = null;

	constructor(dialog: GuideDialog, call: XCall, reset: boolean) {
		super(dialog, SplitByDelimiter.getPlan(), call, reset);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 0, 0);

		this.createDelimiterPart(this.composite);
		this.createRegexPart(this.composite);
		this.createLimitPart(this.composite);

	}

	private createDelimiterPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Delimiter");
		this.delimiter = this.getText(SplitByDelimiter.DELIMITER_PLAN);
		let panel = new ValueTextPanel(this.delimiter);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createRegexPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Regex");
		this.regex = this.getLogical(SplitByDelimiter.REGEX_PLAN);
		let panel = new ValueLogicalPanel(this.regex);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createLimitPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Limit");
		this.limit = this.getNumber(SplitByDelimiter.LIMIT_PLAN);
		let panel = new ValueNumberPanel(this.limit);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	public validate(): string {
		return null;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class SplitByPositionsPanel extends FunctionPanel {

	private composite: Composite = null;
	private positions: XList = null;
	private trim: XLogical = null;

	constructor(dialog: GuideDialog, call: XCall, reset: boolean) {
		super(dialog, SplitByPositions.getPlan(), call, reset);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 0, 0);

		this.createDelimiterPart(this.composite);
		this.createTrimPart(this.composite);

	}

	private createDelimiterPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Positions");
		this.positions = this.getList(SplitByPositions.POSITIONS_PLAN);
		let panel = new ValueNumberListPanel(this.positions);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createTrimPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Trim");
		this.trim = this.getLogical(SplitByPositions.TRIM_PLAN);
		let panel = new ValueLogicalPanel(this.trim);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	public validate(): string {
		return null;
	}

	public getControl(): Control {
		return this.composite;
	}

}

let factory = GuideDialogFactory.getInstance();
factory.register(SplitColumn.FUNCTION_NAME, SplitColumnDialog);