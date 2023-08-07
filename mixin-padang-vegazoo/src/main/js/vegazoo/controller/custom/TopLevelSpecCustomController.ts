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

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import TopLevelSpecCustomView from "vegazoo/view/custom/TopLevelSpecCustomView";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

import TopLevelSpecTitleSetCommand from "vegazoo/commands/TopLevelSpecTitleSetCommand";

import TopLevelSpecTitleSetRequest from "vegazoo/requests/custom/TopLevelSpecTitleSetRequest";

export abstract class TopLevelSpecCustomController extends ObjectDefCustomController {

    constructor() {
        super();
        this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(TopLevelSpecTitleSetRequest.REQUEST_NAME, new TopLevelSpecTitleSetHandler(this));
    }

    public getView(): TopLevelSpecCustomView {
        return <TopLevelSpecCustomView>super.getView();
    }

    public getModel(): XTopLevelSpec {
        return <XTopLevelSpec>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshTitle();
    }

    private refreshTitle(): void {
        let model = this.getModel();
        let title = model.getTitle();
        let view = this.getView();
        view.setTitle(title);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (feature === XTopLevelSpec.FEATURE_TITLE) {
            if (eventType === Notification.SET) {
                this.refreshTitle();
            }
        }
    }

}

export default TopLevelSpecCustomController

class TopLevelSpecTitleSetHandler extends BaseHandler {

    public handle(request: TopLevelSpecTitleSetRequest, callback: (data: any) => void): void {
        let title = request.getData(TopLevelSpecTitleSetRequest.TITLE);
        let command = new TopLevelSpecTitleSetCommand();
        let controller = <TopLevelSpecCustomController>this.controller;
        let scale = controller.getModel();
        command.setTopLevelSpec(scale);
        command.setTitle(title);
        controller.execute(command);
    }

}
