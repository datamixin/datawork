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
import EReference from "webface/model/EReference";
import Notification from "webface/model/Notification";

import EObjectController from "webface/wef/base/EObjectController";

import XValueDef from "vegazoo/model/XValueDef";

import ValueDefCustomView from "vegazoo/view/custom/ValueDefCustomView";

export abstract class ValueDefCustomController extends EObjectController {

    public getModel(): XValueDef {
        return <XValueDef>super.getModel();
    }

    public getView(): ValueDefCustomView {
        return <ValueDefCustomView>super.getView();
    }

    public notifyChanged(notification: Notification): void {
        let feature = notification.getFeature();
        if (feature instanceof EReference) {
            let eventType = notification.getEventType();
            if (eventType === Notification.SET) {
                this.refreshChildren();
            }
        }
    }

}

export default ValueDefCustomController;