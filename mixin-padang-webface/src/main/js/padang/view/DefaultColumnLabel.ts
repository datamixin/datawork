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
import GridColumnLabel from "padang/grid/GridColumnLabel";

export default class DefaultColumnLabel implements GridColumnLabel {

    private name: string = null;
    private type: string = null;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    public getLabel(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public equals(label: DefaultColumnLabel): boolean {
        return this.name === label.getLabel() && this.type === label.getType();
    }

}