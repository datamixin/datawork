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
import ObjectMap from "webface/util/ObjectMap";

import PartViewer from "webface/wef/PartViewer";

import TaskKey from "bekasi/ui/TaskKey";
import TaskContent from "bekasi/ui/TaskContent";

import RunstackFile from "bekasi/resources/RunstackFile";

export default class TaskContentFactory {

    private static instance = new TaskContentFactory();

    private composers = new ObjectMap<typeof TaskContent>();

    constructor() {
        if (TaskContentFactory.instance) {
            throw new Error("Error: Instantiation failed: Use TaskContentFactory.getInstance() instead of new");
        }
        TaskContentFactory.instance = this;
    }

    public static getInstance(): TaskContentFactory {
        return TaskContentFactory.instance;
    }

    public register(name: string, composer: typeof TaskContent): void {
        this.composers.put(name, composer);
    }

    public create(name: string, parent: PartViewer, key: TaskKey, file: RunstackFile): TaskContent {
        let composerType: any = this.composers.get(name);
        let composer = <TaskContent>new composerType(parent, key, file);
        return composer;
    }

}