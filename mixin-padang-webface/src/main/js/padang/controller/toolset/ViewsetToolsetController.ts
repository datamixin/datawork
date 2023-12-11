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
import XViewset from "padang/model/XViewset";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

import CellAddHandler from "padang/handlers/toolset/CellAddHandler";

import ViewsetToolsetView from "padang/view/toolset/ViewsetToolsetView";

import ForeseeToolsetController from "padang/controller/toolset/ForeseeToolsetController";

export default class ViewsetToolsetController extends ForeseeToolsetController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        this.installRequestHandler(CellAddRequest.REQUEST_NAME, new CellAddHandler(this));
    }

    public createView(): ViewsetToolsetView {
        return new ViewsetToolsetView(this);
    }

    public getModel(): XViewset {
        return <XViewset>super.getModel();
    }

    public getView(): ViewsetToolsetView {
        return <ViewsetToolsetView>super.getView();
    }

}

