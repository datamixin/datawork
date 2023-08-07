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

import XScale from "vegazoo/model/XScale";

import ScaleCustomView from "vegazoo/view/custom/ScaleCustomView";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

import ScaleZeroSetCommand from "vegazoo/commands/ScaleZeroSetCommand";

import ScaleZeroSetRequest from "vegazoo/requests/custom/ScaleZeroSetRequest";

export default class ScaleCustomController extends ObjectDefCustomController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(ScaleZeroSetRequest.REQUEST_NAME, new ScaleZeroSetHandler(this));
    }

    public createView(): ScaleCustomView {
        return new ScaleCustomView(this);
    }

    public getView(): ScaleCustomView {
        return <ScaleCustomView>super.getView();
    }

    public getModel(): XScale {
        return <XScale>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshZero();
    }

    private refreshZero(): void {
        let model = this.getModel();
        let zero = model.isZero();
        let view = this.getView();
        view.setZero(zero);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (feature === XScale.FEATURE_ZERO) {
            if (eventType === Notification.SET) {
                this.refreshZero();
            }
        }
    }

}

class ScaleZeroSetHandler extends BaseHandler {

    public handle(request: ScaleZeroSetRequest, callback: (data: any) => void): void {
        let zero = request.getData(ScaleZeroSetRequest.ZERO);
        let command = new ScaleZeroSetCommand();
        let controller = <ScaleCustomController>this.controller;
        let scale = controller.getModel();
        command.setScale(scale);
        command.setZero(zero);
        controller.execute(command);
    }

}
