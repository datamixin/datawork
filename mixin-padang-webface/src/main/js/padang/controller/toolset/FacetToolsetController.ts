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

import XFacet from "padang/model/XFacet";

import ControllerProperties from "padang/util/ControllerProperties";

import FacetToolsetView from "padang/view/toolset/FacetToolsetView";

import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";
import FacetPropertyGetRequest from "padang/requests/FacetPropertyGetRequest";

import FacetPropertyGetHandler from "padang/handlers/FacetPropertyGetHandler";
import FacetPropertySetHandler from "padang/handlers/FacetPropertySetHandler";

export abstract class FacetToolsetController extends EObjectController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        this.installRequestHandler(FacetPropertyGetRequest.REQUEST_NAME, new FacetPropertyGetHandler(this));
        this.installRequestHandler(FacetPropertySetRequest.REQUEST_NAME, new FacetPropertySetHandler(this));
    }

    public getModel(): XFacet {
        return <XFacet>super.getModel();
    }

    public getView(): FacetToolsetView {
        return <FacetToolsetView>super.getView();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

    public getProperties(): ControllerProperties {
        let model = this.getModel();
        let properties = model.getProperties();
        return new ControllerProperties(this, properties);
    }

    protected refreshProperties(): void {
    }

    public notifyChanged(notification: Notification): void {
        let feature = notification.getFeature();
        if (feature === XFacet.FEATURE_PROPERTIES) {
            this.refreshProperties();
        }
    }

}

export default FacetToolsetController;