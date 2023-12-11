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
import * as webface from "webface/webface";

import Composite from "webface/widgets/Composite";

import PopupStyle from "webface/popup/PopupStyle";
import { registry } from "webface/popup/PopupRegistry";

import FillLayout from "webface/layout/FillLayout";

export abstract class Popup {

    public static MARGIN = 5;
    public static ARROW_HEIGHT = 5;
    private shell: JQuery;
    private arrow: JQuery = null;
    private container: JQuery;
    private composite: Composite;
    private contents: Composite;
    private callback: (result?: any) => void;
    protected style = <PopupStyle>{
        type: webface.DOWN,
        subpopup: false
    };

    constructor(style?: PopupStyle) {

        registry.register(this);

        if (style !== undefined) {
            this.style = style;
        } else {
            this.style.type = this.style.type ? this.style.type : webface.DOWN;
            this.style.subpopup = this.style.subpopup ? this.style.subpopup : false;
        }

        // Display penampung popup di body.
        let className = "webface-popup-display";
        let selector = "." + className;
        let display = jQuery(selector);

        if (display.length === 0) {

            // Buat popup dislay jika belum ada
            let body = jQuery("body");
            display = jQuery("<div>");
            display.addClass(className);
            body.append(display);

            // Pasang mouse down listener untuk close popup
            body.on("mousedown", () => {
                registry.closeOpens([]);
            });

            // Pasang mouse down listener untuk close popup
            body.on("dblclick", () => {
                registry.closeOpens([]);
            });

        }

        // Buat shell sebagai penampung arrow dan container
        this.shell = jQuery("<div>");
        this.shell.css({
            "position": "absolute",
            "display": "none",
            "z-index": "100"
        });

        let closeChilds = (event: JQueryEventObject) => {
            let target = event.target;
            let stack = registry.getOpenStack();
            let child = false;
            for (let open of stack) {
                if ($.contains(open.shell[0], target)) {
                    child = true;
                } else {
                    if (child === true) {
                        open.close();
                    }
                }
            }
            event.stopPropagation();
        };

        // Untuk cancel mousedown
        this.shell.on("mousedown", closeChilds);
        this.shell.on("dblclick", closeChilds);
        display.append(this.shell);

        // Popup container menampung isi popup.
        this.container = jQuery("<div>");
        this.container.css({
            "position": "absolute",
            "background-color": "#444"
        });
        this.shell.append(this.container);

        this.composite = new Composite(this.container);
        this.container.addClass("webface-popup-container");
        let fillLayout = new FillLayout(webface.HORIZONTAL, Popup.MARGIN, Popup.MARGIN);
        this.composite.setLayout(fillLayout);
    }

    protected createArrow(): void {

        if (this.arrow !== null) {
            this.arrow.remove();
        }

        // Popup arrow sebagai penunjuk owner
        this.arrow = jQuery("<div>");
        this.arrow.addClass("webface-popup-arrow");
        this.arrow.css({
            "position": "absolute",
            "width": "0",
            "height": "0",
            "border-color": "transparent",
            "border-style": "solid",
            "margin-left": "-" + Popup.ARROW_HEIGHT + "px"
        });

        if (this.style.type === webface.DOWN) {
            this.arrow.css({
                "top": "0",
                "border-bottom-color": "#444",
                "border-width": "0 " + Popup.ARROW_HEIGHT + "px " + Popup.ARROW_HEIGHT + "px",
            });
            this.shell.prepend(this.arrow);
        } else {
            this.arrow.css({
                "bottom": "0",
                "border-top-color": "#444",
                "border-width": Popup.ARROW_HEIGHT + "px " + Popup.ARROW_HEIGHT + "px 0",
            });
            this.shell.append(this.arrow);
        }

    }

    abstract createControl(parent: Composite): void;

    public setLocation(left: number, top: number): void {

        this.shell.css("left", left);

        // Atur posisi arrow container
        if (this.style.type === webface.DOWN) {
            this.shell.css("top", top);
        } else {
            this.shell.css("top", top - Popup.ARROW_HEIGHT);
        }
    }

    public setArrowLeft(left: number): void {
        this.arrow.css("left", left + "px");
    }

    public setSize(width: number, height: number) {

        this.shell.width(width);
        this.shell.height(height + Popup.ARROW_HEIGHT);

        this.composite.setSize(width, height);

        // Atur posisi arrow container
        if (this.style.type === webface.DOWN) {

            this.arrow.css("top", "0px");
            this.container.css("top", Popup.ARROW_HEIGHT + "px");

        } else if (this.style.type === webface.UP) {

            this.arrow.css("top", height + "px");
            this.container.css("top", "0");
        }

        // Update layout container
        this.contents.relayout();
        this.composite.relayout();
    }

    /**
     * Tampilkan popup dimana lokasi dan size di tentukan terpisah.
     */
    public open(callback?: (result?: any) => void) {

        this.callback = callback;

        // Siapkan content composite untuk menampung isi popup
        this.contents = new Composite(this.composite);
        let element = this.contents.getElement();
        element.addClass("webface-popup-contents");
        element.css("background-color", "#FFF");

        let layout = new FillLayout();
        this.contents.setLayout(layout);

        // Buat content.
        this.createControl(this.contents);

        this.shell.show();
        if (this.style.subpopup !== true) {
            registry.closeOpens([this]);
        }

    }

    public close(result?: any) {
        this.shell.hide();
        if (this.callback !== undefined) {
            this.callback(result);
        }
        this.dispose();
    }

    public dispose() {
        this.shell.remove();
        registry.remove(this);
    }

}

export default Popup;

