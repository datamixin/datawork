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
import RestFileExport from "bekasi/rest/RestFileExport";

export default class RestProjectExport extends RestFileExport {

    private static instance: RestProjectExport = new RestProjectExport();

    constructor() {
        super("/projects/exports");
        if (RestProjectExport.instance) {
            throw new Error("Error: Instantiation failed: Use RestProjectExport.getInstance() instead of new");
        }
        RestProjectExport.instance = this;
    }

    public static getInstance(): RestProjectExport {
        return RestProjectExport.instance;
    }

}

export let managerSpace = RestProjectExport.getInstance();
