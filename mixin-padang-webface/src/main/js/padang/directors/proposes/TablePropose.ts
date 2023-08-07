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
import XCall from "sleman/model/XCall";
import XPointer from "sleman/model/XPointer";

import VisageType from "bekasi/visage/VisageType";

import Preface from "padang/directors/proposes/Preface";
import Propose from "padang/directors/proposes/Propose";
import ProposeRegistry from "padang/directors/proposes/ProposeRegistry";

import LastRows from "padang/functions/dataset/LastRows";
import FirstRows from "padang/functions/dataset/FirstRows";

export default class TablePropose extends Propose {

    private prefaces = new Map<string, Preface>();

    constructor() {
        super();
        this.prefaces.set("First Rows", new Preface(FirstRows.FUNCTION_NAME, false, VisageType.TABLE));
        this.prefaces.set("Last Rows", new Preface(LastRows.FUNCTION_NAME, false, VisageType.TABLE));
    }

    public getPrefaces(type: string): Map<string, Preface> {
        return this.prefaces;
    }

    public createCall(name: string, pointer: XPointer): XCall {
        let preface = this.prefaces.get(name);
        return preface.createCall(pointer);
    }

}

let registry = ProposeRegistry.getInstance();
registry.register("table", new TablePropose());
