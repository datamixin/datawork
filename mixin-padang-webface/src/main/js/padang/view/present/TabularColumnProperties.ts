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
import VisageValue from "bekasi/visage/VisageValue";

import DefaultColumnProperties from "padang/view/DefaultColumnProperties";

import TabularColumnProfileRequest from "padang/requests/TabularColumnProfileRequest";
import TabularColumnWidthSetRequest from "padang/requests/TabularColumnWidthSetRequest";
import TabularColumnWidthGetRequest from "padang/requests/TabularColumnWidthGetRequest";
import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";

export default class TabularColumnProperties extends DefaultColumnProperties {

    public static FORMAT = "format";
    public static INITIAL_PROFILE = "default-profile";
    public static INSPECT_PROFILE = "inspect-profile";
    public static INSPECT_SELECTIONS = "inspect-selections";

    public saveWidth(label: string, width: number): void {
        let request = new TabularColumnWidthSetRequest(label, width);
        this.conductor.submit(request);
    }

    public loadWidth(label: string, callback: (width: number) => void): void {
        let request = new TabularColumnWidthGetRequest(label);
        this.conductor.submit(request, callback);
    }

    public loadProperty(label: string, callback: (name: string, value: string) => void): void {
        let property = this.getProperties(label);
        if (property.size === 0) {
            let request = new TabularColumnFormatGetRequest(label);
            this.conductor.submit(request, (format: string) => {
                callback(TabularColumnProperties.FORMAT, format);
                let map = this.propertiesMap.get(label);
                map.set(TabularColumnProperties.FORMAT, format);
            });
        } else {
            for (let name of property.keys()) {
                callback(name, property.get(name));
            }
        }
    }

    public loadProfile(label: string, type: string, complete: () => void): void {

        let request = new TabularColumnProfileRequest(label, type, true);
        this.conductor.submit(request, (result: VisageValue) => {

            let callbacks = this.onPropertyChangedMap.get(label) || [];
            for (let callback of callbacks) {
                callback(TabularColumnProperties.INITIAL_PROFILE, result);

                // Format
                let map = this.propertiesMap.get(label);
                let format = map.get(TabularColumnProperties.FORMAT);
                callback(TabularColumnProperties.FORMAT, format);

            }
            complete();

        });
    }

    public loadInspectProfile(label: string, type: string, callback: () => void): void {
        let request = new TabularColumnProfileRequest(label, type, false);
        this.conductor.submit(request, callback);
    }

}