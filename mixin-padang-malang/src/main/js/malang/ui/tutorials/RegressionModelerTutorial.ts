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

import BlankProjectHomeMenu from "padang/ui/BlankProjectHomeMenu";

import ModelerTutorial from "malang/ui/tutorials/ModelerTutorial";

export default class RegressionModelerTutorial extends ModelerTutorial {

	constructor() {
		super();
		super.setLabel("Regression Modeler");
		super.click("." + BlankProjectHomeMenu.ICON);
		super.click(".padang-dataset-present-view ." + DatasetGuidePanel.SAMPLE_ICON);

		super.click(".title-area-dialog-body .viewers-tableViewer-item:nth-child(6) :nth-child(1)");
		super.clickText(".dialog-shell .widgets-button", "OK");
		super.clickText(".bekasi-workspace-fulldeck .btn-success", "OK");
		this.waitProfile();
		super.clickText(".bekasi-workspace-fulldeck .btn-success", "OK");
		this.waitProfile();
		super.clickItem(".padang-preparation-present-view .padang-preparation-present-figure", 0);

		super.dragItem(".padang-value-field-anatomy-main-part", 1, ".malang-multiple-assignment-design-view");

		super.dragItem(".padang-value-field-anatomy-main-part", 6, ".malang-single-assignment-design-view");

		super.click(".malang-algorithm-design-view .btn-sm");
		super.click(".title-area-dialog-body .viewers-tableViewer-item:nth-child(2) :nth-child(1)");
		super.clickText(".dialog-shell .widgets-button", "OK");

		super.click(".malang-modeler-topbar-view .mdi-play");
		this.waitResult();

		super.clickText(".bekasi-workspace-fulldeck .btn-success", "OK");
	}

}

let registry = TutorialRegistry.getInstance();
registry.register(new RegressionModelerTutorial());