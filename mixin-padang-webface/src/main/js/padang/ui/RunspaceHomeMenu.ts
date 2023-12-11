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
import Director from "webface/wef/Director";
import PartViewer from "webface/wef/PartViewer";

import HomeMenu from "bekasi/ui/HomeMenu";

import * as directors from "bekasi/directors";

import RunspaceDirector from "bekasi/directors/RunspaceDirector";

import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

export abstract class RunspaceHomeMenu extends HomeMenu {

	protected viewer: PartViewer = null;

	constructor(viewer: PartViewer) {
		super();
		this.viewer = viewer;
	}

	private seekDirector(viewer: PartViewer, key: string): [PartViewer, Director] {
		let director = viewer.getDirector(key);
		if (director !== null) {
			return [viewer, director];
		} else {
			let children = viewer.getChildren();
			for (let child of children) {
				let director = this.seekDirector(child, key);
				if (director !== null) {
					return director;
				}
			}
			return null;
		}
	}

	protected getHomeList(callback: (viewer: PartViewer, list: RunspaceHomeList) => void): void {
		let pairs = this.seekDirector(this.viewer, directors.RUNSPACE_DIRECTOR);
		let viewer = pairs[0];
		let director = <RunspaceDirector>pairs[1];
		director.getHomeList((list: RunspaceHomeList) => {
			callback(viewer, list);
		});
	}

	protected getCurrentPartViewer(): PartViewer {
		let director = directors.getConsoleDirector(this.viewer);
		return director.getCurrentPartViewer();
	}

}

export default RunspaceHomeMenu;