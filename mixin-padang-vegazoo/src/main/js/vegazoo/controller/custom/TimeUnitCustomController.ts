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

import BaseHandler from "webface/wef/base/BaseHandler";

import XTimeUnit from "vegazoo/model/XTimeUnit";

import TimeUnitCustomView from "vegazoo/view/custom/TimeUnitCustomView";

import TimeUnitValueSetCommand from "vegazoo/commands/TimeUnitValueSetCommand";

import TimeUnitValueSetRequest from "vegazoo/requests/custom/TimeUnitValueSetRequest";

import ValueDefCustomController from "vegazoo/controller/custom/ValueDefCustomController";

export default class TimeUnitCustomController extends ValueDefCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(TimeUnitValueSetRequest.REQUEST_NAME, new TimeUnitValueSetHandler(this));
    }

    public createView(): TimeUnitCustomView {
        return new TimeUnitCustomView(this);
    }

    public getView(): TimeUnitCustomView {
        return <TimeUnitCustomView>super.getView();
    }

    public getModel(): XTimeUnit {
        return <XTimeUnit>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshValue();
    }

    private refreshValue(): void {
        let model = this.getModel();
        let value = model.getValue();
        let view = this.getView();
        view.setValue(value);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (feature === XTimeUnit.FEATURE_VALUE) {
            if (eventType === Notification.SET) {
                this.refreshValue();
            }
        }
    }

}

class TimeUnitValueSetHandler extends BaseHandler {

    public handle(request: TimeUnitValueSetRequest, callback: (data: any) => void): void {
        let value = request.getData(TimeUnitValueSetRequest.VALUE);
        let command = new TimeUnitValueSetCommand();
        let controller = <TimeUnitCustomController>this.controller;
        let model = controller.getModel();
        command.setTimeUnit(model);
        command.setValue(value);
        controller.execute(command);
    }

}
