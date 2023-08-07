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
import PartViewer from "webface/wef/PartViewer";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";

import * as bekasi from "bekasi/bekasi";

import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";

import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

import RunspaceHomeMenu from "padang/ui/RunspaceHomeMenu";

import ProjectAddAction from "padang/actions/ProjectAddAction";

import ProjectToolboxController from "padang/controller/toolbox/ProjectToolboxController";

export default class BlankProjectHomeMenu extends RunspaceHomeMenu {

	public static ICON = "mdi-file-chart-outline";

	constructor(viewer: PartViewer) {
		super(viewer);
	}

	public getLabel(): string {
		return "New Project";
	}

	public getIcon(): string {
		return BlankProjectHomeMenu.ICON;
	}

	public getDescription(): string {
		return "Create new blank project";
	}

	public run(_selector: ConsolePageSelector): void {
		this.getHomeList((viewer: PartViewer, list: RunspaceHomeList) => {
			let folderId = list.getId();
			let action = new ProjectAddAction(viewer, folderId);
			action.setOnOpen(() => {
				let viewer = super.getCurrentPartViewer();
				let children = viewer.getChildren();
				for (let child of children) {
					if (child instanceof BaseControllerViewer) {
						let controller = child.getRootController();
						let contents = controller.getContents();
						if (contents instanceof ProjectToolboxController) {
							this.postProjectOpen(contents);
						}
					}
				}
			});
			action.run();
		});
	}

	protected postProjectOpen(contents: ProjectToolboxController): void {

	}

}

let registry = HomeMenuFactory.getInstance();
registry.register(bekasi.CATEGORY_PROJECTS, <any>BlankProjectHomeMenu);
