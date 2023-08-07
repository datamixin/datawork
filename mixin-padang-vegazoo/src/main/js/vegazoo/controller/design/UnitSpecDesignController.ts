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

import * as bekasi from "bekasi/directors";

import XUnitSpec from "vegazoo/model/XUnitSpec";

import UnitSpecDesignView from "vegazoo/view/design/UnitSpecDesignView";

import ViewSpecDesignController from "vegazoo/controller/design/ViewSpecDesignController";

export default class UnitSpecDesignController extends ViewSpecDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): UnitSpecDesignView {
		return new UnitSpecDesignView(this);
	}

	public getView(): UnitSpecDesignView {
		return <UnitSpecDesignView>super.getView();
	}

	public getModel(): XUnitSpec {
		return <XUnitSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let mark = model.getMark();
		let encoding = model.getEncoding();
		return [mark, encoding];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XUnitSpec.FEATURE_ENCODING) {
			if (eventType === Notification.SET) {
				this.refreshChildren();
			}
		}
	}

}
