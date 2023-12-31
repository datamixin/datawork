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

export default class GridDefaultColumnLabel implements GridColumnLabel {

    private label: string = null;

    constructor(label: string) {
        this.label = label;
    }

    public getLabel(): string {
        return this.label;
    }

    public getIdentifier(): string {
        return this.label;
    }

    public equals(label: GridColumnLabel): boolean {
        return this.label === label.getLabel();
    }

}