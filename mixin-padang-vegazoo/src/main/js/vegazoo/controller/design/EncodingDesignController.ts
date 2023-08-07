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
import * as wef from "webface/wef";

import EReference from "webface/model/EReference";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import FeatureSetCommand from "webface/wef/base/FeatureSetCommand";

import * as bekasi from "bekasi/directors";

import XEncoding from "vegazoo/model/XEncoding";

import EncodingDesignView from "vegazoo/view/design/EncodingDesignView";

import ObjectDefDesignController from "vegazoo/controller/design/ObjectDefDesignController";

import EncodingChannelApplyRequest from "vegazoo/requests/design/EncodingChannelApplyRequest";

export default class EncodingDesignController extends ObjectDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(EncodingChannelApplyRequest.REQUEST_NAME, new EncodingChannelApplyHandler(this));
	}

	public createView(): EncodingDesignView {
		return new EncodingDesignView(this);
	}

	public getView(): EncodingDesignView {
		return <EncodingDesignView>super.getView();
	}

	public getModel(): XEncoding {
		return <XEncoding>super.getModel();
	}

	public getModelChildren(): any[] {
		return super.getNotNullReferences();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshUsableChannels();
		this.refreshAppliedChannels();
	}

	private refreshUsableChannels(): void {

		let model = this.getModel();
		let features = model.eFeatures();
		let names: string[] = [];
		for (let feature of features) {
			if (feature instanceof EReference) {
				let name = feature.getName();
				names.push(name);
			}
		}

		let view = this.getView();
		view.setUsableChannels(names);

	}

	private refreshAppliedChannels(): void {

		let model = this.getModel();
		let features = model.eFeatures();
		let names: string[] = [];
		for (let feature of features) {
			if (feature instanceof EReference) {
				let child = model.eGet(feature);
				if (child !== null) {
					let name = feature.getName();
					names.push(name);
				}
			}
		}
		let view = this.getView();
		view.setAppliedChannels(names);

		let brief = names.length + " of " + features.length + " channels";
		view.setChannelsBrief(brief);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {

		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {

			// Hanya response encoding reference	
			if (feature instanceof EReference) {

				this.refresh();
				this.relayout();

				// Select encoding yang baru di set
				let children = this.getChildren();
				let newValue = notification.getNewValue();
				for (let child of children) {
					if (newValue === child.getModel()) {
						let director = wef.getSelectionDirector(this);
						director.select(child);
						break;
					}
				}

			}
		}
	}

}

class EncodingChannelApplyHandler extends BaseHandler {

	public handle(request: EncodingChannelApplyRequest): void {

		let controller = <EncodingDesignController>this.controller;
		let channel = <string>request.getData(EncodingChannelApplyRequest.CHANNEL);
		let applied = <boolean>request.getData(EncodingChannelApplyRequest.APPLIED);

		let model = controller.getModel();
		let features = model.eFeatures();
		for (let feature of features) {
			if (feature.getName() === channel) {

				if (applied === true) {

					let reference = <EReference>feature;
					let encodingType: any = reference.getType();
					let encodingFeature = new encodingType();

					let command = new FeatureSetCommand();
					command.setModel(model);
					command.setFeature(feature);
					command.setValue(encodingFeature);
					controller.execute(command);

				} else {

					let value = model.eGet(feature);
					let command = new ReplaceCommand();
					command.setModel(value);
					command.setReplacement(null);
					controller.execute(command);
				}

				break;
			}
		}
	}

}


