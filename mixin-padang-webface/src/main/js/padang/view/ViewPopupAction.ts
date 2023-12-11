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
import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";
import PopupAction from "webface/action/PopupAction";

export default class ViewPopupAction extends PopupAction {

    private actions: GroupAction | Action[] = null;

    constructor(actions: GroupAction | Action[]) {
        super();
        this.actions = actions;
    }

    public getActions(): Action[] {
        if (this.actions instanceof GroupAction) {
            return this.actions.getActions();
        } else {
            return this.actions;
        }
    }

}
