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

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";

import RinjaniCreator from "rinjani/model/RinjaniCreator";
import XSingleMapping from "rinjani/model/XSingleMapping";

import SingleMappingDesignView from "rinjani/view/design/SingleMappingDesignView";

import InputMappingDropVerifyRequest from "rinjani/requests/design/InputMappingDropVerifyRequest";
import SingleMappingDropObjectRequest from "rinjani/requests/design/SingleMappingDropObjectRequest";

import InputMappingDesignController from "rinjani/controller/design/InputMappingDesignController";

import SingleMappingInputFieldSetCommand from "rinjani/commands/SingleMappingInputFieldSetCommand";

export default class SingleMappingDesignController extends InputMappingDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(SingleMappingDropObjectRequest.REQUEST_NAME, new SingleMappingDropObjectHandler(this));
	}

	public createView(): SingleMappingDesignView {
		return new SingleMappingDesignView(this);
	}

	public getView(): SingleMappingDesignView {
		return <SingleMappingDesignView>super.getView();
	}

	public getModel(): XSingleMapping {
		return <XSingleMapping>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let field = model.getInputField();
		if (field === null) {
			return [];
		} else {
			return [field];
		}
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XSingleMapping.FEATURE_INPUT_FIELD) {
				this.refreshChildren();
				this.relayout()
			}
		}
	}

}

class SingleMappingDropObjectHandler extends BaseHandler {

	public handle(request: SingleMappingDropObjectRequest): void {

		let data = <Map<any>>request.getData(InputMappingDropVerifyRequest.DATA);
		let formula = <string>data.get(padang.FIELD_FORMULA);
		let creator = RinjaniCreator.eINSTANCE;
		let replacement = creator.createInputField(formula);

		let assignment = <XSingleMapping>this.controller.getModel();
		let model = assignment.getInputField();

		if (model === null) {

			// Feature Set
			let command = new SingleMappingInputFieldSetCommand();
			command.setAssignment(assignment);
			command.setFeature(replacement);
			this.controller.execute(command);

		} else {

			// Feature Replace
			let command = new ReplaceCommand();
			command.setModel(model);
			command.setReplacement(replacement);
			this.controller.execute(command);

		}

	}

}
