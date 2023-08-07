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
import Command from "webface/wef/Command";
import CommandStack from "webface/wef/CommandStack";
import AssistCommand from "webface/wef/AssistCommand";

import ModelSynchronizer from "webface/model/ModelSynchronizer";

export default class ArrayCommandStack implements CommandStack {

    private static LIMIT = 256;

    private marks: number[] = [];
    private index: number = -1;
    private commands: Command[] = [];
    private synchronizer: ModelSynchronizer = null;

    constructor(synchronizer?: ModelSynchronizer) {
        if (synchronizer !== undefined) {
            this.synchronizer = synchronizer;
        }
    }

    private maintain(command: Command): void {

        if (this.index === this.commands.length - 1) {

            // Jika stack sudah maximum hapus terlebih dahulu yang pertama
            if (this.commands.length === ArrayCommandStack.LIMIT) {
                this.commands.shift();
            }

        } else {

            // Jika index tidak terakhir berarti sudah undo, maka hapus setelah index
            let newIndex = this.index + 1;
            let deleteCount = this.commands.length - newIndex;
            this.commands.splice(newIndex, deleteCount);

        }

        // Tambahkan ke akhir commands
        if (!(command instanceof AssistCommand)) {
            this.commands.push(command);
            this.index = this.commands.length - 1;
        }

    }

    public execute(command: Command): void {
        this.maintain(command);
        command.execute();
        this.synchronize();
    }

    private synchronize(callback?: () => void): void {
        if (this.synchronizer !== null) {
            this.synchronizer.commit(callback);
        }
    }

    public mark(): void {
        this.marks.push(length - 1);
    }

    public reset(callback?: () => void): void {
        if (this.marks.length > 0) {
            let markIndex = this.marks.pop();
            let count = this.index - markIndex;
            this.index = markIndex;
            let sequences = this.commands.splice(this.index + 1, count);
            if (callback !== undefined) {
                this.undoCommands(sequences, callback);
            }
        }
    }

    private undoCommands(sequences: Command[], callback: () => void): void {
        if (sequences.length > 0) {
            let command = sequences.pop();
            this.undoSync(command, () => {
                this.undoCommands(sequences, callback);
            });
        } else {
            callback();
        }
    }

    private undoSync(command: Command, callback?: () => void): void {
        command.undo();
        this.synchronize(callback);
    }

    private redoSync(command: Command, callback?: () => void): void {
        command.redo();
        this.synchronize(callback);
    }

    public canUndo(): boolean {
        return this.index >= 0;
    }

    public undo(): void {
        let command = this.commands[this.index];
        this.index = this.index - 1;
        this.undoSync(command);
    }

    public canRedo(): boolean {
        return this.index < this.commands.length - 1;
    }

    public redo(): void {
        let newIndex = this.index + 1;
        let command = this.commands[newIndex];
        this.index = newIndex;
        this.redoSync(command);
    }

}
