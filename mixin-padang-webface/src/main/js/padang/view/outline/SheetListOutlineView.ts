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
import Map from "webface/util/Map";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";
import DragParticipantPart from "webface/wef/DragParticipantPart";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridLayout from "webface/layout/GridLayout";

import * as padang from "padang/padang";

import * as view from "padang/view/view";
import ElementPanel from "padang/view/ElementPanel";
import DropSpacePart from "padang/view/DropSpacePart";
import OnsideElementPanel from "padang/view/OnsideElementPanel";
import ScrollableListPanel from "padang/panels/ScrollableListPanel";
import InsertDropSpaceGuide from "padang/view/InsertDropSpaceGuide";

import * as outline from "padang/view/outline/outline";

import SheetListSheetDropObjectRequest from "padang/requests/outline/SheetListSheetDropObjectRequest";
import SheetListSheetDropVerifyRequest from "padang/requests/outline/SheetListSheetDropVerifyRequest";

export default class SheetListOutlineView extends ConductorView
    implements HeightAdjustablePart, DragParticipantPart, DropSpacePart {

    private static LABEL_HEIGHT = 32;

    private composite: Composite = null;
    private listPanel = new ScrollableListPanel(outline.SHEET_HEIGHT);
    private dropSpaceGuide: InsertDropSpaceGuide = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-sheet-list-outline-view");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createListPanel(this.composite);

    }

    private createListPanel(parent: Composite): void {

        this.listPanel.createControl(parent);
        view.addClass(this.listPanel, "padang-sheet-list-outline-container-panel");
        this.listPanel.setOnNewPanel((child: ConductorView): ElementPanel => {

            // Buat element panel untuk menampung view
            let panel = new OnsideElementPanel(child, outline.SHEET_HEIGHT);
            panel.setOnLabel((index: number) => {
                return index + 1;
            });
            return panel;
        });

        view.setGridData(this.listPanel, true, true);
        this.createDropSpacePart(this.listPanel);
    }

    private createDropSpacePart(panel: ScrollableListPanel): void {
        let parent = <Composite>this.listPanel.getListControl();
        this.dropSpaceGuide = new InsertDropSpaceGuide(parent, this, 5);
        this.dropSpaceGuide.setHorizontal(false);
        this.dropSpaceGuide.setAcceptBorderColor("transparent");
    }

    public adjustHeight(): number {
        let height = view.getGridLayoutHeight(this.composite, [SheetListOutlineView.LABEL_HEIGHT]);
        height += view.adjustGridDataHeight(this.listPanel);
        return height + 1;
    }

    public dragStart(accept: boolean): void {
        this.dropSpaceGuide.dragStart(accept);
    }

    public isInRange(x: number, y: number): boolean {
        return this.dropSpaceGuide.isInRange(x, y);
    }

    public showFeedback(data: Map<any>, x: number, y: number): void {
        return this.dropSpaceGuide.showFeedback(data, x, y);
    }

    public clearFeedback(data: Map<any>): void {
        this.dropSpaceGuide.clearFeedback(data);
    }

    public dragStop(): void {
        this.dropSpaceGuide.dragStop();
    }

    public verifyAccept(data: Map<any>, callback: (message: string) => void): void {
        let request = new SheetListSheetDropVerifyRequest(data);
        this.conductor.submit(request, callback);
    }

    public dropObject(data: Map<any>): void {
        let sourcePosition = data.get(padang.SOURCE_POSITION);
        let targetPosition = data.get(padang.TARGET_POSITION);
        let request = new SheetListSheetDropObjectRequest(sourcePosition, targetPosition);
        this.conductor.submit(request);
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {
        this.listPanel.addView(child, index);
    }

    public moveView(child: ConductorView, index: number): void {
        this.listPanel.moveView(child, index);
    }

    public removeView(child: ConductorView): void {
        this.listPanel.removeView(child);
    }

}
