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
import Image from "webface/graphics/Image";
import Widget from "webface/widgets/Widget";

export default class Item extends Widget {

    protected text: string = null;
    protected image: Image = null;

    constructor(element: JQuery) {
        super(element);
    }

    public getText() {
        return this.text;
    }

    public getImage() {
        return this.image;
    }

}
