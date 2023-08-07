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
import * as wef from "webface/wef";

import EList from "webface/model/EList";
import EReference from "webface/model/EReference";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import DeferredEListController from "webface/wef/base/DeferredEListController";

import * as bekasi from "bekasi/directors";

import XVariable from "padang/model/XVariable";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import VariableField from "padang/model/VariableField";

import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import ReferenceNameListRequest from "padang/requests/ReferenceNameListRequest";

import FormulaFormatHandler from "padang/handlers/FormulaFormatHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import ReferenceNameListHandler from "padang/handlers/ReferenceNameListHandler";

import VariableListAnatomyView from "padang/view/anatomy/VariableListAnatomyView";

import VariableListFormulaAddRequest from "padang/requests/anatomy/VariableListFormulaAddRequest";

export default class VariableListAnatomyController extends DeferredEListController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaFormatRequest.REQUEST_NAME, new FormulaFormatHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		super.installRequestHandler(ReferenceNameListRequest.REQUEST_NAME, new ReferenceNameListHandler(this));
		super.installRequestHandler(VariableListFormulaAddRequest.REQUEST_NAME, new VariableListFormulaAddHandler(this));
	}

	public createView(): VariableListAnatomyView {
		return new VariableListAnatomyView(this);
	}

	public getModel(): EList<XVariable> {
		return <EList<XVariable>>super.getModel();
	}

	public getView(): VariableListAnatomyView {
		return <VariableListAnatomyView>super.getView();
	}

	protected isEquals(a: VariableField, b: VariableField) {
		let aVariable = a.getVariable();
		let bVariable = b.getVariable();
		let aFormula = aVariable.getFormula();
		let bFormula = bVariable.getFormula();
		let aType = a.getType();
		let bType = b.getType();
		return aFormula === bFormula && aType === bType;
	}

	public loadModelChildren(callback: (children: any[]) => void): void {

		let counter = 0;
		let list = this.getModel();
		let fields: VariableField[] = [];
		for (let variable of list) {

			let field = new VariableField(variable);
			fields.push(field);

			let director = directors.getVariableFieldDirector(this);
			director.loadVariableBrief(field, () => {
				counter++;
				if (counter === list.size) {
					callback(fields);
					this.initiateSelection();
				}
			});
		}
	}

	public dofreshChildren(callback: () => void): void {
		super.dofreshChildren(() => {
			this.relayout();
			callback();
		});
	}

	private initiateSelection(): void {
		let director = wef.getSelectionDirector(this);
		let selection = director.getSelection();
		if (selection.isEmpty()) {
			let children = this.getChildren();
			if (children.length > 0) {
				director.select(children[0]);
			}
		}
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {

		let feature = notification.getFeature();
		if (feature instanceof EReference) {
			let featureType = feature.getType();
			if (featureType === XVariable) {

				let eventType = notification.getEventType();
				if (eventType === Notification.SET ||
					eventType === Notification.ADD ||
					eventType === Notification.REMOVE ||
					eventType === Notification.MOVE) {

					this.dofreshChildren(() => {

						// Cari selection setelah perubahan
						let children = this.getChildren();
						let position = notification.getListPosition();
						if (eventType === Notification.ADD) {
							let position = notification.getListPosition();
							if (position === -1) {
								position = children.length - 1;
							}
						} else if (eventType === Notification.REMOVE) {
							if (position === children.length) {
								position -= 1;
							}
						}

						// Setting selection
						let child = children[position];
						let director = wef.getSelectionDirector(this);
						director.select(child)

					});

				}
			}
		}
	}

}

class VariableListFormulaAddHandler extends BaseHandler {

	public handle(request: VariableListFormulaAddRequest, _callback: (data: any) => void): void {
		let formula = request.getStringData(VariableListFormulaAddRequest.FORMULA);
		let creator = PadangCreator.eINSTANCE;
		let list = <EList<XVariable>>this.controller.getModel()
		let variable = creator.createVariableUnder(list, formula);
		let command = new ListAddCommand();
		command.setList(list);
		command.setElement(variable);
		this.controller.execute(command);
	}

}

