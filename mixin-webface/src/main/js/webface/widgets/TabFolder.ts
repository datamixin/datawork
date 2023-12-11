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

import Control from "webface/widgets/Control";
import TabItem from "webface/widgets/TabItem";
import Composite from "webface/widgets/Composite";
import TypedListener from "webface/widgets/TypedListener";
import TabFolderStyle from "webface/widgets/TabFolderStyle";
import SelectionListener from "webface/events/SelectionListener";

import FillLayout from "webface/layout/FillLayout";

export default class TabFolder extends Composite {

    public static PRESENT_SIMPLE = "simple";
    public static PRESENT_CLASSIC = "classic";

    public static BORDER = "1px solid #D8D8D8";

    public static NAVIGATION_LEFT_MARGIN = 12;
    public static NAVIGATION_RIGHT_MARGIN = 12;
    public static NAVIGATION_HEIGHT = 30;
    public static MENU_SIZE = 18;

    private items: TabItem[] = [];
    private content: JQuery;
    private navigation: JQuery;
    private buttonList: JQuery;
    private selection: number = 0;
    private style = <TabFolderStyle>{
        type: webface.TOP,
        align: webface.LEFT,
        side: webface.INSIDE,
        navigationLeftMargin: TabFolder.NAVIGATION_LEFT_MARGIN,
        navigationRightMargin: TabFolder.NAVIGATION_RIGHT_MARGIN,
    };

    public constructor(parent: Composite, style?: TabFolderStyle, index?: number) {

        super(parent, index);
        this.element.addClass("widgets-tab-folder");
        this.element.css("overflow", "hidden");

        // interupt onClick pada element
        this.element.unbind("click");

        jQuery.extend(this.style, style);
        let separator = TabFolder.NAVIGATION_HEIGHT;

        // Tab position
        if (this.style.type === webface.TOP) {

            this.element.addClass("tabs-top");

            // Content
            this.createContent();
            this.content.css("bottom", 0);
            this.content.css("top", separator);

            // Navigation
            this.createNavigation();
            this.navigation.css("height", separator);
            this.navigation.css("top", 0);

        } else if (this.style.type === webface.BOTTOM) {

            this.element.addClass("tabs-bottom");

            // Content
            this.createContent();
            this.content.css("top", 0);
            this.content.css("bottom", separator);

            // Navigation
            this.createNavigation();
            this.navigation.css("height", separator);
            this.navigation.css("bottom", 0);

        }

        // Align
        if (this.style.align === webface.LEFT) {
            this.navigation.css("left", this.style.navigationLeftMargin);
        } else {
            this.navigation.css("right", this.style.navigationRightMargin);
        }

    }

    private createContent(): void {
        this.content = jQuery("<div>");
        this.content.addClass("tab-content");
        this.content.css({
            "position": "absolute",
            "background-color": "#FFF",
            "width": "100%"
        });
        if (this.style.type === webface.TOP) {
            this.content.css("border-top", TabFolder.BORDER);
        } else if (this.style.type === webface.BOTTOM) {
            this.content.css("border-bottom", TabFolder.BORDER);
        }
        this.element.append(this.content);
    }

    private createNavigation(): void {

        this.navigation = jQuery("<div>");
        this.navigation.addClass("tab-navigation");
        this.navigation.css({
            "position": "absolute",
            "line-height": "18px"
        });
        this.element.append(this.navigation);

        // Button penampung daftar tombol
        this.buttonList = jQuery("<div>");
        this.buttonList.css("float", "left");
        this.buttonList.addClass("tab-buttonList");

        if (this.style.type === webface.TOP) {
            this.buttonList.css("margin-top", "1px");
        } else if (this.style.type === webface.BOTTOM) {
            this.buttonList.css("margin-top", "-1px");
        }

        this.navigation.append(this.buttonList);

        // Jika ada lastControl
        let lastControl = this.style.lastControl;
        if (lastControl) {
            let lastElement = jQuery("<div>");
            lastElement.css("float", "left");
            lastElement.css("position", "relative");
            if (this.style.type === webface.TOP) {
                lastElement.css("margin-top", "1px");
            } else if (this.style.type === webface.BOTTOM) {
                lastElement.css("margin-top", "-1px");
            }
            lastElement.width(TabFolder.NAVIGATION_HEIGHT);
            lastElement.height(TabFolder.NAVIGATION_HEIGHT);
            this.navigation.append(lastElement);
            let composite = new Composite(lastElement);
            composite.setLayout(new FillLayout());
            lastControl(composite);
            composite.relayout();
        }
    }

