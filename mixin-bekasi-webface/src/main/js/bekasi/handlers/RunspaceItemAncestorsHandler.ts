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

import * as directors from "bekasi/directors";

import RunspaceItem from "bekasi/resources/RunspaceItem";

import RunspaceItemAncestorsRequest from "bekasi/requests/RunspaceItemAncestorsRequest";

export default class RunspaceItemAncestorsHandler extends BaseHandler {

    public handle(request: RunspaceItemAncestorsRequest, callback: (items: RunspaceItem[]) => void): void {
        let itemId = request.getData(RunspaceItemAncestorsRequest.ITEM_ID);
        let director = directors.getRunspaceDirector(this.controller);
        director.getItemAncestors(itemId, callback);
    }

}
