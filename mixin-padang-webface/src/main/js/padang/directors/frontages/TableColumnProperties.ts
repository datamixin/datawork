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
import TableFrontage from "padang/directors/frontages/TableFrontage";
import GridFrontagePanel from "padang/directors/frontages/GridFrontagePanel";

import DefaultColumnProperties from "padang/view/DefaultColumnProperties";

import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";
import FacetPropertyGetRequest from "padang/requests/FacetPropertyGetRequest";

export default class TableColumnProperties extends DefaultColumnProperties {

    private submitSetProperty(keys: string[], value: any): void {
        let request = new FacetPropertySetRequest(keys, value);
        this.conductor.submit(request);
    }

    private submitGetProperty(keys: string[], callback: (value: any) => void): void {
        let request = new FacetPropertyGetRequest(keys);
        this.conductor.submit(request, callback);
    }

    public saveWidth(label: string, width: number): void {
        this.submitSetProperty([label, GridFrontagePanel.WIDTH], width);
    }

    public loadWidth(label: string, callback: (width: number) => void): void {
        this.submitGetProperty([label, GridFrontagePanel.WIDTH], callback);
    }

    public loadProperty(label: string, callback: (name: string, value: string) => void): void {
        let property = this.getProperties(label);
        if (property.size === 0) {
            this.submitGetProperty([label, TableFrontage.FORMAT], (format: string) => {
                callback(TableFrontage.FORMAT, format);
                let map = this.propertiesMap.get(label);
                map.set(TableFrontage.FORMAT, format);
            });
        } else {
            for (let name of property.keys()) {
                let value = property.get(name);
                callback(name, value);
            }
        }
    }

}