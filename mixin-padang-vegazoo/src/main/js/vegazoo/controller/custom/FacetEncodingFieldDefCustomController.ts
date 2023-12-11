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

import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";

import FacetEncodingFieldDefCustomView from "vegazoo/view/custom/FacetEncodingFieldDefCustomView";

import FacetFieldDefCustomController from "vegazoo/controller/custom/FacetFieldDefCustomController";

export default class FacetEncodingFieldDefCustomController extends FacetFieldDefCustomController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): FacetEncodingFieldDefCustomView {
		return new FacetEncodingFieldDefCustomView(this);
	}

	public getView(): FacetEncodingFieldDefCustomView {
		return <FacetEncodingFieldDefCustomView>super.getView();
	}

	public getModel(): XFacetEncodingFieldDef {
		return <XFacetEncodingFieldDef>super.getModel();
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
