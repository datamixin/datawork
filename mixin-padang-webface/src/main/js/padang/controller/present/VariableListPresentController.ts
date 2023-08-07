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
import * as wef from "webface/wef";

import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import EListController from "webface/wef/base/EListController";

import * as bekasi from "bekasi/directors";

import XVariable from "padang/model/XVariable";

import VariableListPresentView from "padang/view/present/VariableListPresentView";

import VariablePresentController from "padang/controller/present/VariablePresentController";

export default class VariableListPresentController extends EListController {

    constructor() {
        super();
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
    }

    public createView(): VariableListPresentView {
        return new VariableListPresentView(this);
    }

    public getModel(): EList<XVariable> {
        return <EList<XVariable>>super.getModel();
    }

    public getView(): VariableListPresentView {
        return <VariableListPresentView>super.getView();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
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

        let feature = notification.getFeature();
        let notifier = notification.getNotifier();
        let model = this.getModel();
        let value = notifier.eGet(feature);
        if (value === model) {

            let eventType = notification.getEventType();
            if (eventType === Notification.SET ||
                eventType === Notification.ADD ||
                eventType === Notification.REMOVE ||
                eventType === Notification.MOVE) {

                this.refreshChildren();

                if (eventType === Notification.ADD || eventType === Notification.REMOVE) {

                    // Kendalikan selection setelah perubahan
                    let children = this.getChildren();
                    let position = notification.getListPosition();
                    if (eventType === Notification.ADD) {
                        let position = notification.getListPosition();
                        if (position === -1) {
                            position = children.length - 1;
                        }
                    } else if (eventType === Notification.REMOVE) {
                        if (position === children.length) {
                            position -= 1;
                        }
                    }
                    if (position !== -1) {
                        let child = <VariablePresentController>children[position];
                        let director = wef.getSelectionDirector(this);
                        director.select(child);
                    }
                }
            }
        }
    }

}

