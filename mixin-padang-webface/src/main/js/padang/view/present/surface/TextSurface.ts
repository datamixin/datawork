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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import Conductor from "webface/wef/Conductor";

import TextArea from "webface/widgets/TextArea";

import VisageText from "bekasi/visage/VisageText";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import LabelPanel from "padang/view/LabelPanel";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import ConstantSurface from "padang/view/present/surface/ConstantSurface";

export default class TextSurface extends ConstantSurface {

	public getText(value: VisageText): string {
		return value.getValue();
	}

	public createPanel(conductor: Conductor): SurfacePanel {
		return new TextSurfacePanel(conductor);
	}

}

class TextSurfacePanel extends SurfacePanel {

	private composite: Composite = null;
	private labelPanel = new LabelPanel(5);
	private iconPanel = new IconPanel();

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index);
		view.setAbsoluteLayout(this.composite);
		this.createLabelPanel(this.composite);
		this.createIconPanel(this.composite);
	}

	private createLabelPanel(parent: Composite): void {
		this.labelPanel.createControl(parent);
		view.css(this.labelPanel, "white-space", "pre");
		view.addClass(this.labelPanel, "padang-text-surface-panel");
	}

	private createIconPanel(parent: Composite): void {
		this.iconPanel.createControl(parent);
		this.iconPanel.setIcon("mdi-arrow-left-bottom");
		view.css(this.iconPanel, "font-size", "18px");
		view.css(this.iconPanel, "right", 5);
		this.iconPanel.setOnSelection(() => {
			let dialog = new TextSurfaceDialog();
			dialog.open(() => { });
			let text = this.labelPanel.getText();
			dialog.setValue(text);
		});
	}

	public setValue(value: any): void {
		let visible = false;
		if (value instanceof VisageText) {
			let text = value.getValue();
			visible = text.indexOf("\n") !== -1;
		}
		this.labelPanel.setText(value);
		this.setIconVisible(visible);
	}

	private setIconVisible(visible: boolean): void {
		view.css(this.iconPanel, "opacity", visible ? 1 : 0);
		view.css(this.iconPanel, "width", visible ? 18 : 0);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class TextSurfaceDialog extends Dialog {

	private promptLabel: Label = null;
	private value: string = "";
	private valueText: TextArea = null;
	private statusLabel: Label = null;

	constructor() {
		super();
		this.setDialogSize(420, 360);
		this.setWindowTitle("Text Dialog");
	}

	public createContents(parent: Composite): void {

		let composite = new Composite(parent);
		view.setGridLayout(composite, 1, 10, 10, 0, 0);

		this.createPromptLabel(composite);
		this.createTextPart(composite);
		this.createStatusLabel(composite);

	}

	private createPromptLabel(parent: Composite): void {
		this.promptLabel = new Label(parent);
		view.setGridData(this.promptLabel, true, 24);
	}

	private createTextPart(parent: Composite): void {

		this.valueText = new TextArea(parent);
		view.setGridData(this.valueText, true, true);

		let element = this.valueText.getElement();
		element.focus();

		let listener = () => {
			this.updateStatus();
		};
		element.on("click", listener);
		element.on("keydown", listener);

		this.updateValueText();
	}

	private createStatusLabel(parent: Composite): void {
		this.statusLabel = new Label(parent);
		view.setGridData(this.statusLabel, true, 18);
	}

	private updateValueText(): void {
		this.valueText.setText(this.value);
	}

	private updateStatus(): void {
		let element = this.valueText.getElement();
		let el = <HTMLInputElement>element[0];
		let start = el.selectionStart;
		let end = el.selectionEnd;
		if (start == end) {
			this.statusLabel.setText("Cursor at " + start);
		} else {
			this.statusLabel.setText("Selection from " + start + " to " + end);
		}

	}

	public createButtons(buttons: DialogButtons): void {
		let button = buttons.createOKButton();
		this.setDefaultButton(button);
	}

	public setValue(value: string): void {
		this.value = value;
		this.promptLabel.setText(value.length + " characters");
		if (this.valueText !== null) {
			this.updateValueText();
			this.updateStatus();
		}
	}

	protected postOpen(): void {
		this.valueText.forceFocus();
	}

	public getValue(): string {
		return this.value;
	}

}

let factory = SurfaceRegistry.getInstance();
factory.register(VisageText.LEAN_NAME, new TextSurface());
