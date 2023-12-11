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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "padang/directors";

import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

export default class SampleFileContentHandler extends BaseHandler {

	public handle(request: SampleFileContentRequest, callback: (data: any) => void): void {
		let path = <string>request.getData(SampleFileContentRequest.PATH);
		let director = directors.getDatasetPresentDirector(this.controller);
		director.readSampleFile(path, callback);
	}

}
