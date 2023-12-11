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
import * as wef from "webface/wef";

import EObjectController from "webface/wef/base/EObjectController";

import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import OutlinePartViewer from "padang/ui/OutlinePartViewer";

import OutlinePartDirector from "padang/directors/OutlinePartDirector";

export default class BaseOutlinePartDirector implements OutlinePartDirector {

	private viewer: OutlinePartViewer = null;

	constructor(viewer: OutlinePartViewer) {
		this.viewer = viewer;
	}

	public setContents(model: any): void {
		this.viewer.setContents(model);
	}

	public onSelectionChanged(callback: (controller: EObjectController) => void): void {
		let listener = <SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				let controller = selection.getFirstElement();
				callback(controller);
				director.removeSelectionChangedListener(listener);
			}
		};
		let director = wef.getSelectionDirector(this.viewer);
		director.addSelectionChangedListener(listener);
	}

}