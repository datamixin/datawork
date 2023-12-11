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
import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import FillLayout from "webface/layout/FillLayout";

export default class MutationInsertDecisionDialog extends Dialog {

	public static JUST_INSERT = "Just Insert";
	public static WITH_CUTOFF = "With Cutoff";

	constructor() {
		super();
		super.setDialogSize(Dialog.MIN_WIDTH * 2, Dialog.MIN_HEIGHT);
		this.setWindowTitle("Mutation Insert Dialog");
	}

	public createContents(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new FillLayout(webface.VERTICAL, 20, 20);
		composite.setLayout(layout);

		this.createPromptLabel(composite);

	}

	private createPromptLabel(parent: Composite): void {

		let prompt = "You are modifying intermediate result, mutation will be inserted!\n" +
			"Just insert the new mutation or with cutoff proceeding mutation?";

		let label = new Label(parent);
		label.setText(prompt);

		let element = label.getElement();
		element.css("line-height", "24px");
		element.css("white-space", "pre-wrap");
	}

	public createButtons(buttons: DialogButtons): void {
		buttons.createCompleteButton(MutationInsertDecisionDialog.JUST_INSERT, "btn-primary");
		buttons.createCompleteButton(MutationInsertDecisionDialog.WITH_CUTOFF, "btn-success");
		buttons.createCancelButton();
	}

}