    protected addItem(item: TabItem, index: number) {

        // Index terakhir jika tidak di define
        if (index === undefined) {
            index = this.items.length;
        }

        // Tambahkan item terlebih dahulu
        this.items.splice(index, 0, item);

        // Pane penampung control
        let pane = item.getElement();
        pane.addClass("tab-pane");
        pane.css("position", "absolute");
        pane.css("width", "100%");
        pane.css("height", "100%");

        // Tambahkan ke pane ke content
        let child = this.content.children()[index];
        if (child === undefined) {
            this.content.append(pane);
        } else {
            pane.insertBefore(child);
        }

        // Button untuk navigation
        let button = jQuery("<div>");
        button.addClass("tab-button");
        button.css({
            "display": "inline-block",
            "padding-left": "12px",
            "padding-right": "12px"
        });
        button.addClass("widget-tabFolder-nav-button");

        // Present
        if (this.style.present === TabFolder.PRESENT_CLASSIC) {
            button.css("border", "1px solid transparent");
            button.css("background-color", "transparent");
            if (this.style.type === webface.TOP) {
                button.css("border-bottom", "none");
                button.css("padding-bottom", "1px");
            } else if (this.style.type === webface.BOTTOM) {
                button.css("border-top", "none");
                button.css("padding-top", "1px");
            }
        } else {
            if (this.style.type === webface.TOP) {
                button.css("border-bottom", "2px solid transparent");
            } else if (this.style.type === webface.BOTTOM) {
                button.css("border-top", "2px solid transparent");
            }
        }

        button.on("click", (eventObject: JQueryEventObject) => {

            // Setting selected semua items
            for (var i = 0; i < this.items.length; i++) {

                // Berikan status selected
                let current = this.items[i];
                let selected = current === item;
                current.setSelected(selected);
                this.setItemSelected(current, selected);
            }

            //Dapatkan index terbaru dari item yang diselect.
            let selectedIndex = item.getIndex();

            // Set selection untuk TabFolder berdasarkan index dari Item
            this.setSelection(selectedIndex);

            let event = this.createItemEvent(item);
            this.notifyListeners(webface.Selection, event);
        });

        // Tambahkan ke button list
        child = this.buttonList.children()[index];
        if (child === undefined) {
            this.buttonList.append(button);
        } else {
            button.insertBefore(child);
        }

        // Image menampung icon
        let icon = jQuery("<div>");
        icon.addClass("tab-button-icon");
        icon.css("display", "inline-block");
        icon.css("float", "left");
        icon.css("font-size", "18px");
        icon.css({
            "padding-top": "4px",
            "padding-bottom": "4px"
        });
        button.append(icon);

        // Text menampung text
        let text = jQuery("<div>");
        text.addClass("tab-button-text");
        text.css("display", "inline-block");
        text.css("float", "left");
        if (this.style.type === webface.TOP) {
            text.css({
                "padding-top": "6px",
                "padding-bottom": "4px"
            });
        } else if (this.style.type === webface.BOTTOM) {
            text.css({
                "padding-top": "4px",
                "padding-bottom": "6px"
            });
        }
        button.append(text);

        // Menu untuk kebutuhan menu di sebelah kanan text
        let menu: JQuery;
        let itemMenu = this.style.itemMenu;
        if (itemMenu !== undefined) {
            menu = jQuery("<div>");
            menu.css("display", "inline-block");
            menu.css("float", "left");
            if (this.style.type === webface.TOP) {
                menu.css({
                    "padding-top": "6px",
                    "padding-bottom": "4px"
                });
            } else if (this.style.type === webface.BOTTOM) {
                menu.css({
                    "padding-top": "4px",
                    "padding-bottom": "6px"
                });
            }
            menu.width(TabFolder.MENU_SIZE);
            menu.height(TabFolder.MENU_SIZE);
            menu.addClass("tab-button-menu");
            button.append(menu);
            button.css("padding-right", "6px");
            let composite = new Composite(menu);
            composite.setLayout(new FillLayout());
            itemMenu(composite, item);
            menu.children().hide();
        }

        // Setting elements ke item
        item["setTabElements"](pane, button, icon, text, menu);

        if (this.items.length === 1) {
            this.setSelection(0);
        }
    }

    protected sizeChanged(changed: boolean): void {
        if (changed) {
            this.relayout();
        }
    }

