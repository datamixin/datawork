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
import Control from "webface/widgets/Control";
import ToolItem from "webface/widgets/ToolItem";
import Composite from "webface/widgets/Composite";

export default class ToolBar extends Control {

    private items: ToolItem[] = [];

    constructor(parent: Composite) {
        super(jQuery("<div>"), parent);
        this.element.addClass("widgets-toolbar");
    }

    public addItem(item: ToolItem, index?: number) {
        let element = item.getElement();
        if (index >= 0) {
            this.items.splice(index, 0, item);
            let children = this.element.children();
            let targetElement = children[index];
            if (targetElement !== undefined) {
                element.insertBefore(targetElement);
            } else {
                element.appendTo(this.element);
            }
        } else {
            this.items.push(item);
            element.appendTo(this.element);
        }
    }

    public dispose(): void {
        super.dispose();
        this.items = null;
    }
}
