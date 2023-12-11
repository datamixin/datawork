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
import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";
import TaskContent from "bekasi/ui/TaskContent";

import WorkspaceSite from "bekasi/ui/WorkspaceSite";

abstract class BaseTaskItem extends TaskItem {

    protected site: WorkspaceSite = null;

    constructor(key: TaskKey, content: TaskContent, image: string, site: WorkspaceSite) {
        super(key, content, image);
        this.site = site;
    }

}

export default BaseTaskItem;