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

import XDisplay from "padang/model/XDisplay";

import ControllerProperties from "padang/util/ControllerProperties";

import DisplayToolsetView from "padang/view/toolset/DisplayToolsetView";

export abstract class DisplayToolsetController extends EObjectController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public getModel(): XDisplay {
        return <XDisplay>super.getModel();
    }

    public getView(): DisplayToolsetView {
        return <DisplayToolsetView>super.getView();
    }

    public getProperties(): ControllerProperties {
        let model = this.getModel();
        let properties = model.getProperties();
        return new ControllerProperties(this, properties);
    }

    protected refreshProperty(key: string): void {
    }

    public notifyChanged(notification: Notification): void {
        let feature = notification.getFeature();
        if (feature === XDisplay.FEATURE_PROPERTIES) {
            let key = notification.getMapKey();
            this.refreshProperty(key);
        }
    }

}

export default DisplayToolsetController;