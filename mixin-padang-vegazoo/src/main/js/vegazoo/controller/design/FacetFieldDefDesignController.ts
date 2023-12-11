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

import VegazooFactory from "vegazoo/model/VegazooFactory";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";

import FacetFieldDefDesignView from "vegazoo/view/design/FacetFieldDefDesignView";

import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";

export default class FacetFieldDefDesignController extends FieldDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): FacetFieldDefDesignView {
		return new FacetFieldDefDesignView(this);
	}

	public getView(): FacetFieldDefDesignView {
		return <FacetFieldDefDesignView>super.getView();
	}

	public getModel(): XFacetFieldDef {
		return <XFacetFieldDef>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public createFieldDef(): XFacetFieldDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createFacetFieldDef();
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}

