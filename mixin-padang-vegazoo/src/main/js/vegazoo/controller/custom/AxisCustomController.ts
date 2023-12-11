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

import BaseHandler from "webface/wef/base/BaseHandler";

import XAxis from "vegazoo/model/XAxis";

import AxisCustomView from "vegazoo/view/custom/AxisCustomView";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

import AxisLabelAngleSetCommand from "vegazoo/commands/AxisLabelAngleSetCommand";

import AxisLabelAngleSetRequest from "vegazoo/requests/custom/AxisLabelAngleSetRequest";

export default class AxisCustomController extends ObjectDefCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(AxisLabelAngleSetRequest.REQUEST_NAME, new AxisLabelAngleSetHandler(this));
    }

    public createView(): AxisCustomView {
        return new AxisCustomView(this);
    }

    public getView(): AxisCustomView {
        return <AxisCustomView>super.getView();
    }

    public getModel(): XAxis {
        return <XAxis>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshLabelAngle();
    }

    private refreshLabelAngle(): void {
        let model = this.getModel();
        let labelAngle = model.getLabelAngle();
        let view = this.getView();
        view.setLabelAngle(labelAngle);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (feature === XAxis.FEATURE_LABEL_ANGLE) {
            if (eventType === Notification.SET) {
                this.refreshLabelAngle();
            }
        }
    }

}

class AxisLabelAngleSetHandler extends BaseHandler {

    public handle(request: AxisLabelAngleSetRequest, callback: (data: any) => void): void {
        let labelAngle = request.getData(AxisLabelAngleSetRequest.LABEL_ANGLE);
        let command = new AxisLabelAngleSetCommand();
        let controller = <AxisCustomController>this.controller;
        let axis = controller.getModel();
        command.setAxis(axis);
        command.setLabelAngle(labelAngle);
        controller.execute(command);
    }

}
