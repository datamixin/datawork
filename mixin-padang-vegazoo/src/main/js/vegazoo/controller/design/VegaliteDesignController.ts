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

import * as bekasi from "bekasi/directors";

import XVegalite from "vegazoo/model/XVegalite";

import VegaliteDesignView from "vegazoo/view/design/VegaliteDesignView";

import ViewletDesignController from "vegazoo/controller/design/ViewletDesignController";

export default class VegaliteDesignController extends ViewletDesignController {

	public createView(): VegaliteDesignView {
		return new VegaliteDesignView(this);
	}

	public getView(): VegaliteDesignView {
		return <VegaliteDesignView>super.getView();
	}

	public getModel(): XVegalite {
		return <XVegalite>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let spec = model.getSpec();
		return [spec];
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	protected relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
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
