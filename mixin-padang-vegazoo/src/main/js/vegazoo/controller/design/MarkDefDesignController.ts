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
import * as wef from "webface/wef";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";

import XMarkDef from "vegazoo/model/XMarkDef";

import * as directors from "vegazoo/directors";

import MarkDefDesignView from "vegazoo/view/design/MarkDefDesignView";

import MarkDefTypeSetRequest from "vegazoo/requests/design/MarkDefTypeSetRequest";
import MarkDefSelectionRequest from "vegazoo/requests/design/MarkDefSelectionRequest";

import ObjectDefDesignController from "vegazoo/controller/design/ObjectDefDesignController";

export default class MarkDefDesignController extends ObjectDefDesignController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(MarkDefSelectionRequest.REQUEST_NAME, new MarkDefSelectionHandler(this));
        super.installRequestHandler(MarkDefTypeSetRequest.REQUEST_NAME, new MarkDefTypeSetHandler(this));
    }

    public createView(): MarkDefDesignView {
        return new MarkDefDesignView(this);
    }

    public getView(): MarkDefDesignView {
        return <MarkDefDesignView>super.getView();
    }

    public getModel(): XMarkDef {
        return <XMarkDef>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshTemplates();
        this.refreshType();
    }

    private refreshTemplates(): void {
        let director = directors.getDesignPartDirector(this);
        let list = director.getTemplates();
        let templates: { [key: string]: string[] } = {};
        for (let template of list) {
            let key = template.getMarkType();
            let name = template.getName();
            let icon = template.getIcon();
            templates[key] = [name, icon];
        }
        let view = this.getView();
        view.setTemplates(templates);
    }

    public refreshType(): void {
        let model = this.getModel();
        let type = model.getType();
        let view = this.getView();
        view.setType(type);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (feature === XMarkDef.FEATURE_TYPE) {
            if (eventType === Notification.SET) {
                this.refreshType();
            }
        }
    }

}

class MarkDefSelectionHandler extends BaseHandler {

    public handle(request: MarkDefSelectionRequest, callback: (data: any) => void): void {
        let director = wef.getSelectionDirector(this.controller);
        director.select(this.controller);
    }

}

class MarkDefTypeSetHandler extends BaseHandler {

    public handle(request: MarkDefTypeSetRequest, callback: (data: any) => void): void {
        let controller = <MarkDefDesignController>this.controller;
        let type = <string>request.getData(MarkDefTypeSetRequest.TYPE);
        let director = directors.getDesignPartDirector(controller);
        director.changeType(controller, type);
    }

}
