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
import GridControlStyle from "padang/grid/GridControlStyle";
import GridColumnProperties from "padang/grid/GridColumnProperties";

export default class GridDefaultColumnProperties implements GridColumnProperties {

    private widthMap = new Map<string, number>();
    private propertyMap = new Map<string, Map<string, any>>();
    private onWidthChangedMap = new Map<string, (width: number) => void>();
    private onPropertyChangedMap = new Map<string, []>();

    public remove(label: any): void {
        this.onWidthChangedMap.delete(label);
    }

    public saveWidth(label: any, width: number): void {
        this.widthMap.set(label, width);
        let callback = this.onWidthChangedMap.get(label);
        callback(width);
    }

    public loadWidth(label: any, callback: (width: number) => void): void {
        let width = GridControlStyle.MIN_COLUMN_WIDTH;
        if (this.widthMap.has(label)) {
            width = this.widthMap.get(label);
        }
        callback(width);
    }

    public loadProperty(label: any, callback: (name: string, value: any) => void): void {
        let property = new Map<string, any>();
        if (this.propertyMap.has(label)) {
            property = this.propertyMap.get(label);
        }
        for (let name of property.keys()) {
            callback(name, property.get(name));
        }
    }

    public setOnWidthChanged(label: any, callback: (width: number) => void): void {
        this.onWidthChangedMap.set(label, callback);
    }

    public addOnPropertyChanged(label: any, callback: (name: string, value: any) => void): void {
        if (!this.onPropertyChangedMap.has(label)) {
            this.onPropertyChangedMap.set(label, []);
        }
        let callbacks = <any[]>this.onPropertyChangedMap.get(label);
        callbacks.push(callback);
    }

}