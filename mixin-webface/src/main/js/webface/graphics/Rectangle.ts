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
export default class Rectangle {

    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public contains(x: number, y: number): boolean {
        return (x >= this.x) && (y >= this.y) && x < (this.x + this.width) && y < (this.y + this.height);
    }

    public equals(object: any): boolean {
        if (object === this) return true;
        if (!(object instanceof Rectangle)) return false;
        let r = <Rectangle>object;
        return (r.x == this.x) && (r.y == this.y) && (r.width == this.width) && (r.height == this.height);
    }

}

