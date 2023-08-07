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
import * as webface from "webface/webface";

import Layout from "webface/widgets/Layout";
import Composite from "webface/widgets/Composite";

import RowData from "webface/layout/RowData";

export default class RowLayout extends Layout {

    public type: string = webface.ROW;
    public spacing: number = 5;
    public alignment: string = webface.LEFT;
    public marginWidth: number = 5;
    public marginHeight: number = 5;

    constructor(type?: string,
        marginWidth?: number, marginHeight?: number,
        spacing?: number, alignment?: string) {
        super();
        if (type !== undefined) this.type = type;
        if (marginWidth !== undefined) this.marginWidth = marginWidth;
        if (marginHeight !== undefined) this.marginHeight = marginHeight;
        if (spacing !== undefined) this.spacing = spacing;
        if (alignment !== undefined) this.alignment = alignment;
    }

    public prepare(composite: Composite): void {
        let element = composite.getElement();
        element.addClass("layout-rowLayout");
    }

    public layout(composite: Composite): void {

        let horizontal = this.type === webface.ROW;
        let controls = composite.getChildren();
        let length = controls.length;
        let area = composite.getClientArea();
        let compositeWidth = area.x;
        let compositeHeight = area.y;
        let maxSize = 0;
        let rowStartIndex = 0;
        let rest = 0;
        let post = 0;
        let used = 0;

        let useMargin = () => {
            if (horizontal) {
                used += this.marginWidth;
            } else {
                used += this.marginHeight;
            }
            post = used;
        };

        let newRow = (index: number) => {
            rest += maxSize + this.spacing;
            used = 0;
            maxSize = 0;
            useMargin();
            post = used;
            rowStartIndex = index;
        };

        let applyAlignment = (index: number) => {

            if (this.alignment === webface.RIGHT) {
                if (this.type === webface.ROW) {
                    let spare = compositeWidth - used;
                    for (let i = rowStartIndex; i <= index; i++) {
                        let control = controls[i];
                        let element = control.getElement();
                        let left = parseInt(element.css("left"));
                        element.css("left", left + spare);
                    }
                }
            }
        };

        /*
         * Sebelum proses pembagian space.
         */
        useMargin();
        if (horizontal) {
            rest = this.marginHeight;
        } else {
            rest = this.marginWidth;
        }

        /**
         * Lakukan proses pengaturan top dan right untuk semua controls.
         */
        controls.forEach((control, i) => {

            let data = <RowData>control.getLayoutData() || new RowData();
            let size = control.computeSize();
            let controlWidth = data.width;
            let controlHeight = data.height;

            /**
             * Apply width dan height terlebih dahulu ke control.
             */
            if (controlWidth !== webface.DEFAULT) {
                control.setSize(controlWidth, -1);
            } else {
                controlWidth = size.x;
            }
            if (controlHeight !== webface.DEFAULT) {
                control.setSize(-1, controlHeight);
            } else {
                controlHeight = size.y;
            }

            /**
             * Jika control ini sudah diluar batas maka buat row baru.
             */
            if (horizontal) {
                if (used + controlWidth + this.marginWidth > compositeWidth) {
                    applyAlignment(i);
                    newRow(i);
                }
            } else {
                if (used + controlHeight + this.marginHeight > compositeHeight) {
                    applyAlignment(i);
                    newRow(i);
                }
            }

            /**
             * Space diberikan ke control.
             */
            let element = control.getElement();
            element.css("position", "absolute");
            if (horizontal) {

                maxSize = Math.max(maxSize, controlHeight);
                element.css("top", rest);
                element.css("left", post);

                used += controlWidth;
                element.css("right", used);

            } else {

                maxSize = Math.max(maxSize, controlWidth);
                element.css("top", post);
                element.css("left", post);

            }

            /**
             * Space antar control.
             */
            if (i < length - 1) {
                used += this.spacing;
            }
            post = used;

            if (i === controls.length - 1) {
                applyAlignment(i);
            }
        });
    }
}

