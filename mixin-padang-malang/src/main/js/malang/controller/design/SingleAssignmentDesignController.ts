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
import Map from "webface/util/Map";

import CommandGroup from "webface/wef/CommandGroup";

import Notification from "webface/model/Notification";

import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";

import * as directors from "malang/directors";

import MalangCreator from "malang/model/MalangCreator";
import XInputFeature from "malang/model/XInputFeature";
import XSingleAssignment from "malang/model/XSingleAssignment";

import SingleAssignmentDesignView from "malang/view/design/SingleAssignmentDesignView";

import InputAssignmentDropVerifyHandler from "malang/handlers/design/InputAssignmentDropVerifyHandler";
import InputAssignmentDropObjectHandler from "malang/handlers/design/InputAssignmentDropObjectHandler";

import SingleAssignmentDropVerifyRequest from "malang/requests/design/SingleAssignmentDropVerifyRequest";
import SingleAssignmentDropObjectRequest from "malang/requests/design/SingleAssignmentDropObjectRequest";

import InputAssignmentDesignController from "malang/controller/design/InputAssignmentDesignController";

import SingleAssignmentInputFeatureSetCommand from "malang/commands/SingleAssignmentInputFeatureSetCommand";

export default class SingleAssignmentDesignController extends InputAssignmentDesignController {

	private type: string = null;

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(SingleAssignmentDropVerifyRequest.REQUEST_NAME, new SingleAssignmentDropVerifyHandler(this));
		super.installRequestHandler(SingleAssignmentDropObjectRequest.REQUEST_NAME, new SingleAssignmentDropObjectHandler(this));
	}

	public createView(): SingleAssignmentDesignView {
		return new SingleAssignmentDesignView(this);
	}

	public getView(): SingleAssignmentDesignView {
		return <SingleAssignmentDesignView>super.getView();
	}

	public getModel(): XSingleAssignment {
		return <XSingleAssignment>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let feature = model.getInputFeature();
		if (feature === null) {
			return [];
		} else {
			return [feature];
		}
	}

	public setType(type: string): void {
		this.type = type;
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XSingleAssignment.FEATURE_INPUT_FEATURE) {
				this.refreshChildren();
				this.relayout();

				let director = directors.getDesignPartDirector(this);
				let modifier = director.createRecipeModifier();

				let oldFeature = <XInputFeature>notification.getOldValue();
				if (oldFeature === null) {

					// Set from null
					let feature = <XInputFeature>notification.getNewValue();
					let formula = feature.getValue();
					let index = this.getFormulaIndex(formula);
					modifier.addFeature(formula, index, this.type);

				} else {

					let formula = oldFeature.getValue();
					modifier.removeFeature(formula);

					let feature = <XInputFeature>notification.getNewValue();
					if (feature !== null) {

						// Set to new formula
						let formula = feature.getValue();
						let index = this.getFormulaIndex(formula);
						modifier.addFeature(formula, index, this.type);

					}

				}

				// Preprocessing transformation
				modifier.executeCommand(this);

			}
		}
	}

}

class SingleAssignmentDropVerifyHandler extends InputAssignmentDropVerifyHandler {


}

class SingleAssignmentDropObjectHandler extends InputAssignmentDropObjectHandler {

	public handle(request: SingleAssignmentDropObjectRequest): void {

		let controller = <SingleAssignmentDesignController>this.controller;
		let data = <Map<any>>request.getData(SingleAssignmentDropObjectRequest.DATA);
		let type = <string>data.get(padang.FIELD_TYPE);
		controller.setType(type);
		let formula = <string>data.get(padang.FIELD_FORMULA);
		let creator = MalangCreator.eINSTANCE;
		let replacement = creator.createFeature(formula);

		let assignment = <XSingleAssignment>this.controller.getModel();
		let model = assignment.getInputFeature();

		let group = new CommandGroup();
		if (model === null) {

			// Feature Set
			let command = new SingleAssignmentInputFeatureSetCommand();
			command.setAssignment(assignment);
			command.setFeature(replacement);
			group.add(command);

		} else {

			// Feature Replace
			let command = new ReplaceCommand();
			command.setModel(model);
			command.setReplacement(replacement);
			group.add(command);

		}

		this.controller.execute(group);
	}

}
