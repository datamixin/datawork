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
import * as present from "padang/view/present/present";
import * as propane from "padang/view/present/propane";
import * as surface from "padang/view/present/surface";

import PartPresentView from "padang/view/present/PartPresentView";
import CellPresentView from "padang/view/present/CellPresentView";
import SheetPresentView from "padang/view/present/SheetPresentView";
import FacetPresentView from "padang/view/present/FacetPresentView";
import FigurePresentView from "padang/view/present/FigurePresentView";
import ForeseePresentView from "padang/view/present/ForeseePresentView";
import ReceiptPresentView from "padang/view/present/ReceiptPresentView";
import BuilderPresentView from "padang/view/present/BuilderPresentView";
import TabularPresentView from "padang/view/present/TabularPresentView";
import OutcomePresentView from "padang/view/present/OutcomePresentView";
import DatasetPresentView from "padang/view/present/DatasetPresentView";
import ViewsetPresentView from "padang/view/present/ViewsetPresentView";
import MixturePresentView from "padang/view/present/MixturePresentView";
import DisplayPresentView from "padang/view/present/DisplayPresentView";
import GraphicPresentView from "padang/view/present/GraphicPresentView";
import OutlookPresentView from "padang/view/present/OutlookPresentView";
import VariablePresentView from "padang/view/present/VariablePresentView";
import IngestionPresentView from "padang/view/present/IngestionPresentView";
import PreparationPresentView from "padang/view/present/PreparationPresentView";
import VariableListPresentView from "padang/view/present/VariableListPresentView";

import FrontagePanel from "padang/view/present/FrontagePanel";
import DecorationPart from "padang/view/present/DecorationPart";
import CellGuidePanel from "padang/view/present/CellGuidePanel";
import SheetHeaderPanel from "padang/view/present/SheetHeaderPanel";
import PresentToolPanel from "padang/view/present/PresentToolPanel";
import PresentToolPorter from "padang/view/present/PresentToolPorter";
import PresentToolManager from "padang/view/present/PresentToolManager";
import CellDropSpaceGuide from "padang/view/present/CellDropSpaceGuide";
import DisplayHeaderPanel from "padang/view/present/DisplayHeaderPanel";
import OutcomeFooterPanel from "padang/view/present/OutcomeFooterPanel";
import TabularPresentMaker from "padang/view/present/TabularPresentMaker";
import TabularPresentPanel from "padang/view/present/TabularPresentPanel";

import TabularColumnProperties from "padang/view/present/TabularColumnProperties";
import TabularColumnHeaderPanel from "padang/view/present/TabularColumnHeaderPanel";
import TabularColumnProfilePanel from "padang/view/present/TabularColumnProfilePanel";

export {

	present,
	propane,
	surface,

	PartPresentView,
	CellPresentView,
	SheetPresentView,
	FacetPresentView,
	FigurePresentView,
	ForeseePresentView,
	BuilderPresentView,
	ReceiptPresentView,
	OutcomePresentView,
	DatasetPresentView,
	DisplayPresentView,
	ViewsetPresentView,
	TabularPresentView,
	MixturePresentView,
	GraphicPresentView,
	OutlookPresentView,
	VariablePresentView,
	IngestionPresentView,
	PreparationPresentView,
	VariableListPresentView,

	FrontagePanel,
	DecorationPart,
	CellGuidePanel,
	SheetHeaderPanel,
	PresentToolPanel,
	PresentToolPorter,
	PresentToolManager,
	CellDropSpaceGuide,
	DisplayHeaderPanel,
	OutcomeFooterPanel,
	TabularPresentMaker,
	TabularPresentPanel,

	TabularColumnProperties,
	TabularColumnHeaderPanel,
	TabularColumnProfilePanel,

}