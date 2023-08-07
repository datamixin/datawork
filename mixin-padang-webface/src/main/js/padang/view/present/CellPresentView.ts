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

import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";

import DragParticipantPart from "webface/wef/DragParticipantPart";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as padang from "padang/padang";

import * as view from "padang/view/view";
import DropSpacePart from "padang/view/DropSpacePart";

import CellGuidePanel from "padang/view/present/CellGuidePanel";
import PartPresentView from "padang/view/present/PartPresentView";
import FacetPresentView from "padang/view/present/FacetPresentView";
import PresentToolPanel from "padang/view/present/PresentToolPanel";
import CellDropSpaceGuide from "padang/view/present/CellDropSpaceGuide";

import CellRemoveRequest from "padang/requests/present/CellRemoveRequest";
import CellSelectionSetRequest from "padang/requests/present/CellSelectionSetRequest";
import CellCellDropVerifyRequest from "padang/requests/present/CellCellDropVerifyRequest";
import CellCellDropObjectRequest from "padang/requests/present/CellCellDropObjectRequest";

export default class CellPresentView extends PartPresentView implements DragParticipantPart, DropSpacePart {

	private static BORDER_WIDTH = 1;
	private static BORDER_COLOR = "#E8E8E8";
	private static CONTAINER_MARGIN = 7;

	private composite: Composite = null;
	private guidePanel: CellGuidePanel = null;
	private contentPart: Composite = null;
	private toolPanel: PresentToolPanel = null;
	private container: Composite = null;
	private dropSpaceGuide: CellDropSpaceGuide = null;

	constructor(conductor: Conductor) {
		super(conductor);
	}

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		view.addClass(this.composite, "padang-cell-present-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		let element = this.composite.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border", CellPresentView.BORDER_WIDTH + "px solid " + CellPresentView.BORDER_COLOR);

		this.createGuidePanel(this.composite);
		this.createContentPart(this.composite);
		this.createDropSpacePart(this.composite);

		this.composite.onSelection(() => {
			let request = new CellSelectionSetRequest();
			this.conductor.submit(request);
		});

	}

	private createGuidePanel(parent: Composite): void {
		this.guidePanel = new CellGuidePanel(this.conductor);
		this.guidePanel.createControl(parent);
		view.setGridData(this.guidePanel, true, 0);
	}

	public createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);

		let element = this.contentPart.getElement();
		element.addClass("padang-cell-present-content-part");

		view.setGridLayout(this.contentPart, 1, 0, 0, 0, 0);
		view.setGridData(this.contentPart, true, true);

		this.createToolPanel(this.contentPart);
		this.createContainer(this.contentPart);

	}

	private createToolPanel(parent: Composite): void {

		this.toolPanel = new PresentToolPanel(this.conductor);
		this.toolPanel.createControl(parent);

		let layoutData = new GridData(true, PresentToolPanel.HEIGHT);
		let control = this.toolPanel.getControl();
		control.setLayoutData(layoutData);

		let removeAction = new CellRemoveAction(this.conductor);
		this.toolPanel.addMenuItem(removeAction);
	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let element = this.container.getElement();
		element.addClass("padang-cell-present-container");
		element.css("background", "transparent");

		let layout = new GridLayout(1, CellPresentView.CONTAINER_MARGIN, 0);
		layout.marginBottom = CellPresentView.CONTAINER_MARGIN;
		this.container.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);
	}

	private createDropSpacePart(parent: Composite): void {
		this.dropSpaceGuide = new CellDropSpaceGuide(parent, this);
		this.dropSpaceGuide.setBorderWitdh(0);
	}

	public setShowGuide(show: boolean): void {
		view.grabVerticalExclusive(show === true ? this.guidePanel : this.contentPart);
		this.composite.relayout();
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
		let request = new CellCellDropVerifyRequest(data);
		this.conductor.submit(request, (message: string) => {
			callback(message);
		});
	}

	public dropObject(data: Map<any>): void {
		let cell = data.get(padang.CELL);
		let sourcePosition = data.get(padang.SOURCE_POSITION);
		let targetPosition = data.get(padang.TARGET_POSITION);
		let newPosition = data.get(padang.NEW_POSITION);
		let request = new CellCellDropObjectRequest(cell, sourcePosition, targetPosition, newPosition);
		this.conductor.submit(request, () => { });
	}

	public setSelected(selected: boolean): void {
		let element = this.composite.getElement();
		if (selected === true) {
			element.css("border", CellPresentView.BORDER_WIDTH + "px solid #80bdff");
		} else {
			element.css("border", CellPresentView.BORDER_WIDTH + "px solid " + CellPresentView.BORDER_COLOR);
		}
		this.toolPanel.setIconPartVisible(selected);
	}

	public adjustHeight(): number {

		let layout = <GridLayout>this.composite.getLayout();
		let height = layout.marginHeight * 2;
		height += CellPresentView.BORDER_WIDTH * 2;
		height += PresentToolPanel.HEIGHT;
		height += layout.verticalSpacing;

		let part = new GridCompositeAdjuster(this.container);
		height += part.adjustHeight();
		height += CellPresentView.CONTAINER_MARGIN; // Border container

		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: FacetPresentView, index: number): void {

		child.createControl(this.container, index);
		let control = child.getControl();
		control.setData(child);

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

		child.populateTools(this.toolPanel);

	}

	public removeView(child: FacetPresentView): void {

		let control = child.getControl();
		control.dispose();

		child.disposeTools(this.toolPanel);

	}

}

class CellRemoveAction extends BaseAction {

	public getText(): string {
		return "Remove Cell";
	}

	public getPriority(): number {
		return 100;
	}

	public run(): void {
		let request = new CellRemoveRequest();
		this.conductor.submit(request);
	}

}
