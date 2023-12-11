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

import * as bekasi from "bekasi/directors";

import XParameter from "rinjani/model/XParameter";
import XRoutine from "rinjani/model/XRoutine";

import ParameterListDesignView from "rinjani/view/design/ParameterListDesignView";

export default class ParameterListDesignController extends EListController {

	public createView(): ParameterListDesignView {
		return new ParameterListDesignView(this);
	}

	public getView(): ParameterListDesignView {
		return <ParameterListDesignView>super.getView();
	}

	public getModel(): EList<XParameter> {
		return <EList<XParameter>>super.getModel();
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
		if (feature === XRoutine.FEATURE_PARAMETERS) {
			this.refreshChildren();
			this.relayout();
		}
	}

}