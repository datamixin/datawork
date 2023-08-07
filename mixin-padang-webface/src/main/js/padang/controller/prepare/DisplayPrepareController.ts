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

import EObjectController from "webface/wef/base/EObjectController";

import XDisplay from "padang/model/XDisplay";

import ControllerProperties from "padang/util/ControllerProperties";

import DisplayPrepareView from "padang/view/prepare/DisplayPrepareView";

export abstract class DisplayPrepareController extends EObjectController {

	public getModel(): XDisplay {
		return <XDisplay>super.getModel();
	}

	public getView(): DisplayPrepareView {
		return <DisplayPrepareView>super.getView();
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

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XDisplay.FEATURE_PROPERTIES) {
			let eventType = notification.getEventType();
			if (eventType === Notification.SET) {
				let key = notification.getMapKey();
				let keys = ControllerProperties.createKeys(key);
				this.refreshProperty(keys);
			}
		}
	}

}

export default DisplayPrepareController;
