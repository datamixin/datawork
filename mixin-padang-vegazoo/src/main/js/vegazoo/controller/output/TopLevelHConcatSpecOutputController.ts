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
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";

import TopLevelHConcatSpecOutputView from "vegazoo/view/output/TopLevelHConcatSpecOutputView";

import TopLevelSpecOutputController from "vegazoo/controller/output/TopLevelSpecOutputController";

export default class TopLevelHConcatSpecOutputController extends TopLevelSpecOutputController {

	public createView(): TopLevelHConcatSpecOutputView {
		return new TopLevelHConcatSpecOutputView(this);
	}

	public getView(): TopLevelHConcatSpecOutputView {
		return <TopLevelHConcatSpecOutputView>super.getView();
	}

	public getModel(): XTopLevelHConcatSpec {
		return <XTopLevelHConcatSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let concat = model.getHconcat();
		return concat.toArray();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

}
