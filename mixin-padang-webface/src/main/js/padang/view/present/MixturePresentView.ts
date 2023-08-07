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

import * as webface from "webface/webface";

import Conductor from "webface/wef/Conductor";

import Event from "webface/widgets/Event";
import Listener from "webface/widgets/Listener";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import FillData from "webface/layout/FillData";
import FillLayout from "webface/layout/FillLayout";

import ConductorView from "webface/wef/ConductorView";

import DragParticipantPart from "webface/wef/DragParticipantPart";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as padang from "padang/padang";

import DropSpacePart from "padang/view/DropSpacePart";
import InsertDropSpaceGuide from "padang/view/InsertDropSpaceGuide";

import PartPresentView from "padang/view/present/PartPresentView";

import MixtureResizeRequest from "padang/requests/present/MixtureResizeRequest";
import MixtureCellDropObjectRequest from "padang/requests/present/MixtureCellDropObjectRequest";

export default class MixturePresentView extends PartPresentView implements DragParticipantPart, DropSpacePart {

	public static SPACING = 5;

	private composite: Composite = null;
	private resizeListener: ResizeListener = null;
	private dropSpaceGuide: InsertDropSpaceGuide = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-mixture-present-view");

		let layout = this.createContainerLayout(webface.HORIZONTAL);
		this.composite.setLayout(layout);

		this.resizeListener = new ResizeListener(this.conductor);
		this.composite.addListener(webface.ChildResize, this.resizeListener);

		this.createDropSpacePart(this.composite);
	}

	private createContainerLayout(type: string): FillLayout {
		let layout = new FillLayout(type, 0, 0, MixturePresentView.SPACING);
		layout.resizable = true;
		return layout;
	}

	private createDropSpacePart(parent: Composite): void {
		this.dropSpaceGuide = new InsertDropSpaceGuide(parent, this, 5);
		this.dropSpaceGuide.setBorderWitdh(0);
	}

	public setWeights(weights: number[]): void {

		let children = this.composite.getChildren();
		for (var i = 0; i < children.length; i++) {

			let fillData = new FillData();
			fillData.weight = weights[i];

			let child = children[i];
			child.setLayoutData(fillData);
		}
		this.composite.relayout();
	}

	public setLayout(type: string): void {
		let layout = this.createContainerLayout(type);
		this.resizeListener.setHorizontal(type === webface.HORIZONTAL);
		this.dropSpaceGuide.setHorizontal(type === webface.HORIZONTAL);
		this.composite.setLayout(layout);
		this.composite.relayout();
	}

	public adjustHeight(): number {

		let children = this.composite.getChildren();
		let layout = <FillLayout>this.composite.getLayout();
		let height = 0;
		for (let i = 0; i < children.length; i++) {

			let view = <HeightAdjustablePart>children[i].getData();
			let childHeight = view.adjustHeight();

			if (layout.type === webface.HORIZONTAL) {

				height = Math.max(height, childHeight);

			} else if (layout.type === webface.VERTICAL) {

				height += childHeight;
				if (i > 0) {
					height += layout.spacing;
				}

			}
		}
		height += layout.marginHeight * 2;
		this.composite.relayout();
		return height;
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
		let cell = data.get(padang.CELL);
		let sourcePosition = data.get(padang.SOURCE_POSITION);
		let targetPosition = data.get(padang.TARGET_POSITION);
		let request = new MixtureCellDropObjectRequest(cell, sourcePosition, targetPosition);
		this.conductor.submit(request, () => { });
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.composite, index);
		let control = child.getControl();
		control.setData(child);
	}

	public moveView(child: ConductorView, index: number): void {
		let control = child.getControl();
		this.composite.moveControl(control, index);
		this.composite.relayout();
	}

	public removeView(child: ConductorView): void {
		let control = child.getControl();
		control.dispose();
	}

}

class ResizeListener implements Listener {

	private conductor: Conductor;
	private horizontal: boolean = true;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

	public setHorizontal(horizontal: boolean): void {
		this.horizontal = horizontal;
	}

	public handleEvent(event: Event): void {

		// Dapatkan anakan
		let composite = <Composite>event.widget;
		let children = composite.getChildren();
		let newChildWidths: number[] = [];

		// Dapatkan bobot dalam pixels untuk semua anakan
		for (let i = 0; i < children.length; i++) {
			let child = <Composite>children[i];
			let point = child.computeSize();
			let weight = this.horizontal ? point.x : point.y;
			newChildWidths.push(weight);
		}

		let request = new MixtureResizeRequest(newChildWidths);
		this.conductor.submit(request);
	}

}
