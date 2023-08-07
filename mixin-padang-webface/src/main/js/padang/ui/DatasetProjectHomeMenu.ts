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

import * as functions from "webface/wef/functions";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";

import * as bekasi from "bekasi/bekasi";

import RunspaceHomeList from "bekasi/resources/RunspaceHomeList";

import XDataset from "padang/model/XDataset";
import XMutation from "padang/model/XMutation";
import PadangCreator from "padang/model/PadangCreator";

import RunspaceHomeMenu from "padang/ui/RunspaceHomeMenu";

import ProjectAddAction from "padang/actions/ProjectAddAction";

import SheetPresentController from "padang/controller/present/SheetPresentController";

import DatasetPreparationStarterComposeRequest from "padang/requests/DatasetPreparationStarterComposeRequest";

export abstract class DatasetProjectHomeMenu extends RunspaceHomeMenu {

	public static DATA_SOURCES = "Data Sources";

	constructor(viewer: PartViewer) {
		super(viewer);
	}

	public run(_selector: ConsolePageSelector): void {

		this.getHomeList((viewer: PartViewer, list: RunspaceHomeList) => {

			// Project
			this.createMutation((mutation: XMutation) => {

				let creator = PadangCreator.eINSTANCE;
				let project = creator.createProject();
				let sheets = project.getSheets();
				let sheet = sheets.get(0);
				let dataset = <XDataset>sheet.getForesee();
				let preparation = creator.createPreparation();
				dataset.setSource(preparation);
				let mutations = preparation.getMutations();
				mutations.add(mutation);

				// Add
				let folderId = list.getId();
				let action = new ProjectAddAction(viewer, folderId, project);
				action.setOnOpen(() => {
					let viewer = this.getCurrentPartViewer();
					let children = viewer.getChildren();
					for (let child of children) {
						if (child instanceof BaseControllerViewer) {
							let controller = child.getRootController();
							let contents = controller.getContents();
							if (contents instanceof SheetPresentController) {
								let dataset = functions.getFirstDescendantByModelClass(controller, XDataset);
								if (dataset !== null) {
									let request = new DatasetPreparationStarterComposeRequest();
									dataset.submit(request);
								}
							}
						}
					}
				});
				action.run();
			});

		});

	}

	protected abstract createMutation(callback: (mutation: XMutation) => void): void;

}

export default DatasetProjectHomeMenu;
bekasi.CATEGORY_ORDER.push(DatasetProjectHomeMenu.DATA_SOURCES);