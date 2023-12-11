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

import XFacet from "padang/model/XFacet";
import XCell from "padang/model/XCell";

export default class CellFacetSetCommand extends Command {

    private cell: XCell = null;
    private oldFacet: XFacet = null;
    private newFacet: XFacet = null;

    public setCell(cell: XCell): void {
        this.cell = cell;
    }

    public setFacet(facet: XFacet): void {
        this.newFacet = facet;
    }

    public execute(): void {
        this.oldFacet = this.cell.getFacet();
        this.cell.setFacet(this.newFacet);
    }

    public undo(): void {
        this.cell.setFacet(this.oldFacet);
    }

    public redo(): void {
        this.cell.setFacet(this.newFacet);
    }

}