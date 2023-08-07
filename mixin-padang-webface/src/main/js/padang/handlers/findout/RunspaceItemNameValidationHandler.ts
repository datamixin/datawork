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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as bekasi from "bekasi/directors";
import * as directors from "padang/directors";

import RunspaceItemNameValidationRequest from "padang/requests/findout/RunspaceItemNameValidationRequest";

export default class RunspaceItemNameValidationHandler extends BaseHandler {

    public handle(request: RunspaceItemNameValidationRequest, callback?: (data: any) => void): void {
        let director = directors.getFindoutPartDirector(this.controller);
        let folderId = director.getFolderId();
        let name = request.getData(RunspaceItemNameValidationRequest.NAME);
        {
            let director = bekasi.getRunspaceDirector(this.controller);
            director.validateItemName(folderId, name, callback);
        }
    }

}
