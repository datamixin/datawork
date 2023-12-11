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
import Item from "webface/widgets/Item";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import TabFolder from "webface/widgets/TabFolder";

import Image from "webface/graphics/Image";

import * as functions from "webface/widgets/functions";

export default class TabItem extends Item {

    private folder: TabFolder;
    private pane: JQuery;
    private button: JQuery;
    private icon: JQuery;
    private textJQuery: JQuery;
    private menu: JQuery;
    private control: Control;
    private imageElement: JQuery = null;

    private first = true;

    constructor(folder: TabFolder, index?: number) {
        super(jQuery("<div>"));
        folder["addItem"](this, index);
        this.folder = folder;
    }

    protected setTabElements(pane: JQuery, button: JQuery, icon: JQuery, text: JQuery, menu?: JQuery): void {
        this.pane = pane;
        this.button = button;
        this.icon = icon;
        this.textJQuery = text;
        this.menu = menu;
    }

    protected getTabPaneElement(): JQuery {
        return this.pane;
    }

    protected getTabButtonElement(): JQuery {
        return this.button;
    }

    public setImage(image: Image): void {
        this.image = image;
        this.imageElement = functions.appendImage(this.icon, image);
    }

    public removeImage(): void {
        this.image = null;
        if (this.imageElement !== null) {
            this.imageElement.remove();
            this.imageElement = null;
        }
    }

    public getImageElement(): JQuery {
        return this.imageElement;
    }

    public setText(text: string): void {
        this.text = text;
        this.textJQuery.text(text);
    }

    public getIndex(): number {
        let items = this.folder.getItems();
        return items.indexOf(this);
    }

    public setControl(control: Control): void {

        this.pane.empty();

        let element = control.getElement();
        element.css("position", "absolute");
        this.pane.append(element);

        this.control = control;

        // Atur ukuran control sebesar pane
        let width = this.pane.width();
        let height = this.pane.height();
        control.setSize(width, height);
    }

    public getControl(): Control {
        return this.control;
    }

    public setSelected(selected: boolean): void {

        if (selected) {

            this.pane.addClass("active");
            this.button.addClass("active");

            // Jika sebelumnya belum pernah visible, layout harus dijalankan.
            if (this.control instanceof Composite && this.first === true) {
                let composite = <Composite>this.control;
                composite.relayout();
                this.first = false;
            }

            // Tampilkan menu
            if (this.menu) {
                this.menu.children().show();
            }

        } else {

            this.pane.removeClass("active");
            this.button.removeClass("active");

            // Hide menu
            if (this.menu) {
                this.menu.children().hide();
            }
        }
    }
}

