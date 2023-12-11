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

import EObjectController from "webface/wef/base/EObjectController";

import XFacet from "padang/model/XFacet";

import FacetVisualView from "padang/view/present/FacetPresentView";

import ControllerProperties from "padang/util/ControllerProperties";

import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";
import FacetPropertyGetRequest from "padang/requests/FacetPropertyGetRequest";

import FacetPropertySetHandler from "padang/handlers/FacetPropertySetHandler";
import FacetPropertyGetHandler from "padang/handlers/FacetPropertyGetHandler";

export abstract class FacetPresentController extends EObjectController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(FacetPropertySetRequest.REQUEST_NAME, new FacetPropertySetHandler(this));
        super.installRequestHandler(FacetPropertyGetRequest.REQUEST_NAME, new FacetPropertyGetHandler(this));
    }

    public getModel(): XFacet {
        return <XFacet>super.getModel();
    }

    public getView(): FacetVisualView {
        return <FacetVisualView>super.getView();
    }

    protected refreshProperty(keys: string[]): void {

    }

    public getProperties(): ControllerProperties {
        let model = this.getModel();
        let properties = model.getProperties();
        return new ControllerProperties(this, properties);
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);

        let eventType = notification.getEventType();
        if (eventType === Notification.SET) {

            let feature = notification.getFeature();
            if (feature === XFacet.FEATURE_PROPERTIES) {

                let key = notification.getMapKey();
                let keys = ControllerProperties.createKeys(key);
                this.refreshProperty(keys);

            }
        }
    }

}

export default FacetPresentController;