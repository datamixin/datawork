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
import PartViewer from "webface/wef/PartViewer";

import BaseDragDirector from "webface/wef/base/BaseDragDirector";

import { InputFeatureDragDirector } from "malang/directors/InputFeatureDragDirector";
import { INPUT_FEATURE_DRAG_PARTICIPANT } from "malang/directors/InputFeatureDragParticipant";

export default class BaseInputFeatureDragDirector extends BaseDragDirector implements InputFeatureDragDirector {

	constructor(partViewer: PartViewer) {
		super(partViewer, INPUT_FEATURE_DRAG_PARTICIPANT);
	}

}
