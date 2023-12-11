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
import ListPlan from "webface/plan/ListPlan";

import Composite from "webface/widgets/Composite";

import Notification from "webface/model/Notification";

import XList from "sleman/model/XList";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import * as guide from "padang/dialogs/guide/guide";
import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";
import NameElementListPanel from "padang/dialogs/guide/NameElementListPanel";

import RemoveColumns from "padang/functions/dataset/RemoveColumns";

export default class RemoveColumnsDialog extends GuideDialog {

	private composite: Composite = null;
	private support: NameListSupport = null;
	private keys: XList = null;

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 10, 10);

		let listPlan = <ListPlan>RemoveColumns.KEYS_PLAN.getAssignedPlan();
		let elementPlan = listPlan.getElement();
		this.support = new NameListSupport(this.conductor, elementPlan);
		this.createKeysPart(this.composite);
	}

	private createKeysPart(parent: Composite): void {
		this.keys = this.getList(RemoveColumns.KEYS_PLAN);
		dialogs.createLabelGridLabel(parent, "Column Names");
		let panel = new NameElementListPanel(this.support, this.keys);
		panel.createControl(parent);
		this.relayoutListPanel();
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
		let elements = this.keys.getElements();
		if (elements.size === 0) {
			this.setErrorMessage("Please add column to remove");
			return;
		}
		this.okButton.setEnabled(true);
	}

}


let factory = GuideDialogFactory.getInstance();
factory.register(RemoveColumns.FUNCTION_NAME, RemoveColumnsDialog);