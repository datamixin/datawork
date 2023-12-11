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
import Text from "webface/widgets/Text";
import Label from "webface/widgets/Label";
import Switch from "webface/widgets/Switch";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/functions";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Selection from "webface/viewers/Selection";
import ListViewer from "webface/viewers/ListViewer";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

export default class NumberFormatDialog extends TitleAreaDialog {

	private static LABEL_WIDTH = 72;
	private static ITEM_HEIGHT = 24;

	private enableSwitch: Switch = null;
	private sample: number = null;
	private sampleLabel: Label = null;
	private format: string = null;
	private formatText: Text = null;
	private patternViewer: ListViewer = null;

	constructor(format?: string, sample?: number) {
		super();
		this.setDialogSize(360, 420);
		this.setWindowTitle("Number Format Dialog");
		this.setTitle("Number Format");
		this.setMessage("Please specify format");
		this.format = format !== undefined ? format : null;
		this.sample = sample !== undefined ? sample : 1.2;
	}

	public createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(2, 10, 5);
		composite.setLayout(layout);

		this.createEnableSwitch(composite);
		this.createSampleLabel(composite);
		this.createFormatText(composite);
		this.createPatternViewer(composite);
		this.updateState();
		this.updateSample();

	}

	private createEnableSwitch(parent: Composite): void {

		this.createLabel(parent, NumberFormatDialog.LABEL_WIDTH, "Enable");

		this.enableSwitch = new Switch(parent);
		this.enableSwitch.setSelection(this.format !== null);

		let layoutData = new GridData(true, NumberFormatDialog.ITEM_HEIGHT);
		this.enableSwitch.setLayoutData(layoutData);

		this.enableSwitch.onSelection((state: boolean) => {
			if (state === true) {
				this.format = this.formatText.getText();
			} else {
				this.format = null;
			}
			this.updateState();
			this.updatePageComplete();
		});
	}

	private createSampleLabel(parent: Composite): void {
		this.createLabel(parent, NumberFormatDialog.LABEL_WIDTH, "Sample");
		this.sampleLabel = this.createLabel(parent, true);
	}

	private updateState(): void {
		this.formatText.setEnabled(this.format !== null);
		this.patternViewer.setEnabled(this.format !== null);
		this.updateSample();
	}

	private createFormatText(parent: Composite): void {

		this.createLabel(parent, NumberFormatDialog.LABEL_WIDTH, "Format");

		this.formatText = new Text(parent);
		this.formatText.setText(this.format);

		let element = this.formatText.getElement();
		element.css("line-height", (NumberFormatDialog.ITEM_HEIGHT - 2) + "px");

		let layoutData = new GridData(true, NumberFormatDialog.ITEM_HEIGHT);
		this.formatText.setLayoutData(layoutData);

		this.formatText.onModify((text: string) => {
			this.format = text;
			this.updateSample();
			this.updatePageComplete();
		});

	}

	private createPatternViewer(parent: Composite): void {

		this.createLabel(parent, NumberFormatDialog.LABEL_WIDTH);

		this.patternViewer = new ListViewer(parent);

		let layoutData = new GridData(true, true);
		this.patternViewer.setLayoutData(layoutData);

		this.patternViewer.setInput([
			"0", "0.00", "#,##0", "#,##0.00", "$#,##0", "$#,##0.00",
			"0%", "0.00%", "0,00e+0",
			"dd/MM/yy", "dd-MMM-yy", "MMM-yyyy", "yyyy 'W'WW", "HH:mm:ss"
		]);

		this.patternViewer.addSelectionChangedListener(<SelectionChangedListener>{

			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (!selection.isEmpty()) {
					let element = selection.getFirstElement();
					this.formatText.setText(element);
					this.format = element;
					this.updateSample();
					this.updatePageComplete();
				}
			}

		});

		if (this.format !== null) {
			let selection = new Selection(this.format);
			this.patternViewer.setSelection(selection)
		}

	}

	private createLabel(parent: Composite, width: boolean | number, text?: string): Label {

		let label = new Label(parent);
		if (text) {
			label.setText(text);
		}

		let element = label.getElement();
		element.css("line-height", NumberFormatDialog.ITEM_HEIGHT + "px");

		let layoutData = new GridData(width, NumberFormatDialog.ITEM_HEIGHT);
		label.setLayoutData(layoutData);

		return label;

	}

	private updateSample(): void {
		if (this.format !== null) {
			let text = functions.formatNumber(this.sample, this.format);
			this.sampleLabel.setText(text);
		} else {
			this.sampleLabel.setText(<any>this.sample);
		}
	}

	protected updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		if (this.enableSwitch.getSelection() === true && (this.format === null || this.format.length === 0)) {
			this.setErrorMessage("Please define number format");
			return;
		}

		this.okButton.setEnabled(true);
	}

	public getFormat(): string {
		return this.format;
	}

}