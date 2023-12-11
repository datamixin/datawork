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
import * as util from "webface/util/functions";

import ScrollBar from "webface/widgets/ScrollBar";
import Scrolled from "webface/widgets/Scrolled";
import ScrolledContent from "webface/widgets/ScrolledContent";
import ScrolledViewPort from "webface/widgets/ScrolledViewPort";

/**
 * Cara menggunakan scroll manager:
 * 1. Siapkan control implements Scrolled tempat scroll akan di tampilkan
 * 2. Ambil viewport element sebagai parent bagi element content
 * 3. Buat element yang akan di scroll dengan parent viewport element
 */
export default class ScrollManager {

    public static SCROLL_SPACE = 12;
    public static DEFAULT_ONE_STOP = 30;

    private scrollable: Scrolled;
    private oneStep = ScrollManager.DEFAULT_ONE_STOP;
    private viewPort: ScrolledViewPort;
    private verticalScroll: ScrollBar;
    private horizontalScroll: ScrollBar;

    constructor(scrollable: Scrolled) {

        this.scrollable = scrollable;

        // Satu kali scroll berapa pixel
        if (scrollable.getOneStep !== undefined) {
            this.oneStep = scrollable.getOneStep();
        }

        this.bindMouseWheel();

        // Manampung bagian yang akan di scroll.
        this.viewPort = new ScrolledViewPort(scrollable);

        // Vertical scroll bar
        let element = scrollable.getScrolledElement();
        this.verticalScroll = new ScrollBar(element, true, this.oneStep, {
            moved: (value: number, stop: boolean) => {
                let content = this.getScrolledContent();
                if (content.isEnabled() === true) {
                    content.setTop(-value);
                }
            }
        });

        // Horizontal scroll bar
        this.horizontalScroll = new ScrollBar(element, false, this.oneStep, {
            moved: (value: number, stop: boolean) => {
                let content = this.getScrolledContent();
                if (content.isEnabled() === true) {
                    content.setLeft(-value);
                }
            }
        });
    }

    public getVerticalScrollBar(): ScrollBar {
        return this.verticalScroll;
    }

    public getHorizontalScrollBar(): ScrollBar {
        return this.horizontalScroll;
    }

    private getControlElement(): JQuery {
        return this.scrollable.getScrolledElement();
    }

    private getScrolledContent(): ScrolledContent {
        return this.scrollable.getScrolledContent();
    }

    /**
     * Sesuaikan top ke vertical scroll.
     */
    private maintainVerticalScroll() {
        let content = this.getScrolledContent();
        let value = content.getTop();
        this.verticalScroll.setValue(-value);
    }

    /**
     * Sesuaikan left ke vertical scroll.
     */
    private maintainHorizontalScroll() {
        let content = this.getScrolledContent();
        let value = content.getLeft();
        this.horizontalScroll.setValue(-value);
    }

    /**
     * Response mouse-wheel event.
     */
    private bindMouseWheel(): void {

        let element = this.getControlElement();
        util.bindMouseWheel(element, (deltaX: number, deltaY: number): number => {

            let content = this.getScrolledContent();
            if (content.isEnabled() === false) {
                return 0;
            }

            let step = deltaY * this.oneStep;
            let visibleHeight = element.height();
            let space = ScrollManager.SCROLL_SPACE;

            let height = content.getHeight();
            let top = content.getTop();

            let delta = height - visibleHeight;
            let deltaTop = top + step;
            let deltaHeight = delta + top + step;
            if (this.horizontalScroll.isVisible()) {
                deltaHeight += space;
            }

            if (height < visibleHeight) {
                return 0;
            }

            if (deltaTop > 0) {
                step = -top;
            }

            if (deltaHeight < 0) {
                step -= deltaHeight;
            }

            content.setTop(top + step);
            this.maintainVerticalScroll();

            let newTop = content.getTop();
            return newTop - top;
        });
    }

    /**
     * Ambil view port yang akan digunakan untuk menampung content.
     */
    public getViewPort() {
        return this.viewPort;
    }

    public layout() {

        let space = ScrollManager.SCROLL_SPACE;
        let content = this.getScrolledContent();
        let element = this.getControlElement();
        let width = element.width();
        let height = element.height();

        if (width === 0 || height === 0) {
            return;
        }

        /**
         * Kalkulasi kebutuhan vertical scroll.
         */
        let availableHeight = height;
        let requiredHeight = content.getHeight();
        let showVertical = requiredHeight > availableHeight;

        /**
         * Kalkulasi kebutuhan horizontal scroll.
         */
        let availableWidth = width;
        let requiredWidth = content.getWidth();
        let showHorizontal = requiredWidth > availableWidth;

        if (showVertical) {
            width -= space;
            availableWidth -= space;
        }

        if (showHorizontal) {
            height -= space;
            availableHeight -= space;
        }

        if (!showVertical) {
            showVertical = requiredHeight > availableHeight;
            if (showVertical) {
                width -= space;
                availableWidth -= space;
            }
        }

        if (!showHorizontal) {
            showHorizontal = requiredWidth > availableWidth;
            if (showHorizontal) {
                height -= space;
                availableHeight -= space;
            }
        }

        this.viewPort.setWidth(width);
        this.viewPort.setHeight(height);

        /**
         * Atur height view port dan tampil/sembunyikan vertical scroll.
         */
        this.verticalScroll.setVisible(showVertical);
        if (showVertical) {

            /**
             * Semua parameter dalam pixels sehingga value dalam pixel.
             */
            this.verticalScroll.prepare(requiredHeight, availableHeight, space, height);
            this.maintainVerticalScroll();
        } else {
            this.verticalScroll.setAvailable(availableHeight);
        }

        /**
         * Atur width view port dan tampil/sembunyikan horizontal scroll.
         */
        this.horizontalScroll.setVisible(showHorizontal);
        if (showHorizontal) {

            /**
             * Semua parameter dalam pixels sehingga value dalam pixel.
             */
            this.horizontalScroll.prepare(requiredWidth, availableWidth, width, space);
            this.maintainHorizontalScroll();
        } else {
            this.horizontalScroll.setAvailable(availableWidth);
        }
    }

}

