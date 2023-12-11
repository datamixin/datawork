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
import EObject from "webface/model/EObject";

import Command from "webface/wef/Command";

export default class ListSetCommand extends Command {

    private list: EList<EObject>;
    private oldElement: EObject;
    private newElement: EObject;
    private position: number = -1;

    public setList(list: EList<EObject>): void {
        this.list = list;
    }

    public setElement(element: EObject): void {
        this.newElement = element;
    }

    public setPosition(position: number): void {
        this.position = position;
    }

    public execute(): void {
        this.oldElement = this.list.get(this.position);
        this.list.set(this.position, this.newElement);
    }

    public undo(): void {
        this.list.set(this.position, this.oldElement);
    }

    public redo(): void {
        this.list.set(this.position, this.newElement);
    }

}
