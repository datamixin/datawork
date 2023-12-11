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
import Map from "webface/util/Map";

import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import Notification from "webface/model/Notification";

import CommandGroup from "webface/wef/CommandGroup";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";

import XAssignment from "sleman/model/XAssignment";

import * as directors from "malang/directors";

import MalangCreator from "malang/model/MalangCreator";
import XInputFeature from "malang/model/XInputFeature";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import MultipleAssignmentDesignView from "malang/view/design/MultipleAssignmentDesignView";

import InputAssignmentDropObjectHandler from "malang/handlers/design/InputAssignmentDropObjectHandler";
import InputAssignmentDropVerifyHandler from "malang/handlers/design/InputAssignmentDropVerifyHandler";

import InputAssignmentDesignController from "malang/controller/design/InputAssignmentDesignController";

import MultipleAssignmentDropVerifyRequest from "malang/requests/design/MultipleAssignmentDropVerifyRequest";
import MultipleAssignmentDropObjectRequest from "malang/requests/design/MultipleAssignmentDropObjectRequest";

export default class MultipleAssignmentDesignController extends InputAssignmentDesignController {

	private formulaTypes = new Map<string, string>();

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(MultipleAssignmentDropVerifyRequest.REQUEST_NAME, new MultipleAssignmentDropVerifyHandler(this));
		super.installRequestHandler(MultipleAssignmentDropObjectRequest.REQUEST_NAME, new MultipleAssignmentDropObjectHandler(this));
	}

	public createView(): MultipleAssignmentDesignView {
		return new MultipleAssignmentDesignView(this);
	}

	public getView(): MultipleAssignmentDesignView {
		return <MultipleAssignmentDesignView>super.getView();
	}

	public getModel(): XMultipleAssignment {
		return <XMultipleAssignment>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let features = model.getInputFeatures();
		return features.toArray();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public setFormulaType(formula: string, type: string): void {
		this.formulaTypes.set(formula, type);
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XMultipleAssignment.FEATURE_INPUT_FEATURES) {
			this.refreshChildren();
			this.relayout();

			let director = directors.getDesignPartDirector(this);
			let modifier = director.createRecipeModifier();
			let eventType = notification.getEventType();
			if (eventType === Notification.ADD) {

				let feature = <XInputFeature>notification.getNewValue();
				let formula = feature.getValue();
				let index = this.getFormulaIndex(formula);
				let type = this.formulaTypes.get(formula);
				modifier.addFeature(formula, index, type);

			} else if (eventType === Notification.MOVE) {

				let newPosition = <number>notification.getNewValue();
				let model = this.getModel();
				let features = model.getInputFeatures();
				let feature = features.get(newPosition);
				let formula = feature.getValue();
				let index = this.getFormulaIndex(formula);
				modifier.moveFeature(formula, index);

			} else if (eventType === Notification.REMOVE) {

				let feature = <XInputFeature>notification.getOldValue();
				let formula = feature.getValue();
				modifier.removeFeature(formula);

			}
			// Preprocessing transformation
			modifier.executeCommand(this);

		}
	}

}

class MultipleAssignmentDropVerifyHandler extends InputAssignmentDropVerifyHandler {

}

class MultipleAssignmentDropObjectHandler extends InputAssignmentDropObjectHandler {

	public handle(request: MultipleAssignmentDropObjectRequest): void {

		let controller = <MultipleAssignmentDesignController>this.controller;
		let data = <Map<any>>request.getData(MultipleAssignmentDropObjectRequest.DATA);
		let type = <string>data.get(padang.FIELD_TYPE);
		let formula = <string>data.get(padang.FIELD_FORMULA);
		let position = <number>data.get(padang.TARGET_POSITION);
		controller.setFormulaType(formula, type);
		let model = controller.getModel();

		let group = new CommandGroup();

		if (data.containsKey(padang.DRAG_SOURCE)) {
			let source = <EObject>data.get(padang.DRAG_SOURCE);
			let container = source.eContainer();
			if (model === container) {

				// Drag and drop in same assignment
				this.moveFeature(<XInputFeature>source, position, group);

			} else {

				if (container instanceof XAssignment) {

					// Drag from other assignment
					this.removeFeature(<XInputFeature>source, group);

				}

				this.addFeature(formula, position, group);

			}

		} else {

			// Drag from non assignment
			this.addFeature(formula, position, group);

		}

		this.controller.execute(group);

	}

	private createFeature(formula: string): XInputFeature {
		let creator = MalangCreator.eINSTANCE;
		return creator.createFeature(formula);
	}

	private getFeatures(): EList<XInputFeature> {
		let assignment = <XMultipleAssignment>this.controller.getModel();
		return assignment.getInputFeatures();
	}

	private addFeature(formula: string, position: number, group: CommandGroup): void {
		let feature = this.createFeature(formula);
		let features = this.getFeatures();
		let command = new ListAddCommand();
		command.setList(features);
		command.setElement(feature);
		command.setPosition(position);
		group.add(command);
	}

	private moveFeature(feature: XInputFeature, position: number, group: CommandGroup): void {
		let features = this.getFeatures();
		let command = new ListMoveCommand();
		command.setList(features);
		command.setElement(feature);
		command.setPosition(position);
		group.add(command);
	}

	private removeFeature(feature: XInputFeature, group: CommandGroup): void {
		let command = new RemoveCommand();
		command.setModel(feature);
		group.add(command);
	}

}
