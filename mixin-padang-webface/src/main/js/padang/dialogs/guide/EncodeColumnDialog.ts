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

import XCall from "sleman/model/XCall";
import XText from "sleman/model/XText";
import XReference from "sleman/model/XReference";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import FunctionPanel from "padang/dialogs/guide/FunctionPanel";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import NameElementListPanel from "padang/dialogs/guide/NameElementListPanel";

import LabelEncoder from "padang/functions/encoder/LabelEncoder";

import EncodeColumn from "padang/functions/dataset/EncodeColumn";

export default class EncodeColumnDialog extends GuideDialog {

	private composite: Composite = null;
	private columnSupport: NameListSupport = null;
	private columnText: XText = null;
	private encoderSupport: NameListSupport = null;
	private encoderCall: XCall = null;
	private encoderPart: Composite = null;
	private encoderPanel: FunctionPanel = null;
	private panelRegistry = {
		LabelEncoder: LabelEncoderPanel,
	}

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 10, 10);

		this.columnSupport = new NameListSupport(this.conductor, EncodeColumn.COLUMN_PLAN);
		this.encoderSupport = new NameListSupport(this.conductor, EncodeColumn.ENCODER_PLAN);

		this.createColumnPart(this.composite);
		this.createEncoderCombo(this.composite);
		this.createEncoderPart(this.composite);
		this.updatePageComplete();
	}

	private createColumnPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Column");
		this.columnText = this.getText(EncodeColumn.COLUMN_PLAN);
		let panel = new NameListComboPanel(this.columnSupport, this.columnText);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createEncoderCombo(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Encoder");
		this.encoderCall = this.getCall(EncodeColumn.ENCODER_PLAN);
		let callee = <XReference>this.encoderCall.getCallee();
		let panel = new NameListComboPanel(this.encoderSupport, callee);
		panel.createControl(parent);
		panel.setOnChange((name: string) => {
			this.createEncoderPanel(name, this.encoderCall, true);
		});
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createEncoderPanel(name: string, call: XCall, reset: boolean): void {
		let panelType = this.panelRegistry[name];
		if (this.encoderPanel !== null) {
			widgets.dispose(this.encoderPanel);
		}
		this.encoderPanel = new panelType(this, call, reset);
		this.encoderPanel.createControl(this.encoderPart);
		widgets.setGridData(this.encoderPanel, true, true);
		this.encoderPart.relayout();
	}

	private createEncoderPart(parent: Composite): void {
		this.encoderPart = new Composite(parent);
		widgets.setGridLayout(this.encoderPart, 1, 0, 0);
		let layoutData = widgets.setGridData(this.encoderPart, true, true);
		layoutData.horizontalSpan = 2;
		let callee = <XReference>this.encoderCall.getCallee();
		let name = callee.getName();
		this.createEncoderPanel(name, this.encoderCall, false);
	}

	private relayoutListPanel(): void {
		guide.relayoutPanel(this.composite, NameElementListPanel);
	}

	public notifyChanged(_notification: Notification): void {
		this.relayoutListPanel();
		this.updatePageComplete();
	}

	public updatePageComplete(): void {
		this.setErrorMessage(null);
		if (this.columnText.getValue() === "") {
			this.setErrorMessage("Please specify column");
			return;
		}
		let message = this.encoderPanel.validate();
		if (message !== null) {
			this.setErrorMessage(message);
			return;
		}
		this.okButton.setEnabled(true);
	}

}

class LabelEncoderPanel extends FunctionPanel {

	private composite: Composite = null;

	constructor(dialog: GuideDialog, call: XCall, reset: boolean) {
		super(dialog, LabelEncoder.getPlan(), call, reset);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		widgets.setGridLayout(this.composite, 2, 0, 0);

	}

	public validate(): string {
		return null;
	}

	public getControl(): Control {
		return this.composite;
	}

}

let factory = GuideDialogFactory.getInstance();
factory.register(EncodeColumn.FUNCTION_NAME, EncodeColumnDialog);