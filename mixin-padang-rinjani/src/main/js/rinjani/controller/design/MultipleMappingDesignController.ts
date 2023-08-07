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

import EList from "webface/model/EList";
import EObject from "webface/model/EObject";
import Notification from "webface/model/Notification";

import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";

import XAssignment from "sleman/model/XAssignment";

import RinjaniCreator from "rinjani/model/RinjaniCreator";
import XInputField from "rinjani/model/XInputField";
import XMultipleMapping from "rinjani/model/XMultipleMapping";

import MultipleMappingDesignView from "rinjani/view/design/MultipleMappingDesignView";

import InputMappingDropVerifyRequest from "rinjani/requests/design/InputMappingDropVerifyRequest";
import MultipleMappingDropObjectRequest from "rinjani/requests/design/MultipleMappingDropObjectRequest";

import InputMappingDesignController from "rinjani/controller/design/InputMappingDesignController";

export default class MultipleMappingDesignController extends InputMappingDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(MultipleMappingDropObjectRequest.REQUEST_NAME, new MultipleMappingDropObjectHandler(this));
	}

	public createView(): MultipleMappingDesignView {
		return new MultipleMappingDesignView(this);
	}

	public getView(): MultipleMappingDesignView {
		return <MultipleMappingDesignView>super.getView();
	}

	public getModel(): XMultipleMapping {
		return <XMultipleMapping>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let features = model.getInputFields();
		return features.toArray();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.ADD || eventType === Notification.REMOVE || eventType === Notification.MOVE) {
			if (feature === XMultipleMapping.FEATURE_INPUT_FIELDS) {
				this.refreshChildren();
				this.relayout()
			}
		}
	}

}

class MultipleMappingDropObjectHandler extends BaseHandler {

	public handle(request: MultipleMappingDropObjectRequest): void {

		let model = <EObject>this.controller.getModel();
		let data = <Map<any>>request.getData(InputMappingDropVerifyRequest.DATA);
		let formula = <string>data.get(padang.FIELD_FORMULA);
		let position = <number>data.get(padang.TARGET_POSITION);

		let group = new CommandGroup();

		if (data.containsKey(padang.DRAG_SOURCE)) {
			let source = <EObject>data.get(padang.DRAG_SOURCE);
			let container = source.eContainer();
			if (model === container) {

				// Drag and drop in same assignment
				this.moveFeature(<XInputField>source, position, group);

			} else {

				if (container instanceof XAssignment) {

					// Drag from other assignment
					this.removeFeature(<XInputField>source, group);

				}

				this.addFeature(formula, position, group);
			}

		} else {

			// Drag from non assignment
			this.addFeature(formula, position, group);
		}

		this.controller.execute(group);

	}

	private createInputField(formula: string): XInputField {
		let creator = RinjaniCreator.eINSTANCE;
		return creator.createInputField(formula);
	}

	private getInputFields(): EList<XInputField> {
		let assignment = <XMultipleMapping>this.controller.getModel();
		return assignment.getInputFields();
	}

	private addFeature(formula: string, position: number, group: CommandGroup): void {
		let feature = this.createInputField(formula);
		let features = this.getInputFields();
		let command = new ListAddCommand();
		command.setList(features);
		command.setElement(feature);
		command.setPosition(position);
		group.add(command);
	}

	private moveFeature(feature: XInputField, position: number, group: CommandGroup): void {
		let features = this.getInputFields();
		let command = new ListMoveCommand();
		command.setList(features);
		command.setElement(feature);
		command.setPosition(position);
		group.add(command);
	}

	private removeFeature(feature: XInputField, group: CommandGroup): void {
		let command = new RemoveCommand();
		command.setModel(feature);
		group.add(command);
	}

}
