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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import * as functions from "webface/functions";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ObjectMap from "webface/util/ObjectMap";

import ObjectDefDesignView from "vegazoo/view/design/ObjectDefDesignView";

import PositionDatumDefClearRequest from "vegazoo/requests/design/PositionDatumDefClearRequest";
import PositionDatumDefDragAreaRequest from "vegazoo/requests/design/PositionDatumDefDragAreaRequest";
import PositionDatumDefDragSourceDragRequest from "vegazoo/requests/design/PositionDatumDefDragSourceDragRequest";
import PositionDatumDefDragSourceStopRequest from "vegazoo/requests/design/PositionDatumDefDragSourceStopRequest";
import PositionDatumDefDragSourceStartRequest from "vegazoo/requests/design/PositionDatumDefDragSourceStartRequest";

export default class PositionDatumDefDesignView extends ObjectDefDesignView {

    private static HEIGHT = 24;
    private static ICON_WIDTH = 24;

    private composite: Composite = null;
    private typeIcon: WebFontIcon = null;
    private datumLabel: Label = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-position-value-def-design-view");

        let layout = new GridLayout(3, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createTypeIcon(this.composite);
        this.createDatumLabel(this.composite);
        this.createDragSource(this.composite);

    }

    private createTypeIcon(parent: Composite): void {
        this.typeIcon = this.createIcon(parent);
        this.typeIcon.addClass("mdi-vector-line");
    }

    private createDatumLabel(parent: Composite): void {

        this.datumLabel = new Label(parent);

        let element = this.datumLabel.getElement();
        element.css("line-height", PositionDatumDefDesignView.HEIGHT + "px");

        let layoutData = new GridData(true, true);
        this.datumLabel.setLayoutData(layoutData);
    }

    private createIcon(parent: Composite): WebFontIcon {

        let icon = new WebFontIcon(parent);
        icon.addClass("mdi");

        let element = icon.getElement();
        element.css("color", "#888");
        element.css("font-size", "18px");
        element.css("text-align", "center");
        element.css("line-height", PositionDatumDefDesignView.HEIGHT + "px");

        let layoutData = new GridData(PositionDatumDefDesignView.ICON_WIDTH, true);
        icon.setLayoutData(layoutData);

        return icon;
    }

    private createDragSource(control: Control): void {

        // Request drag area
        let request = new PositionDatumDefDragAreaRequest();
        this.conductor.submit(request, (dragArea: DragArea) => {

            let source = new DragSource();
            source.setHandle(this.datumLabel);

            let helper = new CloneDragHelper(this.composite, {});
            source.setHelper(helper);
            source.setContainment(dragArea);

            source.start((event: any, ui: any) => {

                let request = new PositionDatumDefDragSourceStartRequest();
                this.conductor.submit(request, (data: any) => {
                    dnd.reconcileDragData(event, data);
                })

            });

            source.drag((event: any) => {

                let x = event.clientX;
                let y = event.clientY;

                // Process drag
                let data = new ObjectMap<any>();
                let request = new PositionDatumDefDragSourceDragRequest(data, x, y);
                this.conductor.submit(request, (data: any) => {
                    dnd.reconcileDragData(event, data);
                })

            });

            source.stop((event: any, ui: any) => {

                let x = event.clientX;
                let y = event.clientY;
                let parent = this.composite.getParent();
                let element = parent.getElement();
                let request = new PositionDatumDefDragSourceStopRequest();
                this.conductor.submit(request);
                if (!functions.isInRange(element, x, y)) {
                    let request = new PositionDatumDefClearRequest();
                    this.conductor.submit(request);
                }

            });

            source.applyTo(this.composite);

        });

    }

    public setDatum(datum: string): void {
        this.datumLabel.setText(datum);
    }

    public adjustHeight(): number {
        return PositionDatumDefDesignView.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}
