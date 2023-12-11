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
import Controller from "webface/wef/Controller";

import ContentLayoutParticipant from "bekasi/directors/ContentLayoutParticipant";

export default class BaseContentLayoutParticipant implements ContentLayoutParticipant {

    private controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    public isContaining(source: Controller): boolean {
        let current = source;
        do {
            if (current === this.controller) {
                return true;
            }
            current = current.getParent();
        } while (current !== null);
        return false;
    }

    public relayout(): void {
        let view: any = this.controller.getView();
        if (view.relayout) {
            view.relayout();
        } else if (view.adjustHeight) {
            view.adjustHeight();
        }
    }

}