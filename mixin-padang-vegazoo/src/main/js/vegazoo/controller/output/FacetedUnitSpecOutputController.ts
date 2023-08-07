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
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";

import FacetedUnitSpecOutputView from "vegazoo/view/output/FacetedUnitSpecOutputView";

import UnitSpecOutputController from "vegazoo/controller/output/UnitSpecOutputController";

export default class FacetedUnitSpecOutputController extends UnitSpecOutputController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): FacetedUnitSpecOutputView {
		return new FacetedUnitSpecOutputView(this);
	}

	public getView(): FacetedUnitSpecOutputView {
		return <FacetedUnitSpecOutputView>super.getView();
	}

	public getModel(): XFacetedUnitSpec {
		return <XFacetedUnitSpec>super.getModel();
	}

}
