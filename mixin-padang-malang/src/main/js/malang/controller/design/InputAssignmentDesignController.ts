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
import ObjectMap from "webface/util/ObjectMap";

import EObjectController from "webface/wef/base/EObjectController";

import * as padang from "padang/padang";
import * as participants from "padang/directors";

import FieldDragParticipant from "padang/directors/FieldDragParticipant";

import * as directors from "malang/directors";

import XInputAssignment from "malang/model/XInputAssignment";

import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

import InputAssignmentDesignView from "malang/view/design/InputAssignmentDesignView";

export abstract class InputAssignmentDesignController extends EObjectController {

	constructor() {
		super();
		this.addParticipant(participants.FIELD_DRAG_PARTICIPANT, new InputAssignmentDragParticipant(this));
		this.addParticipant(participants.PREFACE_DRAG_PARTICIPANT, new InputAssignmentDragParticipant(this));
		this.addParticipant(directors.INPUT_FEATURE_DRAG_PARTICIPANT, new InputAssignmentDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public getView(): InputAssignmentDesignView {
		return <InputAssignmentDesignView>super.getView();
	}

	public getModel(): XInputAssignment {
		return <XInputAssignment>super.getModel();
	}

	protected getFormulaIndex(formula: string): number {
		let director = directors.getDesignPartDirector(this);
		let reader = director.createInputFeatureReader();
		let names = reader.getFeatureNames();
		let parser = new FeatureFormulaParser();
		let name = parser.getColumnName(formula);
		return names.indexOf(name);
	}

}

export default InputAssignmentDesignController

class InputAssignmentDragParticipant extends FieldDragParticipant {

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
