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
import Notification from "webface/model/Notification";

import EObjectController from "webface/wef/base/EObjectController";
import BaseSelectionHandler from "webface/wef/base/BaseSelectionHandler";

import XVariable from "padang/model/XVariable";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

import VariablePresentView from "padang/view/present/VariablePresentView";

import VariableNameSetHandler from "padang/handlers/VariableNameSetHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import VariableFormulaSetHandler from "padang/handlers/VariableFormulaSetHandler";
import VariableNameValidationHandler from "padang/handlers/VariableNameValidationHandler";

import VariableSelectRequest from "padang/requests/present/VariableSelectRequest";

export default class VariablePresentController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VariableSelectRequest.REQUEST_NAME, new BaseSelectionHandler(this));
		super.installRequestHandler(VariableNameSetRequest.REQUEST_NAME, new VariableNameSetHandler(this));
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new VariableFormulaSetHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		super.installRequestHandler(VariableNameValidationRequest.REQUEST_NAME, new VariableNameValidationHandler(this));
	}

	public getModel(): XVariable {
		return <XVariable>super.getModel();
	}

	public createView(): VariablePresentView {
		return new VariablePresentView(this);
	}

	public getView(): VariablePresentView {
		return <VariablePresentView>super.getView();
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

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);

		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {

			let feature = notification.getFeature();
			if (feature === XVariable.FEATURE_NAME) {

				this.refreshName();

			} else if (feature === XVariable.FEATURE_FORMULA) {

				this.refreshFormula();

			}
		}
	}

}

