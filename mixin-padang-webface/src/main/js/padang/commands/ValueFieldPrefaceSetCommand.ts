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

import ValueField from "padang/model/ValueField";

export default class ValueFieldPrefaceSetCommand extends Command {

    private valueField: ValueField = null;
    private oldPreface: string = null;
    private newPreface: string = null;

    public setValueField(field: ValueField): void {
        this.valueField = field;
    }

    public setPreface(preface: string): void {
        this.newPreface = preface;
    }

    public execute(): void {
        this.oldPreface = this.valueField.getPreface();
        this.valueField.setPreface(this.newPreface);
    }

    public undo(): void {
        this.valueField.setPreface(this.oldPreface);
    }

    public redo(): void {
        this.valueField.setPreface(this.newPreface);
    }

}