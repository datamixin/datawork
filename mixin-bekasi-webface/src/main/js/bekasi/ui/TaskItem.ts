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
import TaskKey from "bekasi/ui/TaskKey";
import TaskContent from "bekasi/ui/TaskContent";

export abstract class TaskItem {

    private key: TaskKey = null;
    private image: string;
    private content: TaskContent = null;

    constructor(key: TaskKey, content: TaskContent, image: string) {
        this.key = key;
        this.content = content;
        this.image = image;
    }

    public getKey(): TaskKey {
        return this.key;
    }

    public setKey(key: TaskKey): void {
        this.key = key;
    }

    public getContent(): TaskContent {
        return this.content;
    }

    public abstract getText(): string;

    public isCloseable(): boolean {
        return false;
    }

    public getImage(): string {
        return this.image;
    }

    public save(callback: () => void): void {

    }

    public close(callback: (confirm: boolean) => void): void {
        callback(false);
    }

}

export default TaskItem;