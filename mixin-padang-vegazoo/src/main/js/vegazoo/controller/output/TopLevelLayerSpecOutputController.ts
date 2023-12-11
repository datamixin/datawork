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
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import TopLevelLayerSpecOutputView from "vegazoo/view/output/TopLevelLayerSpecOutputView";

import TopLevelSpecOutputController from "vegazoo/controller/output/TopLevelSpecOutputController";

export default class TopLevelLayerSpecOutputController extends TopLevelSpecOutputController {

	public createView(): TopLevelLayerSpecOutputView {
		return new TopLevelLayerSpecOutputView(this);
	}

	public getView(): TopLevelLayerSpecOutputView {
		return <TopLevelLayerSpecOutputView>super.getView();
	}

	public getModel(): XTopLevelLayerSpec {
		return <XTopLevelLayerSpec>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

}
