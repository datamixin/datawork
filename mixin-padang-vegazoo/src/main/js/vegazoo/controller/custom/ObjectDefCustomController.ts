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
import EReference from "webface/model/EReference";
import Notification from "webface/model/Notification";

import EObjectController from "webface/wef/base/EObjectController";

import XObjectDef from "vegazoo/model/XObjectDef";
import ViceReference from "vegazoo/model/ViceReference";

import ObjectDefCustomView from "vegazoo/view/custom/ObjectDefCustomView";

export abstract class ObjectDefCustomController extends EObjectController {

    public getModel(): XObjectDef {
        return <XObjectDef>super.getModel();
    }

    public getView(): ObjectDefCustomView {
        return <ObjectDefCustomView>super.getView();
    }

    protected getViceReferences(): any[] {
        let model = this.getModel();
        let features = model.eFeatures();
        let models: any[] = [];
        for (let feature of features) {
            if (feature instanceof EReference) {
                let reference = new ViceReference(model, feature);
                models.push(reference);
            }
        }
        return models;
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

export default ObjectDefCustomController;