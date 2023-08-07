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

import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import TopLevelLayerSpecCustomView from "vegazoo/view/custom/TopLevelLayerSpecCustomView";

import TopLevelSpecCustomController from "vegazoo/controller/custom/TopLevelSpecCustomController";

export default class TopLevelLayerSpecCustomController extends TopLevelSpecCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): TopLevelLayerSpecCustomView {
        return new TopLevelLayerSpecCustomView(this, true, "Custom");
    }

    public getView(): TopLevelLayerSpecCustomView {
        return <TopLevelLayerSpecCustomView>super.getView();
    }

    public getModel(): XTopLevelLayerSpec {
        return <XTopLevelLayerSpec>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
    }

}

