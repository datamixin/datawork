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
import * as webface from "webface/webface";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import OverlayResizeStrip from "vegazoo/view/output/OverlayResizeStrip";

import ResultOutputView from "malang/view/output/ResultOutputView";

import InstantResultResizeRequest from "malang/requests/output/InstantResultResizeRequest";

export default class ModelerOutputView extends ConductorView {

	private static MARGIN = 10;
	private static MESSAGE_HEIGHT = 30;

	private composite: Composite = null;
	private messagePanel: LabelPanel = null;
	private scrollable: Scrollable = null;
	private container: Composite = null;
	private selectedControl: Control = null;
	private resizeStrip = new OverlayResizeStrip(1);

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-modeler-output-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createMessagePanel(this.composite);
		this.createScrollable(this.composite);

	}

	private createMessagePanel(parent: Composite): void {
		this.messagePanel = new LabelPanel(ModelerOutputView.MESSAGE_HEIGHT / 2);
		this.messagePanel.createControl(parent);
		this.messagePanel.setFontStyle("italic");
		this.messagePanel.setLineHeight(ModelerOutputView.MESSAGE_HEIGHT);
		view.css(this.messagePanel, "background-color", "#FFFCDA");
		view.setGridData(this.messagePanel, true, 0);
	}

	private createScrollable(parent: Composite): void {
		this.scrollable = new Scrollable(parent);
		view.setGridData(this.scrollable, true, true);
		this.createContainer(this.scrollable);
	}

	private createContainer(parent: Scrollable): void {
		this.container = new Composite(parent);
		parent.setContent(this.container);
		view.addClass(this.container, "malang-modeler-output-container");
		view.setAbsoluteLayout(this.container);
	}

	private setMessageShow(state: boolean): void {
		view.setGridData(this.messagePanel, true, state ? ModelerOutputView.MESSAGE_HEIGHT : 0);
		this.composite.relayout();
	}

	public setMessage(message: string): void {
		this.setMessageShow(true);
		this.messagePanel.setText(message);
	}

	public setSelectedControl(control: Control): void {

		this.resizeStrip.reset();
		let container = this.container.getElement();
		this.resizeStrip.setContainer(container);

		let view = <ResultOutputView>control.getData();
		let size = view.computeSize();
		let conductor = view.getConductor();
		this.resizeStrip.setWidthCallback((deltaX: number) => {
			let request = new InstantResultResizeRequest(size.x + deltaX, webface.HORIZONTAL);
			conductor.submit(request);
		});
		this.resizeStrip.setHeightCallback((deltaY: number) => {
			let request = new InstantResultResizeRequest(size.y + deltaY, webface.VERTICAL);
			conductor.submit(request);
		});

		let element = control.getElement();
		let offset = element.offset();
		let source = container[0].getBoundingClientRect();
		let target = new DOMRect(offset.left - source.x, offset.top - source.y, size.x, size.y);
		this.resizeStrip.createHandlers(target);

		this.selectedControl = control;

	}

	public relayout(): void {
		let children = this.container.getChildren();
		if (children.length === 1) {
			let child = <ResultOutputView>children[0].getData();
			let required = child.computeSize();
			let width = required.x + ModelerOutputView.MARGIN * 3;
			let height = required.y + ModelerOutputView.MARGIN * 3;
			this.scrollable.setMinSize(width, height);
			this.container.relayout();
			if (this.selectedControl !== null) {
				this.setSelectedControl(this.selectedControl);
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		let layoutData = view.setAbsoluteData(child, ModelerOutputView.MARGIN, ModelerOutputView.MARGIN);
		layoutData.right = ModelerOutputView.MARGIN - 2;
		layoutData.bottom = ModelerOutputView.MARGIN - 2;
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
