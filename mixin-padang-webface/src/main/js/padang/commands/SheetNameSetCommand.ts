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

import XSheet from "padang/model/XSheet";

export default class SheetNameSetCommand extends Command {

    private sheet: XSheet = null;
    private oldName: string = null;
    private newName: string = null;

    public setSheet(sheet: XSheet): void {
        this.sheet = sheet;
    }

    public setName(name: string): void {
        this.newName = name;
    }

    public execute(): void {
        this.oldName = this.sheet.getName();
        this.sheet.setName(this.newName);
    }

    public undo(): void {
        this.sheet.setName(this.oldName);
    }

    public redo(): void {
        this.sheet.setName(this.newName);
    }

}