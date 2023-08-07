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
import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";
import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import RunspaceItemFindoutController from "padang/controller/findout/RunspaceItemFindoutController";
import RunspaceItemListFindoutController from "padang/controller/findout/RunspaceItemListFindoutController";

export default class FindoutControllerFactory extends LeanControllerFactory {

    constructor() {
        super();

        super.register(RunspaceItem.LEAN_NAME, RunspaceItemFindoutController);
        super.register(RunspaceItemList.LEAN_NAME, RunspaceItemListFindoutController);
        super.register(RunspaceHomeList.LEAN_NAME, RunspaceItemListFindoutController);
    }
}