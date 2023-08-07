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

import * as padang from "padang/padang";

import XTabular from "padang/model/XTabular";

import ControllerProperties from "padang/util/ControllerProperties";

import TabularColumnWidthGetRequest from "padang/requests/TabularColumnWidthGetRequest";

export default class TabularColumnWidthGetHandler extends BaseHandler {

    public handle(request: TabularColumnWidthGetRequest, callback: (format: string) => void): void {
        let name = <string>request.getData(TabularColumnWidthGetRequest.NAME);
        let properties = new ControllerProperties(this.controller, XTabular.FEATURE_PROPERTIES);
        let width = properties.getProperty([padang.COLUMN, name, padang.WIDTH], 100);
        callback(width);
    }

}