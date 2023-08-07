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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

import Controller from "webface/wef/Controller";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import EObjectController from "webface/wef/base/EObjectController";

import XLayerSpec from "vegazoo/model/XLayerSpec";
import XNumberDef from "vegazoo/model/XNumberDef";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";
import VegaliteEvent from "vegazoo/widgets/VegaliteEvent";

import OverlayOutputView from "vegazoo/view/output/OverlayOutputView";

import OverlayWidthSetCommand from "vegazoo/commands/OverlayWidthSetCommand";
import OverlayHeightSetCommand from "vegazoo/commands/OverlayHeightSetCommand";

import OverlayRemoveRequest from "vegazoo/requests/output/OverlayRemoveRequest";
import OverlayWidthSetRequest from "vegazoo/requests/output/OverlayWidthSetRequest";
import OverlayHeightSetRequest from "vegazoo/requests/output/OverlayHeightSetRequest";
import OverlaySelectionRequest from "vegazoo/requests/output/OverlaySelectionRequest";

export abstract class OverlayOutputController extends EObjectController {

	public static MIN_WIDTH = 60;
	public static MIN_HEIGHT = 40;

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		super.installRequestHandler(OverlayRemoveRequest.REQUEST_NAME, new OverlayRemoveHandler(this));
		super.installRequestHandler(OverlayWidthSetRequest.REQUEST_NAME, new OverlayWidthSetHandler(this));
		super.installRequestHandler(OverlayHeightSetRequest.REQUEST_NAME, new OverlayHeightSetHandler(this));
		super.installRequestHandler(OverlaySelectionRequest.REQUEST_NAME, new OverlaySelectionHandler(this));

	}

	public getView(): OverlayOutputView {
		return <OverlayOutputView>super.getView();
	}

	public applyNode(node: VegaliteNode) {

		// Boundary lines
		let view = this.getView();
		let chart = node.getChart();
		let rect = node.getBoundingRect();
		let nodes = node.getChildren();
		view.applyBoundingRect(rect);
		view.createBoundaryLines(chart);

		// Refresh children untuk sync dengan chart
		this.refreshChildren();
		let children = this.getChildren();
		for (let i = 0; i < nodes.length; i++) {
			let controller = <OverlayOutputController>children[i];
			controller.applyNode(nodes[i]);
		}

		// Handler untuk leaf nodes dan yang punya width and height
		let hasWidth = false;
		let hasHeight = false;
		let model = this.getModel();
		let features = model.eFeatures();
		for (let feature of features) {
			if (feature.getName() === XLayerSpec.FEATURE_WIDTH.getName()) {
				hasWidth = true;
			}
			if (feature.getName() === XLayerSpec.FEATURE_HEIGHT.getName()) {
				hasHeight = true;
			}
		}
		if (nodes.length === 0 && hasWidth && hasHeight) {
			view.createResizeHandlers(chart);
		}

	}

	public getInRange(event: VegaliteEvent): Controller {
		let view = this.getView();
		let inRange = view.isInRange(event.data.x, event.data.y);
		if (inRange) {
			let children = this.getChildren();
			for (let i = 0; i < children.length; i++) {
				let controller = <OverlayOutputController>children[i];
				let inRange = controller.getInRange(event);
				if (inRange !== null) {
					return inRange;
				}
			}
			return this;
		} else {
			return null;
		}
	}

}

export default OverlayOutputController;

abstract class OverlayNumberSetHandler extends BaseHandler {

	protected adjustNumber(feature: EFeature, delta: number): XNumberDef {
		let controller = <EObjectController>this.controller;
		let model = controller.getModel();
		let value = <XNumberDef>model.eGet(feature);
		let copy = <XNumberDef>util.copy(value);
		let current = copy.getValue();
		copy.setValue(current + delta);
		return copy;
	}

}

class OverlayWidthSetHandler extends OverlayNumberSetHandler {

	public handle(request: OverlayWidthSetRequest, _callback: (spec: any) => void): void {
		let model = <EObject>this.controller.getModel();
		let delta = request.getNumberData(OverlayWidthSetRequest.DELTA);
		let width = this.adjustNumber(XLayerSpec.FEATURE_WIDTH, delta);
		let value = width.getValue();
		if (value > OverlayOutputController.MIN_WIDTH) {
			let command = new OverlayWidthSetCommand();
			command.setModel(model);
			command.setWidth(width);
			this.controller.execute(command);
		}
	}

}

class OverlayHeightSetHandler extends OverlayNumberSetHandler {

	public handle(request: OverlayHeightSetRequest, _callback: (spec: any) => void): void {
		let model = <EObject>this.controller.getModel();
		let delta = request.getNumberData(OverlayWidthSetRequest.DELTA);
		let height = this.adjustNumber(XLayerSpec.FEATURE_HEIGHT, delta);
		let value = height.getValue();
		if (value > OverlayOutputController.MIN_HEIGHT) {
			let command = new OverlayHeightSetCommand();
			command.setModel(model);
			command.setHeight(height);
			this.controller.execute(command);
		}
	}

}

class OverlayRemoveHandler extends BaseHandler {

	public handle(_request: OverlayRemoveRequest, _callback: (spec: any) => void): void {
		let controller = <OverlayOutputController>this.controller;
		let model = controller.getModel();
		let command = new RemoveCommand();
		command.setModel(model);
		controller.execute(command);
	}

}

class OverlaySelectionHandler extends BaseHandler {

	public handle(_request: OverlaySelectionRequest, _callback: (spec: any) => void): void {

	}

}
