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
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";

import TopLevelFacetSpecOutputView from "vegazoo/view/output/TopLevelFacetSpecOutputView";

import TopLevelSpecOutputController from "vegazoo/controller/output/TopLevelSpecOutputController";

export default class TopLevelFacetSpecOutputController extends TopLevelSpecOutputController {

	public createView(): TopLevelFacetSpecOutputView {
		return new TopLevelFacetSpecOutputView(this);
	}

	public getView(): TopLevelFacetSpecOutputView {
		return <TopLevelFacetSpecOutputView>super.getView();
	}

	public getModel(): XTopLevelFacetSpec {
		return <XTopLevelFacetSpec>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

}
