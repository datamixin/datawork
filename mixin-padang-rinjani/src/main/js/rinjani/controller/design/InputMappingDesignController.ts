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
import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import VisageType from "bekasi/visage/VisageType";

import * as padang from "padang/padang";
import * as participants from "padang/directors";

import FieldDragParticipant from "padang/directors/FieldDragParticipant";

import * as directors from "rinjani/directors";

import XInputMapping from "rinjani/model/XInputMapping";

import InputMappingDesignView from "rinjani/view/design/InputMappingDesignView";

import InputMappingDropVerifyRequest from "rinjani/requests/design/InputMappingDropVerifyRequest";

export abstract class InputMappingDesignController extends EObjectController {

	constructor() {
		super();
		this.addParticipant(participants.FIELD_DRAG_PARTICIPANT, new InputMappingDragParticipant(this));
		this.addParticipant(participants.PREFACE_DRAG_PARTICIPANT, new InputMappingDragParticipant(this));
		this.addParticipant(directors.INPUT_FIELD_DRAG_PARTICIPANT, new InputMappingDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(InputMappingDropVerifyRequest.REQUEST_NAME, new InputMappingDropVerifyHandler(this));
	}

	public getView(): InputMappingDesignView {
		return <InputMappingDesignView>super.getView();
	}

	public getModel(): XInputMapping {
		return <XInputMapping>super.getModel();
	}

}

export default InputMappingDesignController

class InputMappingDragParticipant extends FieldDragParticipant {

	public start(data: ObjectMap<any>): void {

		let accepted = false;
		if (data.containsKey(padang.FIELD_FORMULA)) {
			if (data.containsKey(padang.FIELD_TYPE)) {
				accepted = true;
			}
		}

		let view = this.getView();
		view.dragStart(accepted);
	}

}

class InputMappingDropVerifyHandler extends BaseHandler {

	public handle(request: InputMappingDropVerifyRequest, callback: (data: any) => void): void {
		let data = <Map<any>>request.getData(InputMappingDropVerifyRequest.DATA);
		if (data.containsKey(padang.FIELD_FORMULA)) {

			if (data.containsKey(padang.FIELD_PRESUME)) {
				let fieldPresume = <string>data.get(padang.FIELD_PRESUME);
				if (fieldPresume !== VisageType.COLUMN) {
					callback("Expected table column, actually '" + fieldPresume + "'");
				}
			}

			if (data.containsKey(padang.FIELD_TYPE)) {
				callback(null);
			} else {
				callback("Missing drag data '" + padang.FIELD_TYPE + "'");
			}

		} else {
			callback("Missing drag data '" + padang.FIELD_FORMULA + "'");
		}
	}

}
