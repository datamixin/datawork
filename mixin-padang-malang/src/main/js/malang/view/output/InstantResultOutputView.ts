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
import ObjectMap from "webface/util/ObjectMap";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as webface from "webface/webface";

import Point from "webface/graphics/Point";

import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import DragParticipantPart from "webface/wef/DragParticipantPart";

import FillData from "webface/layout/FillData";

import BaseAction from "webface/wef/base/BaseAction";

import * as padang from "padang/padang";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import MenuPanel from "padang/view/MenuPanel";
import LabelPanel from "padang/view/LabelPanel";
import DropSpacePart from "padang/view/DropSpacePart";

import * as malang from "malang/malang";

import PreloadPanel from "malang/panels/PreloadPanel";

import ResultOutputView from "malang/view/output/ResultOutputView";
import InstantResultDropSpaceGuide from "malang/view/output/InstantResultDropSpaceGuide";
import InstantResultRemoveRequest from "malang/requests/output/InstantResultRemoveRequest";
import InstantResultDragAreaRequest from "malang/requests/output/InstantResultDragAreaRequest";
import InstantResultSelectionRequest from "malang/requests/output/InstantResultSelectionRequest";
import InstantInstantDropObjectRequest from "malang/requests/output/InstantInstantDropObjectRequest";
import InstantInstantDropVerifyRequest from "malang/requests/output/InstantInstantDropVerifyRequest";
import InstantResultDragSourceDragRequest from "malang/requests/output/InstantResultDragSourceDragRequest";
import InstantResultDragSourceStopRequest from "malang/requests/output/InstantResultDragSourceStopRequest";
import InstantResultDragSourceStartRequest from "malang/requests/output/InstantResultDragSourceStartRequest";

