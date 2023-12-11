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
import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import EListController from "webface/wef/base/EListController";

import * as bekasi from "bekasi/directors";

import XOption from "padang/model/XOption";

import OptionListInstoreView from "padang/view/instore/OptionListInstoreView";

import OptionListRemoveRequest from "padang/requests/instore/OptionListRemoveRequest";

export default class OptionListInstoreController extends EListController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(OptionListRemoveRequest.REQUEST_NAME, new OptionListRemoveHandler(this));
    }

    public createView(): OptionListInstoreView {
        return new OptionListInstoreView(this);
    }

    public getModel(): EList<XOption> {
        return <EList<XOption>>super.getModel();
    }

    public getView(): OptionListInstoreView {
        return <OptionListInstoreView>super.getView();
    }

    public refreshVisuals(): void {
    }

    public refreshChildren(): void {
        super.refreshChildren();
        this.relayout();
    }

    private relayout(): void {
        let director = bekasi.getContentLayoutDirector(this);
        director.relayout(this);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.SET ||
            eventType === Notification.ADD ||
            eventType === Notification.REMOVE ||
            eventType === Notification.MOVE) {
            this.refreshChildren();
        }
    }

}

class OptionListRemoveHandler extends BaseHandler {

    public handle(request: OptionListRemoveRequest): void {

        let index = <number>request.getData(OptionListRemoveRequest.INDEX);
        let list = <EList<XOption>>this.controller.getModel();
        let ingestion = list.get(index);

        let command = new RemoveCommand();
        command.setModel(ingestion);
        this.controller.execute(command);
    }

}