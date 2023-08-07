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
import Map from "webface/util/Map";

import Controller from "webface/wef/Controller";
import DragParticipant from "webface/wef/DragParticipant";
import DragParticipantPart from "webface/wef/DragParticipantPart";

export default class BaseDragParticipant implements DragParticipant {

    protected controller: Controller = null;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    protected getView(): DragParticipantPart {
        let view = <DragParticipantPart><any>this.controller.getView();
        return view;
    }

    public start(data: Map<any>): void {
        let view = this.getView();
        view.dragStart(true);
    }

    public isInRange(x: number, y: number): boolean {
        let view = this.getView();
        return view.isInRange(x, y);
    }

    public isShowFeedback(data: Map<any>): boolean {
        return true;
    }

    public showFeedback(data: Map<any>, x: number, y: number): void {
        let view = this.getView();
        view.showFeedback(data, x, y);
    }

    public clearFeedback(data: Map<any>): void {
        let view = this.getView();
        view.clearFeedback(data);
    }

    public stop(): void {
        let view = this.getView();
        view.dragStop();
    }

}
