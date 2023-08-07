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

import VegazooFactory from "vegazoo/model/VegazooFactory";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";

import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";

import FacetEncodingFieldDefDesignView from "vegazoo/view/design/FacetEncodingFieldDefDesignView";

export default class FacetEncodingFieldDefDesignController extends FieldDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): FacetEncodingFieldDefDesignView {
		return new FacetEncodingFieldDefDesignView(this);
	}

	public getView(): FacetEncodingFieldDefDesignView {
		return <FacetEncodingFieldDefDesignView>super.getView();
	}

	public getModel(): XFacetEncodingFieldDef {
		return <XFacetEncodingFieldDef>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public createFieldDef(): XFacetEncodingFieldDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createFacetEncodingFieldDef();
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}

