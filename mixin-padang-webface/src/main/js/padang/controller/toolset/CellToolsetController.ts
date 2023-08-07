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
import Notification from "webface/model/Notification";

import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XCell from "padang/model/XCell";

import CellToolsetView from "padang/view/toolset/CellToolsetView";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

import CellAddHandler from "padang/handlers/toolset/CellAddHandler";

export default class CellToolsetController extends EObjectController {

    constructor() {
        super();
        this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        this.installRequestHandler(CellAddRequest.REQUEST_NAME, new CellAddHandler(this));
    }

    public createView(): CellToolsetView {
        return new CellToolsetView(this);
    }

    public getModel(): XCell {
        return <XCell>super.getModel();
    }

    public getView(): CellToolsetView {
        return <CellToolsetView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let facet = model.getFacet();
        return [facet];
    }

    public notifyChanged(notification: Notification): void {
        let feature = notification.getFeature();
        if (feature === XCell.FEATURE_FACET) {
            this.refreshChildren();
        }
    }

}
