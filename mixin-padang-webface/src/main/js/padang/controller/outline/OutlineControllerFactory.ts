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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";
import XBuilder from "padang/model/XBuilder";
import XDataset from "padang/model/XDataset";
import XOutlook from "padang/model/XOutlook";

import SheetOutlineController from "padang/controller/outline/SheetOutlineController";
import ProjectOutlineController from "padang/controller/outline/ProjectOutlineController";
import DatasetOutlineController from "padang/controller/outline/DatasetOutlineController";
import BuilderOutlineController from "padang/controller/outline/BuilderOutlineController";
import OutlookOutlineController from "padang/controller/outline/OutlookOutlineController";
import SheetListOutlineController from "padang/controller/outline/SheetListOutlineController";

export default class OutlineControllerFactory extends LeanControllerFactory {

	constructor() {
		super();
		super.register(XSheet.XCLASSNAME, SheetOutlineController);
		super.register(XProject.XCLASSNAME, ProjectOutlineController);
		super.register(XBuilder.XCLASSNAME, BuilderOutlineController);
		super.register(XDataset.XCLASSNAME, DatasetOutlineController);
		super.register(XOutlook.XCLASSNAME, OutlookOutlineController);

		super.registerList(XProject.XCLASSNAME, XProject.FEATURE_SHEETS, SheetListOutlineController);
	}

}