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

import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontImage from "webface/graphics/WebFontImage";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class ButtonPanel {

    private composite: Composite = null;
    private button: Button = null;
    private text: string = null;
    private image: Image | string = null;
    private imageElement: JQuery = null;
    private classname: string = null;
    private lineHeight: number = null;
    private callback: () => void = () => { };

    constructor(text: string, image: Image | string, classname?: string, lineHeight?: number) {
        this.text = text;
        this.image = image;
        this.classname = classname;
        this.lineHeight = lineHeight;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("batam-button-panel");

        let layout = new GridLayout(2, 0, 0, 1, 0);
        this.composite.setLayout(layout);

        this.createButton(this.composite);
    }

    private createButton(parent: Composite): void {

        this.button = new Button(parent);
        this.button.setText(this.text);

        let element = this.button.getElement();
        if (this.lineHeight !== undefined) {
            element.css("line-height", this.lineHeight + "px");
        } else {
            element.css("line-height", "16px")
        }

        if (this.classname) {
            element.removeClass("btn-default");
            element.addClass(this.classname);
        } else {
            element.addClass("btn-primary");
        }

        this.updateImage();

        let layoutData = new GridData(true, true);
        this.button.setLayoutData(layoutData);

        this.button.onSelection(() => {
            this.callback();
        });
    }

    public setImage(image: Image | string): void {
        this.image = image;
        this.updateImage();
    }

    private updateImage(): void {
        let image = null;
        if (this.image instanceof Image) {
            image = <Image>this.image;
        } else if (this.image instanceof WebFontImage) {
            image = <WebFontImage>this.image;
        } else if (typeof (this.image) === 'string') {
            image = new WebFontImage("mdi", this.image);
        }
        if (this.imageElement !== null) {
            this.imageElement.remove();
        }
        if (image !== null) {
            this.imageElement = this.button.prependImage(image);
            this.imageElement.css("font-size", "24px");
        }
        this.composite.relayout();
    }

    public onSelection(callback: () => void): void {
        this.callback = callback;
    }

    public setText(text: string): void {
        this.button.setText(text);
    }

    public addClass(className: string): void {
        let element = this.button.getElement();
        element.addClass(className);
    }

    public removeClass(className: string): void {
        let element = this.button.getElement();
        element.removeClass(className);
    }

    public getControl(): Control {
        return this.composite;
    }

}
