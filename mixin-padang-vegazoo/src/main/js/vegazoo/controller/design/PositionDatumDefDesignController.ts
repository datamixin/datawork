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
import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as padang from "padang/padang";

import * as directors from "vegazoo/directors";

import VegazooFactory from "vegazoo/model/VegazooFactory";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";

import PositionDatumDefDesignView from "vegazoo/view/design/PositionDatumDefDesignView";

import PositionDatumDefDragDirector from "vegazoo/directors/PositionDatumDefDragDirector";

import ObjectDefDesignController from "vegazoo/controller/design/ObjectDefDesignController";

import PositionDatumDefClearRequest from "vegazoo/requests/design/PositionDatumDefClearRequest";
import PositionDatumDefDragAreaRequest from "vegazoo/requests/design/PositionDatumDefDragAreaRequest";
import PositionDatumDefDragSourceDragRequest from "vegazoo/requests/design/PositionDatumDefDragSourceDragRequest";
import PositionDatumDefDragSourceStopRequest from "vegazoo/requests/design/PositionDatumDefDragSourceStopRequest";
import PositionDatumDefDragSourceStartRequest from "vegazoo/requests/design/PositionDatumDefDragSourceStartRequest";

export default class PositionDatumDefDesignController extends ObjectDefDesignController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(PositionDatumDefClearRequest.REQUEST_NAME, new PositionDatumDefClearHandler(this));
        super.installRequestHandler(PositionDatumDefDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
        super.installRequestHandler(PositionDatumDefDragSourceDragRequest.REQUEST_NAME, new PositionDatumDefDragSourceDragHandler(this));
        super.installRequestHandler(PositionDatumDefDragSourceStopRequest.REQUEST_NAME, new PositionDatumDefDragSourceStopHandler(this));
        super.installRequestHandler(PositionDatumDefDragSourceStartRequest.REQUEST_NAME, new PositionDatumDefDragSourceStartHandler(this));
    }

    public createView(): PositionDatumDefDesignView {
        return new PositionDatumDefDesignView(this);
    }

    public getView(): PositionDatumDefDesignView {
        return <PositionDatumDefDesignView>super.getView();
    }

    public getModel(): XPositionDatumDef {
        return <XPositionDatumDef>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshDatum();
    }

    private refreshDatum(): void {
        let model = this.getModel();
        let encoded = model.getDatum();
        if (encoded !== null) {
            let decoded = atob(encoded);
            let view = this.getView();
            view.setDatum(decoded);
        }
    }
}

class PositionDatumDefClearHandler extends BaseHandler {

    public handle(request: PositionDatumDefClearRequest, callback: (data: any) => void): void {
        let controller = <PositionDatumDefDesignController>this.controller;
        let removed = !controller.isActive();
        if (!removed) {
            let model = controller.getModel();
            let factory = VegazooFactory.eINSTANCE;
            let fieldDef = factory.createPositionDatumDef();
            let command = new ReplaceCommand();
            command.setModel(model);
            command.setReplacement(fieldDef);
            controller.execute(command);
        }
    }

}

class PositionDatumDefDragSourceStartHandler extends BaseHandler {

    public handle(request: PositionDatumDefDragSourceStartRequest, callback?: (data: any) => void): void {

        let controller = <PositionDatumDefDesignController>this.controller;
        let data = new ObjectMap<any>();

        let model = controller.getModel();
        let formula = model.getDatum();
        data.put(padang.FIELD_FORMULA, formula);
        data.put(padang.DRAG_SOURCE, model);

        let director = directors.getPositionDatumDefDragDirector(this.controller);
        director.start(data);

        callback(data);

    }
}

class PositionDatumDefDragSourceDragHandler extends BaseHandler {

    public handle(request: PositionDatumDefDragSourceDragRequest, callback: (data: any) => void): void {
        let data = <ObjectMap<any>>request.getData(PositionDatumDefDragSourceDragRequest.DATA);
        let x = <number>request.getData(PositionDatumDefDragSourceDragRequest.X);
        let y = <number>request.getData(PositionDatumDefDragSourceDragRequest.Y);
        let director = directors.getPositionDatumDefDragDirector(this.controller);
        director.drag(data, x, y);
        callback(data);
    }

}

class PositionDatumDefDragSourceStopHandler extends BaseHandler {

    private director: PositionDatumDefDragDirector = null;

    constructor(controller: PositionDatumDefDesignController) {
        super(controller);
        this.director = directors.getPositionDatumDefDragDirector(this.controller);
    }

    public handle(request: PositionDatumDefDragSourceStopRequest, callback: (data: any) => void): void {
        this.director.stop();
    }

}