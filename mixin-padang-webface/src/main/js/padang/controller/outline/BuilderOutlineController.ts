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

import * as model from "padang/model/model";
import XBuilder from "padang/model/XBuilder";

import BuilderOutlineView from "padang/view/outline/BuilderOutlineView";

import ForeseeOutlineController from "padang/controller/outline/ForeseeOutlineController";

export default class BuilderOutlineController extends ForeseeOutlineController {

	public createView(): BuilderOutlineView {
		return new BuilderOutlineView(this);
	}

	public getModel(): XBuilder {
		return <XBuilder>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshIcon();
	}

	private refreshIcon(): void {
		let eClass = model.createEClass(XBuilder.XCLASSNAME);
		let className = eClass.getNameWithoutPackage();
		super.setIcon(className);
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}
