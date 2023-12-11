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
import Handler from "webface/wef/Handler";
import Conductor from "webface/wef/Conductor";

import Caution from "webface/core/Caution";

export default class BaseConductor implements Conductor {

    private requestHandlers: { [requestType: string]: Handler } = {};

    public installRequestHandler(requestType: string, handler: Handler): void {
        this.requestHandlers[requestType] = handler;
    }

    public getRequestHandler(requestName: string): Handler {
        return this.requestHandlers[requestName] || null;
    }

    public submit(request: Request, callback?: (data: any, caution?: Caution) => void): void {
        let requestName = request.getName();
        let handler = this.getRequestHandler(requestName);
        if (handler !== null) {
            handler.handle(request, callback);
        }
    }

}
