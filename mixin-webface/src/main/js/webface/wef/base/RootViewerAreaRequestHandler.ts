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
import Request from "webface/wef/Request";

import BaseHandler from "webface/wef/base/BaseHandler";

import RootViewerArea from "webface/dnd/RootViewerArea";

export default class RootViewerAreaRequestHandler extends BaseHandler {

    public handle(request: Request, callback: (data: any) => void): void {
        let area = new RootViewerArea(this.controller);
        callback(area);
    }

}