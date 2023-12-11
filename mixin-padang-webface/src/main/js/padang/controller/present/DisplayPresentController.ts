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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import XDisplay from "padang/model/XDisplay";

import * as directors from "padang/directors";

import Provision from "padang/provisions/Provision";

import ControllerProperties from "padang/util/ControllerProperties";

import DisplayPresentView from "padang/view/present/DisplayPresentView";

import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

export abstract class DisplayPresentController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(BufferedProvisionRequest.REQUEST_NAME, new DisplayProvisionHandler(this));
	}

	public getModel(): XDisplay {
		return <XDisplay>super.getModel();
	}

	public getView(): DisplayPresentView {
		return <DisplayPresentView>super.getView();
	}

	public activate(): void {
		super.activate();
		this.refreshContent();
	}

	public refreshContent(): void {
		let view = this.getView();
		view.refresh(() => {
			this.refreshProperties();
		});
	}

	protected abstract refreshProperties(): void;

	protected abstract refreshInspection(): void;

	protected abstract refreshProperty(keys: string[]): void;

	public getProperties(): ControllerProperties {
		let model = this.getModel();
		let properties = model.getProperties();
		return new ControllerProperties(this, properties);
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XDisplay.FEATURE_MUTATIONS) {
			let eventType = notification.getEventType();
			if (eventType === Notification.ADD
				|| eventType === Notification.SET
				|| eventType === Notification.REMOVE
				|| eventType === Notification.REMOVE_MANY) {
				this.refreshInspection();
			}
		} else if (feature === XDisplay.FEATURE_PROPERTIES) {
			let eventType = notification.getEventType();
			if (eventType === Notification.SET) {
				let key = notification.getMapKey();
				let keys = ControllerProperties.createKeys(key);
				this.refreshProperty(keys);
			} else if (eventType === Notification.REPLACE_MANY) {
				this.refreshProperties();
			}
		}
	}

}

export default DisplayPresentController;

class DisplayProvisionHandler extends BaseHandler {

	public handle(request: BufferedProvisionRequest, callback: (data: any) => void): void {

		let parent = this.controller.getParent();
		let active = parent.isActive();
		if (active === false) {
			return;
		}

		let provision = <Provision>request.getData(BufferedProvisionRequest.PROVISION);
		let director = directors.getProvisionResultDirector(this.controller);
		director.inspect(parent, provision, (result: any) => {
			callback(result);
		});
	}

}