export default class InstantResultOutputView extends ResultOutputView
	implements DragParticipantPart, DropSpacePart {

	private static ICON_SIZE = 24;
	private static BORDER = 2;
	private static MIN_WIDTH = 300;
	private static MIN_HEIGHT = 60;

	private composite: Composite = null;
	private resultPart: Composite = null;
	private messagePanel: LabelPanel = null;
	private resultPanel: PreloadPanel = null;
	private dragPanel: IconPanel = null;
	private menuPanel: MenuPanel = null;
	private dropSpaceGuide: InstantResultDropSpaceGuide = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-instant-result-output-view");
		view.setGridLayout(this.composite);

		this.composite.onSelection(() => {
			this.select();
		});

		this.createResultPart(this.composite);
	}

	private select(): void {
		let request = new InstantResultSelectionRequest();
		this.conductor.submit(request);
	}

	private createResultPart(parent: Composite): void {
		this.resultPart = new Composite(parent);
		view.setGridData(this.resultPart, true, true);
		view.setAbsoluteLayout(this.resultPart);
		this.createMessagePanel(this.resultPart);
		if (this.editable === true) {
			this.createDragPanel(this.resultPart);
			this.createMenuPanel(this.resultPart);
			this.createDropSpacePart(this.resultPart);
		}
	}

	private createMessagePanel(parent: Composite): void {
		this.messagePanel = new LabelPanel();
		this.messagePanel.createControl(parent);
		this.messagePanel.setFontStyle("italic");
		this.messagePanel.setTextColor("#888");
		view.setAbsoluteData(this.messagePanel, 0, 0, "100%", "100%");
	}

	private createDragPanel(parent: Composite): void {
		this.dragPanel = new IconPanel();
		this.dragPanel.createControl(parent);
		this.dragPanel.setIcon("mdi-drag");
		view.css(this.dragPanel, "border-right", InstantResultOutputView.BORDER + "px solid transparent");
		view.css(this.dragPanel, "border-bottom", InstantResultOutputView.BORDER + "px solid transparent");
		view.css(this.dragPanel, "border-bottom-right-radius", "5px");
		view.css(this.dragPanel, "cursor", "move");
		view.setVisible(this.dragPanel, false);
		view.css(this.dragPanel, "line-height", "24px");
		let size = InstantResultOutputView.ICON_SIZE;
		view.setAbsoluteData(this.dragPanel, 0, 0, size, size);
		this.createDragSource(this.resultPart);
	}

	private createDragSource(target: Composite): void {

		// Request drag area
		let request = new InstantResultDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			let control = this.dragPanel.getControl();
			source.setHandle(control);

			let helper = new CloneDragHelper(control, {});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any, _ui: any) => {

				this.select();
				let request = new InstantResultDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				});

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new InstantResultDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((_event: any, _ui: any) => {

				let request = new InstantResultDragSourceStopRequest();
				this.conductor.submit(request);

			});

			source.applyTo(target);

		});

	}

	private createMenuPanel(parent: Composite): void {

		this.menuPanel = new MenuPanel();
		this.menuPanel.createControl(parent);
		this.menuPanel.setIcon("mdi-menu-down");
		view.css(this.menuPanel, "text-indent", -1);
		view.css(this.menuPanel, "border-left", InstantResultOutputView.BORDER + "px solid transparent");
		view.css(this.menuPanel, "border-bottom", InstantResultOutputView.BORDER + "px solid transparent");
		view.css(this.menuPanel, "border-bottom-left-radius", "5px");
		view.css(this.menuPanel, "line-height", "24px");
		view.setVisible(this.menuPanel, false);
		let size = InstantResultOutputView.ICON_SIZE;
		let layoutData = view.setAbsoluteData(this.menuPanel, -1, 0, size, size);
		layoutData.right = 0;

		this.menuPanel.setActions([
			new InstantResultRemoveAction(this.conductor)
		]);

	}


	private createDropSpacePart(parent: Composite): void {
		this.dropSpaceGuide = new InstantResultDropSpaceGuide(parent, this);
		this.dropSpaceGuide.setBorderWitdh(0);
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
		let request = new InstantInstantDropVerifyRequest(data);
		this.conductor.submit(request, (message: string) => {
			callback(message);
		});
	}

	public dropObject(data: Map<any>): void {
		let instant = data.get(malang.INSTANT_RESULT);
		let sourcePosition = data.get(padang.SOURCE_POSITION);
		let targetPosition = data.get(padang.TARGET_POSITION);
		let newPosition = data.get(padang.NEW_POSITION);
		let request = new InstantInstantDropObjectRequest(instant, sourcePosition, targetPosition, newPosition);
		this.conductor.submit(request, () => { });
	}

	public setSelected(selected: boolean): void {
		let border = selected ? "#81bfff" : "transparent";
		view.css(this.resultPanel, "border-color", border);
		if (this.editable === true) {
			view.css(this.dragPanel, "border-color", border);
			view.css(this.menuPanel, "border-color", border);
			view.setVisible(this.dragPanel, selected);
			view.setVisible(this.menuPanel, selected);
		}
	}

	public computeSize(): Point {
		let required = this.composite.computeSize();
		if (this.resultPanel === null) {
			required.x = InstantResultOutputView.MIN_WIDTH;
			required.y = InstantResultOutputView.MIN_HEIGHT;
		} else {
			required = this.resultPanel.getRequiredSize();
		}
		let space = InstantResultOutputView.BORDER * 2;
		required.x += space;
		required.y += space;
		return required;
	}

	private setShowMessage(state: boolean): void {
		let layoutData = view.getAbsoluteData(this.messagePanel);
		layoutData.height = state ? "100%" : 0;
	}

	public setMessage(message: string): void {
		this.messagePanel.setText(message);
		this.setShowMessage(true);
	}

	public setResult(panel: PreloadPanel, orientation: string): void {

		// Result panel
		this.messagePanel.setText("");
		view.dispose(this.resultPanel);
		panel.createControl(this.resultPart, 0);
		view.css(panel, "border", InstantResultOutputView.BORDER + "px solid transparent");
		view.css(panel, "border-radius", "5px");
		let size = panel.getRequiredSize();
		let space = InstantResultOutputView.BORDER * 2;
		view.setAbsoluteData(panel, 0, 0, size.x + space, size.y + space);
		this.resultPanel = panel;
		this.resultPart.relayout();

		// Modify layout
		let layoutData = new FillData();
		if (orientation === webface.HORIZONTAL) {
			view.setFillLayoutHorizontal(this.composite);
			layoutData.pixels = size.x + space;
		} else {
			view.setFillLayoutVertical(this.composite);
			layoutData.pixels = size.y + space;
		}
		view.setLayoutData(this.resultPart, layoutData);
		this.setShowMessage(false);
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class InstantResultRemoveAction extends BaseAction {

	public getText(): string {
		return "Remove";
	}

	public run(): void {
		let request = new InstantResultRemoveRequest();
		this.conductor.submit(request);
	}

}
