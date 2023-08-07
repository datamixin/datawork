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

import XColorDef from "vegazoo/model/XColorDef";

import ColorDefCustomView from "vegazoo/view/custom/ColorDefCustomView";

import FieldDefCustomController from "vegazoo/controller/custom/FieldDefCustomController";

export default class ColorDefCustomController extends FieldDefCustomController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): ColorDefCustomView {
		return new ColorDefCustomView(this, true, "Custom Field");
	}

	public getView(): ColorDefCustomView {
		return <ColorDefCustomView>super.getView();
	}

	public getModel(): XColorDef {
		return <XColorDef>super.getModel();
	}

	public getModelChildren(): any[] {
		return super.getViceReferences();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}
