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

import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";

import TopLevelFacetSpecCustomView from "vegazoo/view/custom/TopLevelFacetSpecCustomView";

import TopLevelSpecCustomController from "vegazoo/controller/custom/TopLevelSpecCustomController";

export default class TopLevelFacetSpecCustomController extends TopLevelSpecCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): TopLevelFacetSpecCustomView {
        return new TopLevelFacetSpecCustomView(this, true, "Custom");
    }

    public getView(): TopLevelFacetSpecCustomView {
        return <TopLevelFacetSpecCustomView>super.getView();
    }

    public getModel(): XTopLevelFacetSpec {
		return <XTopLevelFacetSpec>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
    }

}

