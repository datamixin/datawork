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

import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

export default class TopLevelSpecTitleSetCommand extends Command {

    private spec: XTopLevelSpec = null;
    private oldTitle: string = null;
    private newTitle: string = null;

    public setTopLevelSpec(spec: XTopLevelSpec): void {
        this.spec = spec;
    }

    public setTitle(title: string): void {
        this.newTitle = title;
    }

    public execute(): void {
        this.oldTitle = this.spec.getTitle();
        this.spec.setTitle(this.newTitle);
    }

    public undo(): void {
        this.spec.setTitle(this.oldTitle);
    }

    public redo(): void {
        this.spec.setTitle(this.newTitle);
    }

}