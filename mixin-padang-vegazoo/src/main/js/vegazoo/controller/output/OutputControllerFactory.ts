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

import XOutlook from "vegazoo/model/XOutlook";
import XTabular from "vegazoo/model/XTabular";
import XVegalite from "vegazoo/model/XVegalite";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import OutlookOutputController from "vegazoo/controller/output/OutlookOutputController";
import TabularOutputController from "vegazoo/controller/output/TabularOutputController";
import VegaliteOutputController from "vegazoo/controller/output/VegaliteOutputController";
import UnitSpecOutputController from "vegazoo/controller/output/UnitSpecOutputController";
import LayerSpecOutputController from "vegazoo/controller/output/LayerSpecOutputController";
import HConcatSpecOutputController from "vegazoo/controller/output/HConcatSpecOutputController";
import VConcatSpecOutputController from "vegazoo/controller/output/VConcatSpecOutputController";
import FacetedUnitSpecOutputController from "vegazoo/controller/output/FacetedUnitSpecOutputController";
import TopLevelUnitSpecOutputController from "vegazoo/controller/output/TopLevelUnitSpecOutputController";
import TopLevelFacetSpecOutputController from "vegazoo/controller/output/TopLevelFacetSpecOutputController";
import TopLevelLayerSpecOutputController from "vegazoo/controller/output/TopLevelLayerSpecOutputController";
import TopLevelHConcatSpecOutputController from "vegazoo/controller/output/TopLevelHConcatSpecOutputController";
import TopLevelVConcatSpecOutputController from "vegazoo/controller/output/TopLevelVConcatSpecOutputController";

export default class OutputControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		super.register(XOutlook.XCLASSNAME, OutlookOutputController);
		super.register(XTabular.XCLASSNAME, TabularOutputController);
		super.register(XVegalite.XCLASSNAME, VegaliteOutputController);

		super.register(XUnitSpec.XCLASSNAME, UnitSpecOutputController);
		super.register(XLayerSpec.XCLASSNAME, LayerSpecOutputController);
		super.register(XHConcatSpec.XCLASSNAME, HConcatSpecOutputController);
		super.register(XVConcatSpec.XCLASSNAME, VConcatSpecOutputController);
		super.register(XFacetedUnitSpec.XCLASSNAME, FacetedUnitSpecOutputController);
		super.register(XTopLevelUnitSpec.XCLASSNAME, TopLevelUnitSpecOutputController);
		super.register(XTopLevelFacetSpec.XCLASSNAME, TopLevelFacetSpecOutputController);
		super.register(XTopLevelLayerSpec.XCLASSNAME, TopLevelLayerSpecOutputController);
		super.register(XTopLevelHConcatSpec.XCLASSNAME, TopLevelHConcatSpecOutputController);
		super.register(XTopLevelVConcatSpec.XCLASSNAME, TopLevelVConcatSpecOutputController);

	}

}