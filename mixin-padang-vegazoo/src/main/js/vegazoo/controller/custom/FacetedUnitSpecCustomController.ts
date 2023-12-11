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
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";

import FacetedUnitSpecCustomView from "vegazoo/view/custom/FacetedUnitSpecCustomView";

import UnitSpecCustomController from "vegazoo/controller/custom/UnitSpecCustomController";

export default class FacetedUnitSpecCustomController extends UnitSpecCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): FacetedUnitSpecCustomView {
		return new FacetedUnitSpecCustomView(this);
	}

	public getView(): FacetedUnitSpecCustomView {
		return <FacetedUnitSpecCustomView>super.getView();
	}

	public getModel(): XFacetedUnitSpec {
		return <XFacetedUnitSpec>super.getModel();
	}

}
