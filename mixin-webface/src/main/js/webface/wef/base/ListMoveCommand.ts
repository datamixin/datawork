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
import EList from "webface/model/EList";

import Command from "webface/wef/Command";

export default class ListMoveCommand extends Command {

    private list: EList<any>;
    private element: any;
    private oldPosition: number = -1;
    private newPosition: number = -1;

    public setList(list: EList<any>): void {
        this.list = list;
    }

    public setElement(element: any): void {
        this.element = element;
    }

    public setPosition(position: number): void {
        this.newPosition = position;
    }

    public execute(): void {
        this.oldPosition = this.list.indexOf(this.element);
        this.exchange(this.oldPosition, this.newPosition);
    }

    private exchange(oldIndex: number, newIndex: number): void {
        this.list.move(this.element, newIndex >= this.element.length ? this.element.length - 1 : newIndex);
    }

    public undo(): void {
        this.exchange(this.newPosition, this.oldPosition);
    }

    public redo(): void {
        this.exchange(this.oldPosition, this.newPosition);
    }

}
