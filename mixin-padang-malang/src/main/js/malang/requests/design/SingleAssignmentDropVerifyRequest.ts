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

import InputAssignmentDropVerifyRequest from "./InputAssignmentDropVerifyRequest";

export default class SingleAssignmentDropVerifyRequest extends InputAssignmentDropVerifyRequest {

	public static REQUEST_NAME = "single-assignment-drop-verify";
	public static DATA = "data";

	constructor(data: Map<any>) {
		super(SingleAssignmentDropVerifyRequest.REQUEST_NAME, data);
	}

}

