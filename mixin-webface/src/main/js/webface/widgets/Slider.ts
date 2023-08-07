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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

export default class Slider extends Control {

    private sliderTip: JQuery = null;

    private sliderHandle: JQuery = null;

    private sliderRange: JQuery = null;

    private slideState: boolean = false;

    private hover: boolean = false;

    private isShowTooltip: boolean = false;

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<div>"), parent, index);
        this.element.addClass("widgets-slider");
        this.element.css("height", "6px");
        this.element.css("border-color", webface.COLOR_SELECTED_MAIN);
        this.element.css("position", "absolute");
        this.element.css("margin-top", "1px");

        this.element.slider({ range: "min" });

        // Slider Range
        this.sliderRange = this.element.find(".ui-slider-range");
        this.sliderRange.css("background-color", webface.COLOR_SELECTED_MAIN);

        this.defineSliderHandle();
        this.createEvents();
    }

    private defineSliderHandle(): void {
        this.sliderHandle = this.element.find(".ui-slider-handle");
        this.sliderHandle.css("top", "-6px");
        this.sliderHandle.css("position", "absolute");
        this.sliderHandle.css("margin-left", "-8.5px");
        this.sliderHandle.css("margin-top", "0px");
        this.sliderHandle.css("background-color", webface.COLOR_EDITABLE);
        this.sliderHandle.css("border", "1px solid " + webface.COLOR_SELECTED_MAIN);
        this.sliderHandle.css("border-radius", "10px");
        this.sliderHandle.css("outline", "none");
        this.sliderHandle.css("width", "17px");
    }

    private createEvents(): void {

        // Slider Handle Hover
        this.sliderHandle.hover((event) => {

            this.hover = true;
            this.select();
        }, (event: JQueryEventObject) => {

            this.hover = false;
            if (!this.slideState) {
                this.deselect();
            }
        });

        this.sliderHandle.mousedown((event) => {
            this.select();
        });

        // Kirim event bila slider nilainya diubah
        this.element.on("slidechange", (event: JQueryEventObject, params: any) => {

            if (this.isEnabled()) {
                this.sendEvent(webface.SetData, event, params);
            }
        });

        // Kirim event bila slider digeser
        this.element.on("slide", (event: JQueryEventObject, params: any) => {

            let value = params.value;
            this.select(value);

            // Kirim event slide
            if (this.isEnabled()) {
                this.sendEvent(webface.Move, event, params);
            }
        });

        this.element.on("slidestart", (event: JQueryEventObject) => {
            this.slideState = true;
        });

        this.element.on("slidestop", (event: JQueryEventObject) => {

            this.slideState = false;

            // Bila cursor masih di slide-handle jangan deselect
            if (!this.hover) {
                this.deselect();
            }
        });
    }

    private createTooltip(): void {

        if (this.isShowTooltip) {

            // Tooltip
            this.sliderTip = jQuery("<div>");
            this.sliderTip.addClass("tooltip bottom slider-tip");
            this.sliderTip.css("opacity", "100");
            this.sliderTip.css("position", "absolute");

            // Tooltip Arrow
            let sliderArrow = jQuery("<div>");
            sliderArrow.addClass("tooltip-arrow");
            sliderArrow.css("border-bottom-color", webface.COLOR_SELECTED_MAIN);
            this.sliderTip.append(sliderArrow);

            // Display
            let className = "webface-slider-tooltip";
            let selector = "." + className;
            let display = jQuery(selector);
            if (display.length === 0) {

                // Buat div di body
                let body = jQuery("body");
                display = jQuery("<div>");
                display.addClass(className);
                body.append(display);
            }

            display.empty();
            display.append(this.sliderTip);
        }
    }

    private select(value?: any): void {
        this.sliderHandle.css("background-color", "#FFFFFF");

        this.createTooltip();
        if (this.sliderTip != null) {

            // Jika value null atau undefeine
            if (value === undefined || value === null) {
                value = this.getValue();
            }

            // Tooltip Inner
            let sliderTipInner = jQuery("<div>");
            sliderTipInner.addClass("tooltip-inner");
            sliderTipInner.css("border", "1px solid " + webface.COLOR_SELECTED_MAIN);
            sliderTipInner.css("background-color", "#FFF");
            sliderTipInner.css("color", "#444");
            sliderTipInner.text(value);

            this.sliderTip.append(sliderTipInner);

            // Posisikan slider tooltip
            let offset = this.element.offset();
            let tipHalf = this.sliderTip.outerWidth() / 2;
            let fullWidth = this.element.outerWidth() - 2;
            let width = ((value - this.getMin()) / (this.getMax() - this.getMin())) * fullWidth;
            let left = offset.left + width - tipHalf + 1;
            let top = offset.top + 10;

            this.sliderTip.css("left", left);
            this.sliderTip.css("top", top);

            this.sliderTip.show();
        }
    }

    private deselect(): void {

        this.sliderHandle.css("background-color", webface.COLOR_EDITABLE);
        if (this.sliderTip != null) {
            this.sliderTip.remove();
            this.sliderTip = null;
        }
    }

    public showTooltip(show: boolean): void {

        this.isShowTooltip = show;
    }

    public setValue(value: number): void {
        this.element.slider().slider("value", value);
    }

    public getValue(): number {
        let value = this.element.slider(webface.OPTION, "value");
        return value;
    }

    public setMax(max: number): void {
        this.element.slider(webface.OPTION, "max", max);
    }

    public getMax(): number {
        let max = this.element.slider(webface.OPTION, "max");
        return max;
    }

    public setMin(min: number): void {
        this.element.slider(webface.OPTION, "min", min);
    }

    public getMin(): number {
        let min = this.element.slider(webface.OPTION, "min");
        return min;
    }

    public setStep(step: number): void {
        this.element.slider(webface.OPTION, "step", step);
    }

    public getStep(): number {
        let step = this.element.slider(webface.OPTION, "step");
        return step;
    }

    // orientation = webface.HORIZONTAL / webface.VERTICAL 
    public setOrientation(orientation: string): void {
        this.element.slider(webface.OPTION, "orientation", orientation);
    }

    public getOrientation(): string {
        let orientation = this.element.slider(webface.OPTION, "orientation");
        return orientation;
    }

}
