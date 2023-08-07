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
import ObjectMap from "webface/util/ObjectMap";

import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";
import TaskContent from "bekasi/ui/TaskContent";
import TaskContentViewer from "bekasi/ui/TaskContentViewer";

export default class TaskItemFactory {

    private static instance = new TaskItemFactory();

    private composers = new ObjectMap<typeof TaskItem>();

    constructor() {
        if (TaskItemFactory.instance) {
            throw new Error("Error: Instantiation failed: Use TaskItemFactory.getInstance() instead of new");
        }
        TaskItemFactory.instance = this;
    }

    public static getInstance(): TaskItemFactory {
        return TaskItemFactory.instance;
    }

    public register(name: string, composer: typeof TaskItem): void {
        this.composers.put(name, composer);
    }

    public create(name: string, key: TaskKey, content: TaskContent, image: string, viewer: TaskContentViewer): TaskItem {
        let composerType: any = this.composers.get(name);
        let composer = <TaskItem>new composerType(key, content, image, viewer);
        return composer;
    }

}