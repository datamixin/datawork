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
export default class Selection {

    private elements: any[] = null;

    constructor(elements: any | any[]) {
        if (elements instanceof Array) {
            this.elements = <any[]>elements;
        } else {
            this.elements = [elements];
        }
    }

    public isEmpty(): boolean {
        return this.elements === null ? true : this.elements.length === 0;
    }

    public size(): number {
        return this.elements === null ? 0 : this.elements.length;
    }

    public getFirstElement(): any {
        return this.elements === null ? null : this.elements[0];
    }

    public toArray(): any[] {
        let elements: any[] = [];
        for (var i = 0; i < (this.elements === null ? 0 : this.elements.length); i++) {
            elements.push(this.elements[i]);
        }
        return elements;
    }

}
