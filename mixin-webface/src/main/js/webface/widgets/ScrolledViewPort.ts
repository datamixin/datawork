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
import Scrolled from "webface/widgets/Scrolled";

export default class ScrolledViewPort {

    private element: JQuery;
    private scrolled: Scrolled;

    constructor(scrolled: Scrolled) {

        this.element = jQuery("<div>");
        this.element.addClass("widgets-scrolled-viewPort");
        this.element.css("position", "absolute");
        this.element.css("overflow", "hidden");

        this.scrolled = scrolled;

        // Tambahkan viewport ini ke control element.
        let element = scrolled.getScrolledElement();
        element.append(this.element);

    }

    public getElement(): JQuery {
        return this.element;
    }

    public setWidth(width: number) {
        this.element.width(width);
        let content = this.scrolled.getScrolledContent();
        let contentLeft = content.getLeft();
        if (contentLeft < 0) {
            let contentWidth = content.getWidth();
            let right = contentLeft + contentWidth;
            let drift = right - width;
            if (drift < 0) {
                let left = contentLeft - drift;
                if (left < 0) {
                    content.setLeft(left);
                } else {
                    content.setLeft(0);
                }
            }
        }
    }

    public setHeight(height: number) {
        this.element.height(height);
        let content = this.scrolled.getScrolledContent();
        let contentTop = content.getTop();
        if (contentTop < 0) {
            let contentHeight = content.getHeight();
            let drift = contentTop + contentHeight - height;
            if (drift < 0) {
                let top = contentTop - drift;
                if (top < 0) {
                    content.setTop(contentTop - drift);
                } else {
                    content.setTop(0);
                }
            }
        }
    };
}
