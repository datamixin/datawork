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
import XOutcome from "padang/model/XOutcome";
import XMixture from "padang/model/XMixture";
import XDataset from "padang/model/XDataset";
import XViewset from "padang/model/XViewset";
import XTabular from "padang/model/XTabular";
import XGraphic from "padang/model/XGraphic";
import XBuilder from "padang/model/XBuilder";
import XOutlook from "padang/model/XOutlook";
import XVariable from "padang/model/XVariable";
import XIngestion from "padang/model/XIngestion";
import XPreparation from "padang/model/XPreparation";

import CellPresentController from "padang/controller/present/CellPresentController";
import SheetPresentController from "padang/controller/present/SheetPresentController";
import FigurePresentController from "padang/controller/present/FigurePresentController";
import OutcomePresentController from "padang/controller/present/OutcomePresentController";
import MixturePresentController from "padang/controller/present/MixturePresentController";
import DatasetPresentController from "padang/controller/present/DatasetPresentController";
import ViewsetPresentController from "padang/controller/present/ViewsetPresentController";
import TabularPresentController from "padang/controller/present/TabularPresentController";
import GraphicPresentController from "padang/controller/present/GraphicPresentController";
import BuilderPresentController from "padang/controller/present/BuilderPresentController";
import OutlookPresentController from "padang/controller/present/OutlookPresentController";
import VariablePresentController from "padang/controller/present/VariablePresentController";
import IngestionPresentController from "padang/controller/present/IngestionPresentController";
import PreparationPresentController from "padang/controller/present/PreparationPresentController";

export default class PresentControllerFactory extends LeanControllerFactory {

	constructor() {
		super();
		super.register(XCell.XCLASSNAME, CellPresentController);
		super.register(XSheet.XCLASSNAME, SheetPresentController);
		super.register(XFigure.XCLASSNAME, FigurePresentController);
		super.register(XOutcome.XCLASSNAME, OutcomePresentController);
		super.register(XMixture.XCLASSNAME, MixturePresentController);
		super.register(XDataset.XCLASSNAME, DatasetPresentController);
		super.register(XViewset.XCLASSNAME, ViewsetPresentController);
		super.register(XTabular.XCLASSNAME, TabularPresentController);
		super.register(XGraphic.XCLASSNAME, GraphicPresentController);
		super.register(XBuilder.XCLASSNAME, BuilderPresentController);
		super.register(XOutlook.XCLASSNAME, OutlookPresentController);
		super.register(XVariable.XCLASSNAME, VariablePresentController);
		super.register(XIngestion.XCLASSNAME, IngestionPresentController);
		super.register(XPreparation.XCLASSNAME, PreparationPresentController);

	}

}