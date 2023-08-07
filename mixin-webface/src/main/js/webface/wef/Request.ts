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
import ObjectMap from "webface/util/ObjectMap";

/**
 * Pembungkus user action yang dilakukan di view dimana nantinya akan di 
 * tangkap oleh controller untuk nantinya di handle sesuai dengan tipe request.
 */
export default class Request {

    private name: string = null;
    private map = new ObjectMap<any>();

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getKeys(): string[] {
        return this.map.keySet();
    }

    public getData(key: string): any {
        return this.map.get(key);
    }

    public getStringData(key: string): string {
        return <string>this.map.get(key);
    }

    public getNumberData(key: string): number {
        return <number>this.map.get(key);
    }

    public getBooleanData(key: string): boolean {
        return <boolean>this.map.get(key);
    }

    public setData(key: string, value: any): void {
        this.map.put(key, value);
    }

}
