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
import Notification from "webface/model/Notification";

import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import TopLevelUnitSpecCustomView from "vegazoo/view/custom/TopLevelUnitSpecCustomView";

import TopLevelSpecCustomController from "vegazoo/controller/custom/TopLevelSpecCustomController";

export default class TopLevelUnitSpecCustomController extends TopLevelSpecCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): TopLevelUnitSpecCustomView {
        return new TopLevelUnitSpecCustomView(this, true, "Custom");
    }

    public getView(): TopLevelUnitSpecCustomView {
        return <TopLevelUnitSpecCustomView>super.getView();
    }

    public getModel(): XTopLevelUnitSpec {
        return <XTopLevelUnitSpec>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
    }

}

