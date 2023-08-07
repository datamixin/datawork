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
import BaseHandler from "webface/wef/base/BaseHandler";

import LeanController from "bekasi/controller/LeanController";

import ViceReference from "vegazoo/model/ViceReference";

import ViceReferenceCustomView from "vegazoo/view/custom/ViceReferenceCustomView";

import ViceReferenceUsedSetCommand from "vegazoo/commands/ViceReferenceUsedSetCommand";

import ViceReferenceUsedSetRequest from "vegazoo/requests/custom/ViceReferenceUsedSetRequest";

export default class ViceReferenceCustomController extends LeanController {

    public createRequestHandlers(): void {
        super.createRequestHandlers();
        super.installRequestHandler(ViceReferenceUsedSetRequest.REQUEST_NAME, new ViceReferenceUsedSetHandler(this));
    }

    public getModel(): ViceReference {
        return <ViceReference>super.getModel();
    }

    public createView(): ViceReferenceCustomView {
        return new ViceReferenceCustomView(this);
    }

    public getView(): ViceReferenceCustomView {
        return <ViceReferenceCustomView>super.getView();
    }

    public getModelChildren(): any[] {
        let model = this.getModel();
        let parent = model.getModel();
        let reference = model.getReference();
        let value = parent.eGet(reference);
        if (value !== null) {
            return [value];
        } else {
            return [];
        }
    }

    public refreshVisuals(): void {
        super.refreshVisuals();
        this.refreshName();
        this.refreshUsed();
    }

    private refreshName(): void {
        let model = this.getModel();
        let reference = model.getReference();
        let name = reference.getName();
		name = name[0].toUpperCase() + name.substring(1);
        let view = this.getView();
        view.setName(name);
    }

    private refreshUsed(): void {
        let model = this.getModel();
        let reference = model.getReference();
        let parent = model.getModel();
        let value = parent.eGet(reference);
        let view = this.getView();
        view.setUsed(value !== null);
    }

}

class ViceReferenceUsedSetHandler extends BaseHandler {

    public handle(request: ViceReferenceUsedSetRequest, _callback: (data: any) => void): void {
        let used = request.getData(ViceReferenceUsedSetRequest.USED);
        let controller = <ViceReferenceCustomController>this.controller;
        let reference = controller.getModel();
        let command = new ViceReferenceUsedSetCommand();
        command.setReference(reference);
        command.setUsed(used);
        controller.execute(command);
    }

}
