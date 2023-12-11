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
import Panel from "webface/wef/Panel";

import Text from "webface/widgets/Text";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ModifyEvent from "webface/events/ModifyEvent";
import ModifyListener from "webface/events/ModifyListener";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

import ParameterPlan from "padang/plan/ParameterPlan";

import Credential from "padang/directors/credentials/Credential";

export default class CredentialComposerDialog extends TitleAreaDialog {

	public static ITEM_HEIGHT = 30;
	public static LABEL_WIDTH = 100;

	private credential: Credential = null;
	private modelName: string = null;
	private options: Map<string, any> = null;

	constructor(credential: Credential, modelName?: string, options?: Map<string, any>) {
		super();

		this.credential = credential;
		this.modelName = modelName;
		this.options = options === undefined ? new Map<string, any>() : options;

		let name = credential.getName();
		this.setWindowTitle("Credential Composer Dialog");
		this.setTitle("Credential: " + name);
		this.setDialogSize(420, 420);
	}

	public createControl(parent: Composite): void {

		let composite = new Composite(parent);

		// Layout
		widgets.setGridLayout(composite, 1, 10, 10);

		this.createNamePart(composite);
		this.createOptionsPanel(composite);
	}

	private createNamePart(parent: Composite): void {

		let namePart = new Composite(parent);
		widgets.setGridLayout(namePart, 2, 0, 0);
		widgets.setGridData(namePart, true, CredentialComposerDialog.ITEM_HEIGHT);

		this.createLabel(namePart);
		this.createText(namePart);
	}

	private createLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Name:");

		widgets.css(label, "line-height", CredentialComposerDialog.ITEM_HEIGHT + "px");
		widgets.setGridData(label, CredentialComposerDialog.LABEL_WIDTH, true);

	}

	private createText(parent: Composite): void {

		let text = new Text(parent);
		widgets.setGridData(text, true, true);

		text.addModifyListener(<ModifyListener>{
			modifyText: (_event: ModifyEvent) => {
				let name = text.getText();
				this.modelName = name;
				if (this.modelName) {
					this.updatePageComplete();
				}
			}
		});

		if (this.modelName !== null) {
			text.setText(this.modelName);
		}

	}

	private createOptionsPanel(parent: Composite): void {

		let optionsPart = new Composite(parent);
		widgets.setGridLayout(optionsPart, 1, 0, 0);
		widgets.setGridData(optionsPart, true, true);

		let plans = this.credential.getOptionPlans();
		for (let plan of plans) {
			let panel = new OptionPanel(this.options, plan);
			panel.createControl(optionsPart);
			widgets.setGridData(panel, true, CredentialComposerDialog.ITEM_HEIGHT);
		}

	}

	public updatePageComplete(): void {

		this.okButton.setEnabled(false);

		// Everthing OK!
		this.setErrorMessage(null);
		this.okButton.setEnabled(true);

	}

	public getName(): string {
		return this.modelName;
	}

	public getOptions(): Map<string, any> {
		return this.options;
	}

}

class OptionPanel implements Panel {

	private options: Map<string, any> = null;
	private plan: ParameterPlan = null;
	private composite: Composite = null;

	constructor(options: Map<string, any>, plan: ParameterPlan) {
		this.options = options;
		this.plan = plan;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		widgets.setGridLayout(this.composite, 2, 0, 0);
		widgets.setGridData(this.composite, true, CredentialComposerDialog.ITEM_HEIGHT);

		this.createLabel(this.composite);
		this.createText(this.composite);
	}

	private createLabel(parent: Composite): void {

		let label = new Label(parent);
		let name = this.plan.getLabel();
		label.setText(name);

		widgets.css(label, "line-height", CredentialComposerDialog.ITEM_HEIGHT + "px");
		widgets.setGridData(label, CredentialComposerDialog.LABEL_WIDTH, true);

	}

	private createText(parent: Composite): void {

		let text = new Text(parent);
		widgets.setGridData(text, true, true);

		let name = this.plan.getName();
		text.addModifyListener(<ModifyListener>{
			modifyText: (_event: ModifyEvent) => {
				let value = text.getText();
				this.options.set(name, value);
			}
		});

		if (this.options.has(name)) {
			let value = this.options.get(name);
			text.setText(value);
		}

	}

	public getControl(): Control {
		return this.composite;
	}

}
