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

import XDataset from "padang/model/XDataset";

import DatasetOutlineView from "padang/view/outline/DatasetOutlineView";

import ReceiptOutlineController from "padang/controller/outline/ReceiptOutlineController";

export default class DatasetOutlineController extends ReceiptOutlineController {

    public createView(): DatasetOutlineView {
        return new DatasetOutlineView(this);
    }

    public getModel(): XDataset {
        return <XDataset>super.getModel();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshIcon();
    }

    private refreshIcon(): void {
        let model = this.getModel();
        let source = model.getSource();
        if (source === null) {
            source = model;
        }
        let eClass = source.eClass();
        let className = eClass.getNameWithoutPackage();
        super.setIcon(className);
    }

    public notifyChanged(notification: Notification): void {
        super.notifyChanged(notification);
        let eventType = notification.getEventType();
        let feature = notification.getFeature();
        if (eventType === Notification.SET) {
            if (feature === XDataset.FEATURE_SOURCE) {
                this.refreshIcon();
            }
        }
    }

}
