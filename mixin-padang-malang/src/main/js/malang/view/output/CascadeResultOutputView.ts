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
import Map from "webface/util/Map";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Point from "webface/graphics/Point";

import * as webface from "webface/webface";

import ConductorView from "webface/wef/ConductorView";
import DragParticipantPart from "webface/wef/DragParticipantPart";

import FillData from "webface/layout/FillData";
import FillLayout from "webface/layout/FillLayout";

import * as padang from "padang/padang";

import * as view from "padang/view/view";

import DropSpacePart from "padang/view/DropSpacePart";
import InsertDropSpaceGuide from "padang/view/InsertDropSpaceGuide";

import * as malang from "malang/malang";

import ResultOutputView from "malang/view/output/ResultOutputView";

import CascadeInstantDropObjectRequest from "malang/requests/output/CascadeInstantDropObjectRequest";

export default class CascadeResultOutputView extends ResultOutputView
	implements DragParticipantPart, DropSpacePart {

	private composite: Composite = null;
	private container: Composite = null;
	private dropSpaceGuide: InsertDropSpaceGuide = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-cascade-result-output-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createContainer(this.composite);

	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "malang-cascade-result-output-container");
		view.setGridData(this.container, true, true);
		view.setFillLayoutHorizontal(this.container);
		this.createDropSpacePart(this.container);
	}

	private createDropSpacePart(parent: Composite): void {
		this.dropSpaceGuide = new InsertDropSpaceGuide(parent, this, 5);
		this.dropSpaceGuide.setBorderWitdh(0);
	}

	public setLayout(type: string): void {
		let layout = new FillLayout(type);
		this.container.setLayout(layout);
		if (this.editable === true) {
			this.dropSpaceGuide.setHorizontal(type === webface.HORIZONTAL);
		}
		this.container.relayout();
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

	public verifyAccept(_data: Map<any>, callback: (message: string) => void): void {
		callback(null);
	}

	public dropObject(data: Map<any>): void {
		let cell = data.get(malang.INSTANT_RESULT);
		let sourcePosition = data.get(padang.SOURCE_POSITION);
		let targetPosition = data.get(padang.TARGET_POSITION);
		let request = new CascadeInstantDropObjectRequest(cell, sourcePosition, targetPosition);
		this.conductor.submit(request, () => { });
	}

	public computeSize(): Point {
		let required = new Point();
		let layout = <FillLayout>this.container.getLayout();
		let children = this.container.getChildren();
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			let view = <ResultOutputView>child.getData();
			let layoutData = <FillData>child.getLayoutData();
			let size = view.computeSize();
			if (layout.type === webface.HORIZONTAL) {
				required.x += size.x + layout.spacing;
				required.y = Math.max(required.y, size.y);
				layoutData.pixels = size.x;
			} else {
				required.x = Math.max(required.x, size.x);
				required.y += size.y + layout.spacing;
				layoutData.pixels = size.y;
			}
			child.setLayoutData(layoutData);
		}
		this.container.relayout();
		return required;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		let layoutData = new FillData();
		view.setLayoutData(child, layoutData);
	}

	public moveView(child: ConductorView, index: number): void {
		let control = child.getControl();
		this.container.moveControl(control, index);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
