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
import EList from "webface/model/EList";

import Notification from "webface/model/Notification";

import EListController from "webface/wef/base/EListController";

import * as bekasi from "bekasi/directors";

import XInput from "rinjani/model/XInput";
import XRoutine from "rinjani/model/XRoutine";

import InputListDesignView from "rinjani/view/design/InputListDesignView";

export default class InputListDesignController extends EListController {

	public createView(): InputListDesignView {
		return new InputListDesignView(this);
	}

	public getView(): InputListDesignView {
		return <InputListDesignView>super.getView();
	}

	public getModel(): EList<XInput> {
		return <EList<XInput>>super.getModel();
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
		let feature = notification.getFeature();
		if (feature === XRoutine.FEATURE_INPUTS) {
			this.refreshChildren();
			this.relayout();
		}
	}

}