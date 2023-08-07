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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XCell from "padang/model/XCell";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XBuilder from "padang/model/XBuilder";
import XDataset from "padang/model/XDataset";
import XTabular from "padang/model/XTabular";
import XOutlook from "padang/model/XOutlook";
import XViewset from "padang/model/XViewset";
import XOutcome from "padang/model/XOutcome";

import CellToolsetController from "padang/controller/toolset/CellToolsetController";
import SheetToolsetController from "padang/controller/toolset/SheetToolsetController";
import FigureToolsetController from "padang/controller/toolset/FigureToolsetController";
import DatasetToolsetController from "padang/controller/toolset/DatasetToolsetController";
import BuilderToolsetController from "padang/controller/toolset/BuilderToolsetController";
import OutlookToolsetController from "padang/controller/toolset/OutlookToolsetController";
import OutcomeToolsetController from "padang/controller/toolset/OutcomeToolsetController";
import TabularToolsetController from "padang/controller/toolset/TabularToolsetController";
import ViewsetToolsetController from "padang/controller/toolset/ViewsetToolsetController";

export default class ToolsetControllerFactory extends LeanControllerFactory {

	constructor() {
		super();
		super.register(XCell.XCLASSNAME, CellToolsetController);
		super.register(XSheet.XCLASSNAME, SheetToolsetController);
		super.register(XFigure.XCLASSNAME, FigureToolsetController);
		super.register(XBuilder.XCLASSNAME, BuilderToolsetController);
		super.register(XDataset.XCLASSNAME, DatasetToolsetController);
		super.register(XViewset.XCLASSNAME, ViewsetToolsetController);
		super.register(XTabular.XCLASSNAME, TabularToolsetController);
		super.register(XOutlook.XCLASSNAME, OutlookToolsetController);
		super.register(XOutcome.XCLASSNAME, OutcomeToolsetController);
	}

}