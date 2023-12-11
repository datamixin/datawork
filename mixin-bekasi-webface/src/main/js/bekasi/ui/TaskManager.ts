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
import Composite from "webface/widgets/Composite";

import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";
import TaskContent from "bekasi/ui/TaskContent";

export interface TaskManager {

    selectDefault(): void;

    setDefault(item: TaskItem): void;

    setContentContainer(composite: Composite): void;

    addItem(item: TaskItem, closable?: boolean): void;

    isItemExists(key: TaskKey): boolean;

    getItem(key: TaskKey): TaskItem;

    setItemName(key: TaskKey, name: string): void;

    selectItem(key: TaskKey, preference: boolean, content: boolean, callback: () => void): void;

    removeItem(key: TaskKey): void;

    refreshItem(key: TaskKey): void;

    getItemKeys(): TaskKey[];

    getSelectedContent(): TaskContent;

    setSelectedContent(content: TaskContent): void;

}

export default TaskManager;