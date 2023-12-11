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
import Composite from "webface/widgets/Composite";

import * as functions from "webface/util/functions";

import XText from "sleman/model/XText";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import AddColumn from "padang/functions/dataset/AddColumn";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import NameListSupport from "padang/dialogs/guide/NameListSupport";
import GuideDialogFactory from "padang/dialogs/guide/GuideDialogFactory";

import ValueTextPanel from "padang/dialogs/guide/ValueTextPanel";
import ForeachEditorPanel from "padang/dialogs/guide/ForeachEditorPanel";

import ColumnFunction from "padang/functions/dataset/ColumnFunction";

export default class AddColumnDialog extends GuideDialog {

	private composite: Composite = null;
	private support: NameListSupport = null;
	private name: XText = null;
	private expressionPanel: ForeachEditorPanel = null;

	protected createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 2, 10, 10);

		this.support = new NameListSupport(this.conductor, ColumnFunction.SPECIFIED_PLAN);

		this.createNamePart(this.composite);
		this.createExpressionPart(this.composite);

	}

	private createNamePart(parent: Composite): void {
		dialogs.createLabelGridLabel(parent, "Column Name");
		this.name = this.getText(AddColumn.NAME_PLAN);
		let panel = new ValueTextPanel(this.name);
		this.support.load((names: string[]) => {
			let defaultName = "Column";
			let text = this.name.getValue();
			if (text === defaultName) {
				text = functions.getIncrementedName(defaultName, names);
				this.name.setValue(text);
			}
			panel.setText(this.name);
		});
		panel.createControl(parent);
		widgets.setGridData(panel, true, dialogs.ITEM_HEIGHT);
	}

	private createExpressionPart(parent: Composite): void {
		let foreach = this.getForeach(AddColumn.EXPRESSION_PLAN);
		dialogs.createLabelGridLabel(parent, "Expression");
		this.expressionPanel = new ForeachEditorPanel(this.conductor, this, foreach);
		this.expressionPanel.createControl(parent);
		widgets.setGridData(this.expressionPanel, true, true);
	}

	public notifyChanged(): void {
		this.updatePageComplete();
	}

	public updatePageComplete(): void {
		this.setErrorMessage(null);
		let name = this.name.getValue();
		if (name === "") {
			this.setErrorMessage("Please specify name");
			return;
		} else {
			this.support.load((names: string[]) => {
				if (names.indexOf(name) === -1) {
					this.expressionPanel.updatePanelComplete((message: string) => {
						if (message === null) {
							this.okButton.setEnabled(true);
						} else {
							this.setErrorMessage(message);
						}
					});
				} else {
					this.setErrorMessage("Column name '" + name + "' already exists");
				}
			});
		}
	}

}

let factory = GuideDialogFactory.getInstance();
factory.register(AddColumn.FUNCTION_NAME, AddColumnDialog);