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
import Conductor from "webface/wef/Conductor";

import TextArea from "webface/widgets/TextArea";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import LiteralFormula from "bekasi/LiteralFormula";

import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

export default class FunctionEditorDialog extends TitleAreaDialog {

	private conductor: Conductor = null;
	private formula: LiteralFormula = null;
	private validation: string = null;
	private editor: TextArea = null;

	constructor(conductor: Conductor, formula: LiteralFormula) {
		super();
		this.conductor = conductor;
		this.setDialogSize(540, 420);
		this.setWindowTitle("Formula Editor Dialog");
		this.setTitle("Formula Editor");
		this.setMessage("Please specify formula literal");
		this.formula = formula;
	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let layout = new GridLayout(1);
		composite.setLayout(layout);

		this.createEditor(composite);

		// Prevent close saat enter
		this.setDefaultButton(null);

	}

	protected defaultEnter(): void {

	}

	private createEditor(parent: Composite): void {

		this.editor = new TextArea(parent);

		let element = this.editor.getElement();
		element.attr("content-editable", "true");

		let layoutData = new GridData(true, true);
		this.editor.setLayoutData(layoutData);

		if (this.formula.isConstant()) {
			this.editor.setText(this.formula.literal);
		} else {
			let request = new FormulaFormatRequest(this.formula.literal);
			this.conductor.submit(request, (formula: string) => {
				this.editor.setText("=" + formula);
			});
		}

		this.editor.onModify((text: string) => {
			let request = new FormulaValidationRequest(text);
			this.conductor.submit(request, (validation: string) => {
				this.validation = validation;
				this.formula.literal = text;
				this.updatePageComplete();
			});
		});

		this.okButton.setEnabled(false);

	}

	public updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		if (this.validation !== null) {
			this.setErrorMessage(this.validation);
			return;
		}

		this.okButton.setEnabled(true);
	}

	public getFormula(): LiteralFormula {
		return this.formula;
	}

}
