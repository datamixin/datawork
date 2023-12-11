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
import Command from "webface/wef/Command";

export default class CommandGroup extends Command {

    private commands: Command[] = [];

    constructor(commands?: Command[]) {
        super();
        this.commands = commands ? commands : [];
    }

    public get(index: number): Command {
        return this.commands[index];
    }

    public add(command: Command, index?: number): void {
        if (index === undefined) {
            this.commands.push(command);
        } else {
            this.commands.splice(index, 0, command);
        }
    }

    public get size(): number {
        return this.commands.length;
    }

    public execute(): void {
        for (var i = 0; i < this.commands.length; i++) {
            let command = this.commands[i];
            command.execute();
        }
    }

    public undo(): void {
        for (var i = 0; i < this.commands.length; i++) {
            let command = this.commands[i];
            command.undo();
        }
    }

    public redo(): void {
        for (var i = 0; i < this.commands.length; i++) {
            let command = this.commands[i];
            command.redo();
        }
    }

}
