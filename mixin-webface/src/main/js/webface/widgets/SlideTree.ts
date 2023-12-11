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
import Event from "webface/widgets/Event";
import SlideItem from "webface/widgets/SlideItem";
import Composite from "webface/widgets/Composite";
import TabFolderStyle from "webface/widgets/TabFolderStyle";

export default class SlideTree extends Composite {

    public static TITLE_HEIGHT = 30;

    private items: SlideItem[] = [];
    private header: JQuery;
    private back: JQuery;
    private backIcon: JQuery;
    private backLabel: JQuery;
    private title: JQuery;
    private content: JQuery;
    private stack: SlideItem[] = [];

    public constructor(parent: Composite, style?: TabFolderStyle, index?: number) {

        super(parent, index);

        this.element.addClass("widgets-slide-tree");
        this.element.css("overflow", "hidden");

        this.createHeader();
        this.createBack();
        this.createBackIcon();
        this.createBackLabel();
        this.createTitle();
        this.createContent();

    }

    private createHeader(): void {
        this.header = jQuery("<div>");
        this.header.addClass("slide-header");
        this.header.css("height", SlideTree.TITLE_HEIGHT + "px");
        this.header.css("border-bottom", "1px solid #E4E4E4");
        this.element.append(this.header);
    }

    private createBack(): void {
        this.back = jQuery("<div>");
        this.back.addClass("slide-backlink");
        this.back.css("position", "absolute");
        this.back.css("width", "35%");
        this.back.on("click", () => {
            this.setSelectionBack();
        });
        this.back.hide();
        this.header.append(this.back);
    }

    private createBackIcon(): void {
        this.backIcon = jQuery("<div>");
        this.backIcon.addClass("slide-backlink-icon");
        this.backIcon.css("line-height", SlideTree.TITLE_HEIGHT + "px");
        this.backIcon.css("float", "left");
        this.backIcon.addClass("mdi");
        this.backIcon.addClass("mdi-chevron-left");
        this.back.append(this.backIcon);
    }

    private createBackLabel(): void {
        this.backLabel = jQuery("<div>");
        this.backLabel.addClass("slide-backlink-label");
        this.backLabel.css("float", "left");
        this.backLabel.css("line-height", SlideTree.TITLE_HEIGHT + "px");
        this.back.append(this.backLabel);
    }

    private createTitle(): void {
        this.title = jQuery("<div>");
        this.title.addClass("slide-title");
        this.title.css("position", "absolute");
        this.title.css("left", "35%");
        this.title.css("width", "30%");
        this.title.css("text-align", "center");
        this.title.css("line-height", SlideTree.TITLE_HEIGHT + "px");
        this.header.append(this.title);
    }

    private createContent(): void {
        this.content = jQuery("<div>");
        this.content.addClass("slide-content");
        this.element.append(this.content);
    }

    public setText(text: string): void {
        this.title.text(text);
    }

    public addItem(item: SlideItem) {

        this.items.push(item);

        // Pane penampung control
        let pane = jQuery("<div>");
        pane.addClass("slide-pane");
        pane.css("width", "inherit");
        pane.css("height", "inherit");
        pane.css("position", "absolute");
        pane.css("background-color", "#FFF");
        pane.css("z-index", "0");
        this.content.append(pane);

        item.setSlideElement(pane);
        if (this.items.length === 1) {
            this.setSelection(item, false);
        }
    }

    public setSize(width: number, height: number): void {
        super.setSize(width, height);
        this.doLayout(width, height);
    }

    private doLayout(width: number, height: number): void {
        let headerHeight = this.header.outerHeight();
        let controlWidth = width;
        let controlHeight = height - headerHeight;

        // Hanya apply jika bukan default
        if (controlWidth >= 0) {
            this.content.outerWidth(controlWidth);
        }
        if (controlHeight >= 0) {
            this.content.outerHeight(controlHeight);
        }

        // Apply ke semua item control
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let control = item.getControl();
            if (control !== undefined) {
                control.setSize(controlWidth, controlHeight);
            }
        }
    }

    public relayout(): void {
        let size = this.getElement();
        this.doLayout(size.width(), size.height());
    }

    public setSelection(item: SlideItem, animate: boolean = true) {

        // Atur back link
        if (this.stack.length > 0) {
            let index = this.stack.length - 1;
            this.setBackLink(index);
        }

        // Ke semua daftar item cari yang sama
        for (var i = 0; i < this.items.length; i++) {
            let current = this.items[i];

            // Lawatkan yang ada didalam stack
            for (var j = 0; j < this.stack.length; j++) {
                if (this.stack[j] === current) {
                    continue;
                }
            }

            // Jika ditemukan
            if (current === item) {

                // Tambahkan ke akhir stack
                this.stack.push(item);

                // z-index adalah sejumlah stack
                let element = item.getElement();
                element.css("z-index", this.stack.length);

                if (animate) {

                    // Lakukan animasi halaman datang dari kanan
                    element.css("left", this.element.width());
                    element.animate({
                        "left": 0
                    }, "easeOutCirc", () => {
                    })
                }

                // Atur title slide
                this.setText(item.getText());

                // Notifikasi listener
                this.notifyListeners(webface.Selection, new Event());

                break;
            }
        }

    }

    private setBackLink(index: number): void {
        this.back.show();
        let item = this.items[index];
        let text = item.getText();
        this.backLabel.text(text);
    }

    public setSelectionBack(animate: boolean = true): void {

        // Hanya jika ada stack
        if (this.stack.length > 0) {

            // Setting z-index paling 0 - belakang
            let last = this.stack.pop();
            let left = this.element.width();
            let element = last.getElement();

            // Lakukan animasi
            if (animate === true) {
                element.animate({
                    "left": left
                }, "easeOutCirc", () => {
                    element.css("z-index", 0);
                })
            } else {
                element.css({
                    "left": left,
                    "z-index": "0"
                });
            }

            // Update slide title
            let index = this.stack.length - 1;
            let current = this.stack[index];
            this.setText(current.getText());

            // Atur back link
            let back = index - 1;
            if (back >= 0) {
                this.setBackLink(back);
            } else {
                this.back.hide();
            }

            // Notify listener
            this.notifyListeners(webface.Selection, new Event());
        }
    }

    public getSelection(): SlideItem {
        return this.stack[this.stack.length - 1];
    }

    public getItems(): SlideItem[] {
        let items: SlideItem[] = [];
        for (var i = 0; i < this.items.length; i++) {
            items.push(this.items[i]);
        }
        return items;
    }

    public remove(item: SlideItem): void {

        // Hapus dari daftar items
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {

                // Hapus dari daftar item
                this.items.splice(i, 1);

                // Hapus element dari dom
                let element = item.getElement();
                element.remove();

                // Dispose control
                let control = item.getControl();
                control.dispose();
                break;
            }
        }

        // Hapus dari daftar stack
        for (var i = 0; i < this.stack.length; i++) {
            if (this.stack[i] === item) {
                this.stack.splice(i, 1);
                break;
            }
        }

        // Sesuaikan z-index sisa stack
        for (var j = i; j < this.stack.length; j++) {
            let item = this.stack[j];
            let element = item.getElement();
            element.css("z-index", j + 1);
        }

        // Jika stack kosong select yang pertama
        if (this.stack.length === 0) {
            if (this.items.length > 0) {
                this.setSelection(this.items[0], false);
            }
        }
    }

    public dispose(): void {
        super.dispose();
        this.items = null;
    }

}
