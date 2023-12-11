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
import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import EListController from "webface/wef/base/EListController";

import PointerField from "padang/model/PointerField";

import PointerFieldListAnatomyView from "padang/view/anatomy/PointerFieldListAnatomyView";

export default class PointerFieldListAnatomyController extends EListController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): PointerFieldListAnatomyView {
		return new PointerFieldListAnatomyView(this);
	}

	public getModel(): EList<PointerField> {
		return <EList<PointerField>>super.getModel();
	}

	public getView(): PointerFieldListAnatomyView {
		return <PointerFieldListAnatomyView>super.getView();
	}

	protected isEquals(a: PointerField, b: PointerField) {
		let aName = a.getName();
		let bName = b.getName();
		let aType = a.getType();
		let bType = b.getType();
		return aName === bName && aType === bType;
	}

	public notifyChanged(notification: Notification): void {

		let feature = notification.getFeature();
		if (feature === PointerField.FEATURE_LIST) {

			let eventType = notification.getEventType();
			if (eventType === Notification.ADD ||
				eventType === Notification.ADD_MANY ||
				eventType === Notification.REMOVE ||
				eventType === Notification.REMOVE_MANY) {
				this.refreshChildren();
			}
		}

	}

}
