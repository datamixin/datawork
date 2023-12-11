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

import EObjectController from "webface/wef/base/EObjectController";
import BaseContentAdapter from "webface/wef/base/BaseContentAdapter";

import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import SheetToolsetView from "padang/view/toolset/SheetToolsetView";

export default class SheetToolsetController extends EObjectController {

    private adapter = new DatasetAdapter(this);

    constructor() {
        super();
        this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): SheetToolsetView {
        return new SheetToolsetView(this);
    }

    public getModel(): XSheet {
        return <XSheet>super.getModel();
    }

    public getView(): SheetToolsetView {
        return <SheetToolsetView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let foresee = model.getForesee();
        return [foresee];
    }

    public getCustomAdapters(): BaseContentAdapter[] {
        return [this.adapter];
    }

}

class DatasetAdapter extends BaseContentAdapter {

    public notifyChanged(notification: Notification): void {
        let feature = notification.getFeature();
        let controller = <SheetToolsetController>this.controller;
        let eventType = notification.getEventType();
        if (feature === XDataset.FEATURE_SOURCE) {
            if (eventType === Notification.SET) {
                controller.refresh();
            }
        }
    }

}