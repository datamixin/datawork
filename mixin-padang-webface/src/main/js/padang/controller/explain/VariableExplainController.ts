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
import EObjectController from "webface/wef/base/EObjectController";

import XVariable from "padang/model/XVariable";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameListRequest from "padang/requests/VariableNameListRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import VariableExplainView from "padang/view/explain/VariableExplainView";

import VariableNameSetHandler from "padang/handlers/VariableNameSetHandler";
import VariableNameListHandler from "padang/handlers/VariableNameListHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import VariableFormulaSetHandler from "padang/handlers/VariableFormulaSetHandler";

export default class VariablePrepareController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VariableNameSetRequest.REQUEST_NAME, new VariableNameSetHandler(this));
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new VariableFormulaSetHandler(this));
		super.installRequestHandler(VariableNameSetRequest.REQUEST_NAME, new VariableNameSetHandler(this));
		super.installRequestHandler(VariableNameListRequest.REQUEST_NAME, new VariableNameListHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
	}

	public createView(): VariableExplainView {
		return new VariableExplainView(this);
	}

	public getModel(): XVariable {
		return <XVariable>super.getModel();
	}

	public getView(): VariableExplainView {
		return <VariableExplainView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshFormula();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

	private refreshFormula(): void {
		let model = this.getModel();
		let formula = model.getFormula();
		let view = this.getView();
		view.setFormula(formula);
	}

}
