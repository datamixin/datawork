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
import Conductor from "webface/wef/Conductor";

import GridColumnProperties from "padang/grid/GridColumnProperties";

export default class DefaultColumnProperties implements GridColumnProperties {

    protected conductor: Conductor = null;

    protected propertiesMap = new Map<string, Map<string, any>>();
    protected onWidthChangedMap = new Map<string, (width: number) => void>();
    protected onPropertyChangedMap = new Map<string, ((name: string, value: any) => void)[]>();

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public saveWidth(label: string, width: number): void {

    }

    public getColumns(): string[] {
        let names: string[] = [];
        for (let key of this.propertiesMap.keys()) {
            names.push(key);
        }
        return names;
    }

    public applyWidth(label: string, width: number): void {
        if (this.onWidthChangedMap.has(label)) {
            let callback = this.onWidthChangedMap.get(label);
            callback(width);
        }
    }

    public applyProperty(label: string, property: string, value: any): void {
        if (this.onPropertyChangedMap.has(label)) {
            let callbacks = this.onPropertyChangedMap.get(label);
            for (let callback of callbacks) {
                callback(property, value);
            }
        }
        let properties = this.getProperties(label);
        properties.set(property, value);
    }

    protected getProperties(label: string): Map<string, any> {
        if (!this.propertiesMap.has(label)) {
            this.propertiesMap.set(label, new Map<string, any>());
        }
        return this.propertiesMap.get(label);
    }

    public loadWidth(label: string, callback: (width: number) => void): void {

    }

    public loadProperty(label: string, callback: (name: string, value: string) => void): void {

    }

    public setOnWidthChanged(label: string, callback: (width: number) => void): void {
        this.onWidthChangedMap.set(label, callback);
    }

    public addOnPropertyChanged(label: string, callback: (name: string, value: any) => void): void {
        if (!this.onPropertyChangedMap.has(label)) {
            this.onPropertyChangedMap.set(label, []);
        }
        let callbacks = <any[]>this.onPropertyChangedMap.get(label);
        callbacks.push(callback);
    }

    public remove(label: string): void {
        this.propertiesMap.delete(label);
        this.onWidthChangedMap.delete(label);
        this.onPropertyChangedMap.delete(label);
    }

}