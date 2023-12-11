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
import BaseHandler from "webface/wef/base/BaseHandler";

import Notification from "webface/model/Notification";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XMarkDef from "vegazoo/model/XMarkDef";

import MarkDefCustomView from "vegazoo/view/custom/MarkDefCustomView";

import MarkDefSizeSetCommand from "vegazoo/commands/MarkDefSizeSetCommand";
import MarkDefPointSetCommand from "vegazoo/commands/MarkDefPointSetCommand";
import MarkDefTicksSetCommand from "vegazoo/commands/MarkDefTicksSetCommand";
import MarkDefColorSetCommand from "vegazoo/commands/MarkDefColorSetCommand";
import MarkDefTooltipSetCommand from "vegazoo/commands/MarkDefTooltipSetCommand";
import MarkDefBaselineSetCommand from "vegazoo/commands/MarkDefBaselineSetCommand";
import MarkDefFontSizeSetCommand from "vegazoo/commands/MarkDefFontSizeSetCommand";

import MarkDefSizeSetRequest from "vegazoo/requests/custom/MarkDefSizeSetRequest";
import MarkDefColorSetRequest from "vegazoo/requests/custom/MarkDefColorSetRequest";
import MarkDefTicksSetRequest from "vegazoo/requests/custom/MarkDefTicksSetRequest";
import MarkDefPointSetRequest from "vegazoo/requests/custom/MarkDefPointSetRequest";
import MarkDefTooltipSetRequest from "vegazoo/requests/custom/MarkDefTooltipSetRequest";
import MarkDefBaselineSetRequest from "vegazoo/requests/custom/MarkDefBaselineSetRequest";
import MarkDefFontSizeSetRequest from "vegazoo/requests/custom/MarkDefFontSizeSetRequest";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

export default class MarkDefCustomController extends ObjectDefCustomController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(MarkDefSizeSetRequest.REQUEST_NAME, new MarkDefSizeSetHandler(this));
		super.installRequestHandler(MarkDefColorSetRequest.REQUEST_NAME, new MarkDefColorSetHandler(this));
		super.installRequestHandler(MarkDefPointSetRequest.REQUEST_NAME, new MarkDefPointSetHandler(this));
		super.installRequestHandler(MarkDefTicksSetRequest.REQUEST_NAME, new MarkDefTicksSetHandler(this));
		super.installRequestHandler(MarkDefTooltipSetRequest.REQUEST_NAME, new MarkDefTooltipSetHandler(this));
		super.installRequestHandler(MarkDefBaselineSetRequest.REQUEST_NAME, new MarkDefBaselineSetHandler(this));
		super.installRequestHandler(MarkDefFontSizeSetRequest.REQUEST_NAME, new MarkDefFontSizeSetHandler(this));
	}

	public createView(): MarkDefCustomView {
		return new MarkDefCustomView(this, true, "Custom Mark");
	}

	public getView(): MarkDefCustomView {
		return <MarkDefCustomView>super.getView();
	}

	public getModel(): XMarkDef {
		return <XMarkDef>super.getModel();
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
		this.refreshPoint();
		this.refreshTooltip();
		this.refreshBaseline();
		this.refreshFontSize();
		this.refreshColor();
		this.refreshSize();
	}

	public refreshPoint(): void {
		let model = this.getModel();
		let point = model.isPoint();
		let view = this.getView();
		view.setPoint(point);
	}

	public refreshTooltip(): void {
		let model = this.getModel();
		let tooltip = model.isTooltip();
		let view = this.getView();
		view.setTooltip(tooltip);
	}

	public refreshBaseline(): void {
		let model = this.getModel();
		let baseline = model.getBaseline();
		let view = this.getView();
		view.setBaseline(baseline);
	}

	public refreshFontSize(): void {
		let model = this.getModel();
		let fontSize = model.getFontSize();
		let view = this.getView();
		view.setFontSize(fontSize);
	}

	public refreshColor(): void {
		let model = this.getModel();
		let color = model.getColor();
		let view = this.getView();
		view.setColor(color);
	}

	public refreshSize(): void {
		let model = this.getModel();
		let size = model.getSize();
		let view = this.getView();
		view.setSize(size);
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {
			let feature = notification.getFeature();
			if (feature === XMarkDef.FEATURE_POINT) {
				this.refreshPoint();
			} else if (feature === XMarkDef.FEATURE_TOOLTIP) {
				this.refreshTooltip();
			} else if (feature === XMarkDef.FEATURE_BASELINE) {
				this.refreshBaseline();
			} else if (feature === XMarkDef.FEATURE_FONT_SIZE) {
				this.refreshFontSize();
			} else if (feature === XMarkDef.FEATURE_COLOR) {
				this.refreshColor();
			} else if (feature === XMarkDef.FEATURE_SIZE) {
				this.refreshSize();
			}
		}
	}

}

class MarkDefPointSetHandler extends BaseHandler {

	public handle(request: MarkDefPointSetRequest, _callback: (data: any) => void): void {
		let point = request.getData(MarkDefPointSetRequest.POINT);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefPointSetCommand();
		command.setMarkDef(model);
		command.setPoint(point);
		this.controller.execute(command);
	}

}

class MarkDefTooltipSetHandler extends BaseHandler {

	public handle(request: MarkDefTooltipSetRequest, _callback: (data: any) => void): void {
		let tooltip = request.getData(MarkDefTooltipSetRequest.TOOLTIP);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefTooltipSetCommand();
		command.setMarkDef(model);
		command.setTooltip(tooltip);
		this.controller.execute(command);
	}

}

class MarkDefBaselineSetHandler extends BaseHandler {

	public handle(request: MarkDefTooltipSetRequest, _callback: (data: any) => void): void {
		let baseline = request.getData(MarkDefBaselineSetRequest.BASELINE);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefBaselineSetCommand();
		command.setMarkDef(model);
		command.setBaseline(baseline);
		this.controller.execute(command);
	}

}

class MarkDefFontSizeSetHandler extends BaseHandler {

	public handle(request: MarkDefTooltipSetRequest, _callback: (data: any) => void): void {
		let fontSize = request.getData(MarkDefFontSizeSetRequest.FONT_SIZE);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefFontSizeSetCommand();
		command.setMarkDef(model);
		command.setFontSize(fontSize);
		this.controller.execute(command);
	}

}

class MarkDefColorSetHandler extends BaseHandler {

	public handle(request: MarkDefColorSetRequest, _callback: (data: any) => void): void {
		let color = request.getData(MarkDefColorSetRequest.COLOR);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefColorSetCommand();
		command.setMarkDef(model);
		command.setColor(color);
		this.controller.execute(command);
	}

}

class MarkDefSizeSetHandler extends BaseHandler {

	public handle(request: MarkDefSizeSetRequest, _callback: (data: any) => void): void {
		let size = request.getData(MarkDefSizeSetRequest.SIZE);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefSizeSetCommand();
		command.setMarkDef(model);
		command.setSize(size);
		this.controller.execute(command);
	}

}

class MarkDefTicksSetHandler extends BaseHandler {

	public handle(request: MarkDefTicksSetRequest, _callback: (data: any) => void): void {
		let ticks = request.getData(MarkDefTicksSetRequest.TICKS);
		let model = <XMarkDef>this.controller.getModel();
		let command = new MarkDefTicksSetCommand();
		command.setMarkDef(model);
		command.setTicks(ticks);
		this.controller.execute(command);
	}

}
