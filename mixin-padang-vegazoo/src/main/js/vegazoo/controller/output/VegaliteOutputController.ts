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
import * as wef from "webface/wef";

import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "vegazoo/directors";

import XVegalite from "vegazoo/model/XVegalite";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";
import VegaliteEvent from "vegazoo/widgets/VegaliteEvent";

import VegaliteOutputView from "vegazoo/view/output/VegaliteOutputView";

import ViewletOutputController from "vegazoo/controller/output/ViewletOutputController";
import OverlayOutputController from "vegazoo/controller/output/OverlayOutputController";

import VegaliteRootApplyRequest from "vegazoo/requests/output/VegaliteRootApplyRequest";
import VegaliteClickApplyRequest from "vegazoo/requests/output/VegaliteClickApplyRequest";

export default class VegaliteOutputController extends ViewletOutputController {

	private adapter = new VegaliteAdapter(this);

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VegaliteRootApplyRequest.REQUEST_NAME, new VegaliteRootApplyHandler(this));
		super.installRequestHandler(VegaliteClickApplyRequest.REQUEST_NAME, new VegaliteClickApplyHandler(this));
	}

	public createView(): VegaliteOutputView {
		return new VegaliteOutputView(this);
	}

	public getView(): VegaliteOutputView {
		return <VegaliteOutputView>super.getView();
	}

	public getModel(): XVegalite {
		return <XVegalite>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let spec = model.getSpec();
		return [spec];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshFigure();
	}

	private refreshFigure(): void {
		let vegalite = this.getModel();
		let director = directors.getOutputPartDirector(this);
		let spec = vegalite.getSpec();
		director.createSpec(spec, (jsonspec: any) => {
			let view = this.getView();
			view.setSpec(jsonspec);
			view.relayout();
		});
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XVegalite.FEATURE_SPEC) {
			if (eventType === Notification.SET) {
				this.refreshChildren();
			}
		}
	}

}

class VegaliteAdapter extends ContentAdapter {

	private controller: VegaliteOutputController = null;

	constructor(controller: VegaliteOutputController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		this.controller.refreshVisuals();
	}

}

class VegaliteRootApplyHandler extends BaseHandler {

	public handle(request: VegaliteRootApplyRequest, _callback: (spec: any) => void): void {
		let root = <VegaliteNode>request.getData(VegaliteRootApplyRequest.ROOT);
		let children = this.controller.getChildren();
		let controller = <OverlayOutputController>children[0];
		controller.applyNode(root);
		let director = wef.getSelectionDirector(this.controller);
		let selection = director.getSelection();
		if (selection.isEmpty() === false) {
			let controller = selection.getFirstElement();
			director.clear();
			director.select(controller);
		}
	}

}

class VegaliteClickApplyHandler extends BaseHandler {

	public handle(request: VegaliteClickApplyRequest, _callback: (spec: any) => void): void {
		let event = <VegaliteEvent>request.getData(VegaliteClickApplyRequest.EVENT);
		let children = this.controller.getChildren();
		let controller = <OverlayOutputController>children[0];
		let inRange = controller.getInRange(event);
		if (inRange !== null) {
			let director = wef.getSelectionDirector(this.controller);
			director.select(inRange);
		}
	}

}
