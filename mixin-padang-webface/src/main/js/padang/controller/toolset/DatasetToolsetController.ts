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

import XDataset from "padang/model/XDataset";

import DatasetToolsetView from "padang/view/toolset/DatasetToolsetView";

import ReceiptToolsetController from "padang/controller/toolset/ReceiptToolsetController";

export default class DatasetToolsetController extends ReceiptToolsetController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): DatasetToolsetView {
        return new DatasetToolsetView(this);
    }

    public getModel(): XDataset {
        return <XDataset>super.getModel();
    }

    public getView(): DatasetToolsetView {
        return <DatasetToolsetView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let source = model.getSource();
        if (source !== null) {
            let display = model.getDisplay();
            return [display];
        } else {
            return [];
        }
    }

    private relayout(): void {
        let director = bekasi.getContentLayoutDirector(this);
        director.relayout(this);
    }

    public notifyChanged(notification: Notification): void {
        let eventType = notification.getEventType();
        if (eventType === Notification.SET) {
            let feature = notification.getFeature();
            if (feature === XDataset.FEATURE_SOURCE) {
                this.refreshChildren();
                this.relayout();
            }
        }
    }

}
