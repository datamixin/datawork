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

import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import EListController from "webface/wef/base/EListController";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";
import BaseDragParticipant from "webface/wef/base/BaseDragParticipant";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";

import SheetListOutlineView from "padang/view/outline/SheetListOutlineView";

import ProjectSelectionSetCommand from "padang/commands/ProjectSelectionSetCommand";

import SheetListSheetDropObjectRequest from "padang/requests/outline/SheetListSheetDropObjectRequest";
import SheetListSheetDropVerifyRequest from "padang/requests/outline/SheetListSheetDropVerifyRequest";

export default class SheetListOutlineController extends EListController {

    constructor() {
        super();
        this.addParticipant(directors.SHEET_DRAG_PARTICIPANT, new SheetListSheetDragParticipant(this));
    }

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(SheetListSheetDropVerifyRequest.REQUEST_NAME, new SheetListSheetDropVerifyHandler(this));
        super.installRequestHandler(SheetListSheetDropObjectRequest.REQUEST_NAME, new SheetListSheetDropObjectHandler(this));
    }

    public createView(): SheetListOutlineView {
        return new SheetListOutlineView(this);
    }

    public getModel(): EList<XSheet> {
        return <EList<XSheet>>super.getModel();
    }

    public getView(): SheetListOutlineView {
        return <SheetListOutlineView>super.getView();
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshSelection();
    }

    private refreshSelection(): void {
        let model = this.getModel();
        let project = <XProject>model.eOwner();
        let selection = project.getSelection();
        let children = this.getChildren();
        for (let child of children) {
            let sheet = <XSheet>child.getModel();
            let name = sheet.getName();
            if (name === selection) {
                let director = wef.getSelectionDirector(this);
                director.select(child);
            }
        }
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
        if (feature === XProject.FEATURE_SHEETS) {

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

                    let child = children[position];
                    let sheet = <XSheet>child.getModel();
                    let selection = sheet.getName();

                    let model = this.getModel();
                    let project = <XProject>model.eOwner();
                    if (selection !== project.getSelection()) {
                        let command = new ProjectSelectionSetCommand();
                        command.setProject(project);
                        command.setSelection(selection);
                        this.execute(command);
                    }

                }

            }

        } else if (feature === XProject.FEATURE_SELECTION) {
            this.refreshSelection();
        }

    }

}

class SheetListSheetDragParticipant extends BaseDragParticipant {

    public start(data: ObjectMap<any>): void {

        let accepted = false;
        if (data.containsKey(padang.DRAG_SOURCE)) {
            accepted = true;
        }

        let view = this.getView();
        view.dragStart(accepted);
    }

}

class SheetListSheetDropVerifyHandler extends BaseHandler {

    public handle(request: SheetListSheetDropVerifyRequest, callback: (data: any) => void): void {
        let data = <ObjectMap<any>>request.getData(SheetListSheetDropVerifyRequest.DATA);
        if (data.containsKey(padang.DRAG_SOURCE)) {
            callback(null);
        } else {
            callback("Missing drag data '" + padang.DRAG_SOURCE + "'");
        }
    }

}

class SheetListSheetDropObjectHandler extends BaseHandler {

    public handle(request: SheetListSheetDropObjectRequest, callback: (data: any) => void): void {

        let source = <number>request.getData(SheetListSheetDropObjectRequest.SOURCE_POSITION);
        let target = <number>request.getData(SheetListSheetDropObjectRequest.TARGET_POSITION);
        if (source !== target && source + 1 !== target) {

            let controller = <SheetListOutlineController>this.controller;
            let list = <EList<XSheet>>controller.getModel();
            let model = list.get(source);

            let command = new ListMoveCommand();
            command.setList(list);
            command.setElement(model);
            command.setPosition(target);

            this.controller.execute(command);

        }

    }

}
