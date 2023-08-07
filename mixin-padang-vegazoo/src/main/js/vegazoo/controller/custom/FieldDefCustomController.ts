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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import *  as vegazoo from "vegazoo/vegazoo";
import { AggregateOp } from "vegazoo/constants";

import XFieldDef from "vegazoo/model/XFieldDef";

import FieldDefCustomView from "vegazoo/view/custom/FieldDefCustomView";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

import FieldDefTitleSetCommand from "vegazoo/commands/FieldDefTitleSetCommand";
import FieldDefAggregateSetCommand from "vegazoo/commands/FieldDefAggregateSetCommand";

import FieldDefTitleSetRequest from "vegazoo/requests/custom/FieldDefTitleSetRequest";
import FieldDefAggregateSetRequest from "vegazoo/requests/custom/FieldDefAggregateSetRequest";

export default class FieldDefCustomController extends ObjectDefCustomController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FieldDefTitleSetRequest.REQUEST_NAME, new FieldDefTitleSetHandler(this));
		super.installRequestHandler(FieldDefAggregateSetRequest.REQUEST_NAME, new FieldDefAggregateSetHandler(this));
	}

	public createView(): FieldDefCustomView {
		let model = this.getModel();
		let capitalize = vegazoo.getCapitalizedContainingFeatureName(model);
		let text = "Custom " + capitalize + " Encoding";
		return new FieldDefCustomView(this, true, text);
	}

	public getView(): FieldDefCustomView {
		return <FieldDefCustomView>super.getView();
	}

	public getModel(): XFieldDef {
		return <XFieldDef>super.getModel();
	}

	public getModelChildren(): any[] {
		return super.getViceReferences();
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshTitle();
		this.refreshType();
		this.refreshAggregate();
	}

	private refreshTitle(): void {
		let model = this.getModel();
		let title = model.getTitle();
		let view = this.getView();
		view.setTitle(title);
	}

	private refreshType(): void {
		let model = this.getModel();
		let type = model.getType();
		let view = this.getView();
		view.setType(type);
		this.relayout();
	}

	private refreshAggregate(): void {
		let model = this.getModel();
		let aggregate = model.getAggregate();
		let view = this.getView();
		view.setAggregate(aggregate);
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {
			let feature = notification.getFeature();
			if (feature === XFieldDef.FEATURE_AGGREGATE) {
				this.refreshAggregate();
			} else if (feature === XFieldDef.FEATURE_TYPE) {
				this.refreshType();
			} else if (feature === XFieldDef.FEATURE_TITLE) {
				this.refreshTitle();
			}
		}
	}

}

class FieldDefAggregateSetHandler extends BaseHandler {

	public handle(request: FieldDefAggregateSetRequest): void {
		let controller = <FieldDefCustomController>this.controller;
		let channel = controller.getModel();
		let aggregate = request.getData(FieldDefAggregateSetRequest.AGGREGATE);
		aggregate = aggregate === AggregateOp.NONE ? null : aggregate;
		let command = new FieldDefAggregateSetCommand();
		command.setFieldDef(channel);
		command.setAggregate(aggregate);
		controller.execute(command);
	}

}

class FieldDefTitleSetHandler extends BaseHandler {

	public handle(request: FieldDefTitleSetRequest): void {
		let title = request.getData(FieldDefTitleSetRequest.TITLE);
		let command = new FieldDefTitleSetCommand();
		let controller = <FieldDefCustomController>this.controller;
		let scale = controller.getModel();
		command.setFieldDef(scale);
		command.setTitle(title === "" ? null : title);
		controller.execute(command);
	}

}
