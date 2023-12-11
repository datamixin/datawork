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
import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Widget from "webface/widgets/Widget";
import Composite from "webface/widgets/Composite";

import FillLayout from "webface/layout/FillLayout";
import FlexiblePopup from "webface/popup/FlexiblePopup";

export default class InfoPopup extends FlexiblePopup {

    public static WIDTH = 120;
    public static HEIGHT = 20;
    public static MARGIN = 5;
    private text: string;
    private element: JQuery;

    /**
     * Widget dimana info akan di tampilkan<br>
     * text adalah informasi string yang akan ditampilkan<br>
     * active optional fungsi apakan popup akan di tampilkan<br>
     */
    constructor(widget: Widget, text: string, active?: () => boolean) {

        super();
        this.text = text;

        // Jika function active() tidak ada maka default active() = true
        if (active === undefined) {
            active = (): boolean => {
                return true;
            };
        }

        // Pasang listener di hover untuk show hide
        let element = widget.getElement();
        let state = true;
        element.hover((eventObject: JQueryEventObject) => {
            if (active() === true) {
                setTimeout(() => {
                    if (active() === true && state === true) {
                        let event = new Event();
                        event.eventObject = eventObject;
                        event.widget = widget;
                        this.show(event, () => {
                            state = true;
                        });
                    }
                }, 500);
            }
        }, (eventObject: JQueryEventObject) => {
            state = false;
            if (active() === true) {
                setTimeout(() => {
                    this.close();
                }, 100);
            }
        });
        super();
    }

    public createControl(parent: Composite) {

        // Composite penampung info
        let composite = new Composite(parent);
        let layout = new FillLayout();
        layout.marginWidth = InfoPopup.MARGIN;
        layout.marginHeight = InfoPopup.MARGIN;
        composite.setLayout(layout);

        let label = new Label(composite);
        label.setText(this.text);

        this.element = label.getElement();
        this.element.css({
            "color": "#EFEFEF"
        });
    }

    public getWidth(): number {
        return InfoPopup.WIDTH + 2 * InfoPopup.MARGIN;
    }

    public getHeight(): number {
        return InfoPopup.HEIGHT + 2 * InfoPopup.MARGIN;
    }

    public getMargin(): number {
        return InfoPopup.MARGIN;
    }

}
