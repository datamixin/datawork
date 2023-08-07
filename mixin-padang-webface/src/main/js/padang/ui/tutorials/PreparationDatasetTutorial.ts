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
import TutorialRegistry from "bekasi/ui/tutorials/TutorialRegistry";

import DatasetGuidePanel from "padang/panels/DatasetGuidePanel";

import ProjectTutorial from "padang/ui/tutorials/ProjectTutorial";

import BlankProjectHomeMenu from "padang/ui/BlankProjectHomeMenu";

export default class PreparationDatasetTutorial extends ProjectTutorial {

	constructor() {
		super();
		super.setLabel("Preparation Dataset");
		super.click("." + BlankProjectHomeMenu.ICON);
		super.click(".padang-dataset-present-view ." + DatasetGuidePanel.SAMPLE_ICON);
		super.clickItem(".title-area-dialog-body .viewers-tableViewer-cell", 2);
		super.clickText(".dialog-shell .widgets-button", "OK");
		super.clickText(".bekasi-workspace-fulldeck .btn-success", "OK");
		this.waitProfile();
		super.clickItem(".padang-preparation-column-label-panel .mdi-menu-down", 0);
		super.clickText(".webface-popup-contents .menu-popup-action", "Remove Column");
		this.waitProfile();
		super.clickText(".bekasi-workspace-fulldeck .btn-success", "OK");
		this.waitProfile();
	}

}

let registry = TutorialRegistry.getInstance();
registry.register(new PreparationDatasetTutorial());