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
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import TopLevelVConcatSpecOutputView from "vegazoo/view/output/TopLevelVConcatSpecOutputView";

import TopLevelSpecOutputController from "vegazoo/controller/output/TopLevelSpecOutputController";

export default class TopLevelVConcatSpecOutputController extends TopLevelSpecOutputController {

	public createView(): TopLevelVConcatSpecOutputView {
		return new TopLevelVConcatSpecOutputView(this);
	}

	public getView(): TopLevelVConcatSpecOutputView {
		return <TopLevelVConcatSpecOutputView>super.getView();
	}

	public getModel(): XTopLevelVConcatSpec {
		return <XTopLevelVConcatSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let concat = model.getVconcat();
		return concat.toArray();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

}
