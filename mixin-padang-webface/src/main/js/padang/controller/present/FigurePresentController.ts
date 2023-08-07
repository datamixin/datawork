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

import XFigure from "padang/model/XFigure";

import * as directors from "padang/directors";

import FigurePresentView from "padang/view/present/FigurePresentView";

import FigureNameSetCommand from "padang/commands/FigureNameSetCommand";

import FigureNameSetRequest from "padang/requests/present/FigureNameSetRequest";
import FigureNameValidationRequest from "padang/requests/present/FigureNameValidationRequest";
import FigureGraphicRefreshRequest from "padang/requests/present/FigureGraphicRefreshRequest";
import FigureGraphicComposerOpenRequest from "padang/requests/present/FigureGraphicComposerOpenRequest";

import FacetPresentController from "padang/controller/present/FacetPresentController";

export default class FigurePresentController extends FacetPresentController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(FigureNameSetRequest.REQUEST_NAME, new FigureNameSetHandler(this));
        super.installRequestHandler(FigureNameValidationRequest.REQUEST_NAME, new FigureNameValidationHandler(this));
        super.installRequestHandler(FigureGraphicRefreshRequest.REQUEST_NAME, new FigureGraphicRefreshHandler(this));
        super.installRequestHandler(FigureGraphicComposerOpenRequest.REQUEST_NAME, new FigureGraphicComposeOpenHandler(this));
    }

    public createView(): FigurePresentView {
        return new FigurePresentView(this);
    }

    public getModel(): XFigure {
        return <XFigure>super.getModel();
    }

    public getView(): FigurePresentView {
        return <FigurePresentView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let graphic = model.getGraphic();
        return [graphic];
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshName();
    }

    private refreshName(): void {
        let model = this.getModel();
        let name = model.getName();
        let view = this.getView();
        view.setName(name);
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
        let feature = notification.getFeature();
        let eventType = notification.getEventType();
        if (feature === XFigure.FEATURE_NAME) {
            if (eventType === Notification.SET) {
                this.refreshName();
            }
        }
    }

}

class FigureGraphicComposeOpenHandler extends BaseHandler {

    public handle(request: FigureGraphicComposerOpenRequest, callback: (data: any) => void): void {
        let controller = <FigurePresentController>this.controller;
        let director = directors.getGraphicPresentDirector(this.controller);
        director.openGraphicComposerFrom(controller, () => {
        });
    }

}

class FigureGraphicRefreshHandler extends BaseHandler {

    public handle(request: FigureGraphicRefreshRequest, callback: (data: any) => void): void {
        let controller = <FigurePresentController>this.controller;
        let director = directors.getGraphicPresentDirector(this.controller);
        director.refreshGraphic(controller);
    }

}

class FigureNameSetHandler extends BaseHandler {

    public handle(request: FigureNameSetRequest, callback: (data: any) => void): void {
        let figure = <XFigure>this.controller.getModel();
        let name = request.getStringData(FigureNameSetRequest.NAME);
        let command = new FigureNameSetCommand();
        command.setFigure(figure);
        command.setName(name)
        this.controller.execute(command);
    }

}

class FigureNameValidationHandler extends BaseHandler {

    public handle(request: FigureNameValidationRequest, callback: (data: any) => void): void {
        let name = request.getStringData(FigureNameValidationRequest.NAME);
        let director = directors.getViewsetPresentDirector(this.controller);
        director.validateOutletName(name, callback);
    }

}
