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
import BaseRunspaceDirector from "bekasi/directors/BaseRunspaceDirector";

import RestProjectRunstack from "padang/rest/RestProjectRunstack";
import RestProjectRunspace from "padang/rest/RestProjectRunspace";

import * as padang from "padang/padang";

export default class BaseProjectRunspaceDirector extends BaseRunspaceDirector {

    constructor() {
        super(RestProjectRunspace.getInstance(),
            RestProjectRunstack.getInstance());
    }

    public getFileIcon(): string {
        return padang.FILE_ICON;
    }

}