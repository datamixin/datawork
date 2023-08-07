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
import XOutlook from "padang/model/XOutlook";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

import CellAddHandler from "padang/handlers/toolset/CellAddHandler";

import OutlookToolsetView from "padang/view/toolset/OutlookToolsetView";

import ForeseeToolsetController from "padang/controller/toolset/ForeseeToolsetController";

export default class OutlookToolsetController extends ForeseeToolsetController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        this.installRequestHandler(CellAddRequest.REQUEST_NAME, new CellAddHandler(this));
    }

    public createView(): OutlookToolsetView {
        return new OutlookToolsetView(this);
    }

    public getModel(): XOutlook {
        return <XOutlook>super.getModel();
    }

    public getView(): OutlookToolsetView {
        return <OutlookToolsetView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let viewset = model.getViewset();
        return [viewset];
    }
}

