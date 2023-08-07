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

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";

import PositionDatumDefCustomView from "vegazoo/view/custom/PositionDatumDefCustomView";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

export default class PositionDatumDefCustomController extends ObjectDefCustomController {

    constructor() {
        super();
        this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): PositionDatumDefCustomView {
        return new PositionDatumDefCustomView(this);
    }

    public getView(): PositionDatumDefCustomView {
        return <PositionDatumDefCustomView>super.getView();
    }

    public getModel(): XPositionDatumDef {
        return <XPositionDatumDef>super.getModel();
    }

    public getModelChildren(): any[] {
        return super.getViceReferences();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
        let eventType = notification.getEventType();
        if (eventType === Notification.SET) {
        }
    }

}
