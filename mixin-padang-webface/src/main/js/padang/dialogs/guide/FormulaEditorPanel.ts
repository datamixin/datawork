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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import FormulaParser from "bekasi/FormulaParser";
import LiteralFormula from "bekasi/LiteralFormula";

import ParameterPlan from "padang/plan/ParameterPlan";

import FormulaEditor from "padang/widgets/FormulaEditor";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

export default class FormulaEditorPanel implements Panel {

	private dialog: GuideDialog = null
	private plan: ParameterPlan = null;
	private editor: FormulaEditor = null;

	constructor(dialog: GuideDialog, plan: ParameterPlan) {
		this.dialog = dialog;
		this.plan = plan;
	}

	public createControl(parent: Composite): void {
		this.editor = new FormulaEditor(parent);
		this.update();
		let callback = (text: string, confirm?: (state: boolean) => void) => {
			try {
				let parser = new FormulaParser();
				let expression = parser.parse(text);
				this.dialog.setOption(this.plan, expression);
				this.dialog.updatePageComplete();
				if (confirm !== undefined)
					confirm(true);
			} catch (error) {
				this.dialog.setErrorMessage(error.message);
				if (confirm !== undefined)
					confirm(false);
			}
		};
		this.editor.setOnCommit(callback);
		this.editor.setOnModify(callback);
	}

	private update(): void {
		let expression = this.dialog.getOption(this.plan);
		if (expression !== null) {
			let formula = new LiteralFormula(expression);
			this.editor.setFormula(formula);
		}
	}

	public getValue(): string {
		return this.editor.getText()
	}

	public getControl(): Control {
		return this.editor;
	}

}