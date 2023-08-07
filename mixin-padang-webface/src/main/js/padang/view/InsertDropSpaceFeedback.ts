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
export default class InsertDropSpaceFeedback {

    private element: JQuery = null;

    constructor(dropSpace: JQuery, horizontal: boolean, strokeWidth: number) {

        this.element = jQuery("<div>");
        this.element.addClass("padang-dnd-feedback");
        this.element.css("position", "absolute");
        this.element.css("background-color", "#888");

        // Buat feedback sebelum cover
        this.element.insertBefore(dropSpace);

        // Atur ukuran feedback
        if (horizontal === true) {

            let height = dropSpace.outerHeight();
            this.element.width(strokeWidth);
            this.element.height(height);

            let top = dropSpace.css("top");
            this.element.css("top", top);

        } else {

            let width = dropSpace.outerWidth();
            this.element.width(width);
            this.element.height(strokeWidth);

            let left = dropSpace.css("left");
            this.element.css("left", left);

        }

    }

    public remove(): void {
        this.element.remove();
    }

    public setTop(top: any): void {
        this.element.css("top", top);
    }

    public setLeft(left: any): void {
        this.element.css("left", left);
    }

}