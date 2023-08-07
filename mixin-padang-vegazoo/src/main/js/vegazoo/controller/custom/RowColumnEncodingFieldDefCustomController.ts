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

import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import RowColumnEncodingFieldDefCustomView from "vegazoo/view/custom/RowColumnEncodingFieldDefCustomView";

import FacetFieldDefCustomController from "vegazoo/controller/custom/FacetFieldDefCustomController";

export default class RowColumnEncodingFieldDefCustomController extends FacetFieldDefCustomController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): RowColumnEncodingFieldDefCustomView {
		return new RowColumnEncodingFieldDefCustomView(this);
	}

	public getView(): RowColumnEncodingFieldDefCustomView {
		return <RowColumnEncodingFieldDefCustomView>super.getView();
	}

	public getModel(): XRowColumnEncodingFieldDef {
		return <XRowColumnEncodingFieldDef>super.getModel();
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
