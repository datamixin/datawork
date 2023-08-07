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

import BaseContentAdapter from "webface/wef/base/BaseContentAdapter";

import XCell from "padang/model/XCell";
import XPart from "padang/model/XPart";
import XOutlook from "padang/model/XOutlook";
import XViewset from "padang/model/XViewset";

import OutlookOutlineView from "padang/view/outline/OutlookOutlineView";

import ForeseeOutlineController from "padang/controller/outline/ForeseeOutlineController";

export default class OutlookOutlineController extends ForeseeOutlineController {

	private adapter = new MutationContentAdapter(this);

	public createView(): OutlookOutlineView {
		return new OutlookOutlineView(this);
	}

	public getModel(): XOutlook {
		return <XOutlook>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshIcon();
	}

	public refreshIcon(): void {
		let model = this.getModel();
		let viewset = model.getViewset();
		let part: XPart = viewset.getMixture();
		if (part instanceof XCell) {
			part = part.getFacet();
		}
		let eClass = part.eClass();
		let className = eClass.getNameWithoutPackage();
		super.setIcon(className);
	}

	public getCustomAdapters(): BaseContentAdapter[] {
		return [this.adapter];
	}

}

class MutationContentAdapter extends BaseContentAdapter {

	public notifyChanged(notification: Notification) {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XViewset.FEATURE_MIXTURE) {
				let controller = <OutlookOutlineController>this.controller;
				controller.refreshIcon();
			}
		}
	}

}

