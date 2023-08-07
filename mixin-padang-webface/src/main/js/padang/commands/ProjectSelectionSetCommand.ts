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

import XProject from "padang/model/XProject";

export default class ProjectSelectionSetCommand extends Command {

    private project: XProject = null;
    private oldSelection: string = null;
    private newSelection: string = null;

    public setProject(project: XProject): void {
        this.project = project;
    }

    public setSelection(selection: string): void {
        this.newSelection = selection;
    }

    public execute(): void {
        this.oldSelection = this.project.getSelection();
        this.project.setSelection(this.newSelection);
    }

    public undo(): void {
        this.project.setSelection(this.oldSelection);
    }

    public redo(): void {
        this.project.setSelection(this.newSelection);
    }

}