    private doLayout(width: number, height: number): void {

        let navHeight = this.navigation.outerHeight();

        if (height > navHeight) {

            let contentHeight = this.content.height();

            // Apply ke semua item control
            for (var i = 0; i < this.items.length; i++) {

                let item = this.items[i];
                let control = item.getControl();
                if (control !== undefined) {
                    control.setSize(width, contentHeight);
                }

                // Hanya untuk composite control yang sedang tampil 
                if (this.selection === i) {
                    if (control instanceof Composite) {
                        let composite = <Composite>control;
                        composite.relayout();
                    }
                }
            }
        }
    }

    public relayout(): void {
        let size = this.getElement();
        this.doLayout(size.width(), size.height());
    }

    public setSelection(itemIndex: number): void {
        this.items.forEach((item, index) => {
            item.setSelected(itemIndex === index);
            this.setItemSelected(item, itemIndex === index);
        });
        this.selection = itemIndex;
    }

    public getSelection(): number {
        return this.selection;
    }

    private setItemSelected(item: TabItem, selected: boolean): void {

        // Setting warna border untuk manandakan pilihan
        let button = item["getTabButtonElement"]();
        if (this.style.present === TabFolder.PRESENT_CLASSIC) {
            if (selected) {
                let border = "none";
                button.css("border", TabFolder.BORDER);
                button.css("background-color", "#FFF");
                if (this.style.type === webface.TOP) {
                    button.css("border-top-left-radius", "4px");
                    button.css("border-top-right-radius", "4px");
                    button.css("border-bottom", border);
                    button.css("padding-bottom", "1px");
                } else {
                    button.css("border-bottom-left-radius", "4px");
                    button.css("border-bottom-right-radius", "4px");
                    button.css("border-top", border);
                    button.css("padding-top", "1px");
                }
            } else {
                let border = "1px solid transparent";
                button.css("border", border);
                button.css("background-color", "transparent");
                if (this.style.type === webface.TOP) {
                    button.css("border-bottom", border);
                    button.css("padding-bottom", "0px");
                } else {
                    button.css("border-top", border);
                    button.css("padding-top", "0px");
                }
            }
        } else {
            if (selected) {
                let border = "2px solid #4caaff";
                if (this.style.type === webface.TOP) {
                    button.css("border-bottom", border);
                } else if (this.style.type === webface.BOTTOM) {
                    button.css("border-top", border);
                }
            } else {
                let border = "2px solid transparent";
                if (this.style.type === webface.TOP) {
                    button.css("border-bottom", border);
                } else if (this.style.type === webface.BOTTOM) {
                    button.css("border-top", border);
                }
            }
        }

    }

    public getChildren(): Control[] {
        let children: Control[] = [];
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let control = item.getControl();
            if (control) {
                children.push(control);
            }
        }
        return children;
    }

    public getItems(): TabItem[] {
        let items: TabItem[] = [];
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            items.push(item);
        }
        return items;
    }

    protected removeControl(control: Control) {
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let current = item.getControl();
            if (current === control) {

                this.items.splice(i, 1);

                // Remove content pane-nya
                let pane = item["getTabPaneElement"]();
                pane.remove();

                // Remove navigation button-nya
                let button = item["getTabButtonElement"]();
                button.remove();

                // Remove control dan element-nya
                super.removeControl(control);
                break;
            }
        }
    }

    public moveControl(control: Control, index: number): void {

        for (var i = 0; i < this.items.length; i++) {

            let item = this.items[i];
            let current = item.getControl();
            if (current === control) {

                if (i !== index) {

                    // Pindah item di daftar ke index tersebut
                    this.items.splice(i, 1);
                    this.items.splice(index, 0, item);

                    // Pindah content element-nya
                    let pane = item["getTabPaneElement"]();
                    let targetElement = this.content.children()[index];
                    if (targetElement !== undefined) {
                        pane.insertBefore(targetElement);
                    } else {
                        pane.appendTo(this.content);
                    }

                    // Pindah navigation element-nya
                    let button = item["getTabButtonElement"]();
                    targetElement = this.buttonList.children()[index];
                    if (targetElement !== undefined) {
                        button.insertBefore(targetElement);
                    } else {
                        button.appendTo(this.buttonList);
                    }

                    break;
                }
            }
        }
    }

    public addSelectionListener(listener: SelectionListener) {
        let typedListener = new TypedListener(listener);
        super.addListener(webface.Selection, typedListener);
    }

    public removeSelectionListener(listener: SelectionListener) {
        let typedListener = new TypedListener(listener);
        super.removeListener(webface.Selection, typedListener);
    }

    public dispose(): void {
        super.dispose();
        this.items = [];
    }

}

