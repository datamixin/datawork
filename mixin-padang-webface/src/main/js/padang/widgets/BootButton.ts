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
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import WebFontImage from "webface/graphics/WebFontImage";

export default class BootButton extends Button {

    constructor(parent: Composite, text: string, imageClass: string, btnClass: string, index?: number) {
        super(parent, index);
        this.setText(text);
        this.prepareImage(imageClass);
        this.prepareElement(btnClass);
    }

    private prepareElement(btnClass: string): void {
        this.element.addClass(btnClass);
        this.element.css("line-height", "16px");
    }

    private prepareImage(imageClass: string): void {
        let image = new WebFontImage("mdi", imageClass);
        let element = this.prependImage(image);
        element.css("font-size", "24px");
    }

}