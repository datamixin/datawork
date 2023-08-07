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
import EList from "webface/model/EList";

import Command from "webface/wef/Command";

export default class ListRemoveAllCommand extends Command {

    private list: EList<any>;
    private copy: any[] = [];

    public setList(list: EList<any>): void {
        this.list = list;
    }

    public execute(): void {
        this.clear();
    }

    private clear(): void {
        for (let element of this.list) {
            this.copy.push(element);
        }
        this.list.clear();
    }

    public undo(): void {
        this.list.addAll(this.copy)
        this.copy = [];
    }

    public redo(): void {
        this.clear();
    }

}
