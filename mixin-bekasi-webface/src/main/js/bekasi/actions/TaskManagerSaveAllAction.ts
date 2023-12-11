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

import TaskManagerAction from "bekasi/actions/TaskManagerAction";

export default class SaveAllTaskAction extends TaskManagerAction {

    public getText(): string {
        return "Save All";
    }

    public run(): void {
        let keys = this.manager.getItemKeys();
        let selected = this.manager.getSelectedContent();
        let active = selected.getTaskKey();
        this.save(keys, 0, active);
    }

    private save(keys: TaskKey[], index: number, active: TaskKey): void {
        let key = keys[index];
        let item = this.manager.getItem(key);
        let content = item.getContent();
        let selected = this.manager.getSelectedContent();
        if (content === selected) {
            this.saveItem(item, keys, index, active);
        } else {
            this.manager.selectItem(key, false, true, () => {
                this.saveItem(item, keys, index, active);
            });
        }
    }

    private saveItem(item: TaskItem, keys: TaskKey[], index: number, active: TaskKey): void {
        item.save(() => {
            if (index < keys.length - 1) {
                this.save(keys, index + 1, active);
            } else {
                if (keys[index] !== active) {
                    this.manager.selectItem(active, false, true, () => { });
                }
            }
        });
    }

}
