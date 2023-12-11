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
import Notification from "webface/model/Notification";

import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import NameListComboPanel from "padang/dialogs/guide/NameListComboPanel";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import ExpandList from "padang/functions/dataset/ExpandList";

export default class ExpandListDialog extends GuideDialog {

	private composite: Composite = null;
	private support: NameListSupport = null;
	private column: XText = null;

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 10, 10);

		this.support = new NameListSupport(this.conductor, ExpandList.COLUMN_PLAN);

		this.createColumnPart(this.composite);

	}

	private createColumnPart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Column");
		this.column = this.getText(ExpandList.COLUMN_PLAN);
		let panel = new NameListComboPanel(this.support, this.column);
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	public notifyChanged(notification: Notification): void {
		this.updatePageComplete();
	}

	public updatePageComplete(): void {
		this.setErrorMessage(null);
		this.okButton.setEnabled(true);
	}

}

let factory = GuideDialogFactory.getInstance();
factory.register(ExpandList.FUNCTION_NAME, ExpandListDialog);