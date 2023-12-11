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

export default class ListRemoveRangeCommand extends Command {

    private list: EList<any>;
    private start: number = -1;
    private end: number = -1;
    private copy: any[] = [];

    public setList(list: EList<any>): void {
        this.list = list;
    }

    public setStart(start: number): void {
        this.start = start;
    }

    public setEnd(end: number): void {
        this.end = end;
    }

    public execute(): void {
        this.removeRange();
    }

    private removeRange(): void {
        this.start = this.start === -1 ? 0 : this.start;
        this.end = this.end === -1 ? this.list.size : this.end;
        for (let i = this.start; i < this.end; i++) {
            let element = this.list.get(i);
            this.copy.push(element);
        }
        this.list.removeRange(this.start, this.end);
    }

    public undo(): void {
        this.list.insertRange(this.copy, this.start);
        this.copy = [];
    }

    public redo(): void {
        this.removeRange();
    }

}
