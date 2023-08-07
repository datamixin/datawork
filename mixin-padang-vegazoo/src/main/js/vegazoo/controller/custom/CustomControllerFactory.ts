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

import XAxis from "vegazoo/model/XAxis";
import XSort from "vegazoo/model/XSort";
import XAlign from "vegazoo/model/XAlign";
import XScale from "vegazoo/model/XScale";
import XConfig from "vegazoo/model/XConfig";
import XMarkDef from "vegazoo/model/XMarkDef";
import XTimeUnit from "vegazoo/model/XTimeUnit";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XColorDef from "vegazoo/model/XColorDef";
import XNumberDef from "vegazoo/model/XNumberDef";
import XBooleanDef from "vegazoo/model/XBooleanDef";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import ViceReference from "vegazoo/model/ViceReference";

import SortCustomController from "vegazoo/controller/custom/SortCustomController";
import AxisCustomController from "vegazoo/controller/custom/AxisCustomController";
import AlignCustomController from "vegazoo/controller/custom/AlignCustomController";
import ScaleCustomController from "vegazoo/controller/custom/ScaleCustomController";
import ConfigCustomController from "vegazoo/controller/custom/ConfigCustomController";
import MarkDefCustomController from "vegazoo/controller/custom/MarkDefCustomController";
import ColorDefCustomController from "vegazoo/controller/custom/ColorDefCustomController";
import TimeUnitCustomController from "vegazoo/controller/custom/TimeUnitCustomController";
import UnitSpecCustomController from "vegazoo/controller/custom/UnitSpecCustomController";
import NumberDefCustomController from "vegazoo/controller/custom/NumberDefCustomController";
import BooleanDefCustomController from "vegazoo/controller/custom/BooleanDefCustomController";
import FacetFieldDefCustomController from "vegazoo/controller/custom/FacetFieldDefCustomController";
import ViceReferenceCustomController from "vegazoo/controller/custom/ViceReferenceCustomController";
import FacetedUnitSpecCustomController from "vegazoo/controller/custom/FacetedUnitSpecCustomController";
import PositionFieldDefCustomController from "vegazoo/controller/custom/PositionFieldDefCustomController";
import PositionDatumDefCustomController from "vegazoo/controller/custom/PositionDatumDefCustomController";
import TopLevelUnitSpecCustomController from "vegazoo/controller/custom/TopLevelUnitSpecCustomController";
import TopLevelLayerSpecCustomController from "vegazoo/controller/custom/TopLevelLayerSpecCustomController";
import TopLevelFacetSpecCustomController from "vegazoo/controller/custom/TopLevelFacetSpecCustomController";
import TopLevelHConcatSpecCustomController from "vegazoo/controller/custom/TopLevelHConcatSpecCustomController";
import TopLevelVConcatSpecCustomController from "vegazoo/controller/custom/TopLevelVConcatSpecCustomController";
import FacetEncodingFieldDefCustomController from "vegazoo/controller/custom/FacetEncodingFieldDefCustomController";
import RowColumnEncodingFieldDefCustomController from "vegazoo/controller/custom/RowColumnEncodingFieldDefCustomController";

export default class CustomControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		super.register(XAxis.XCLASSNAME, AxisCustomController);
		super.register(XSort.XCLASSNAME, SortCustomController);
		super.register(XAlign.XCLASSNAME, AlignCustomController);
		super.register(XScale.XCLASSNAME, ScaleCustomController);
		super.register(XConfig.XCLASSNAME, ConfigCustomController);
		super.register(XMarkDef.XCLASSNAME, MarkDefCustomController);
		super.register(XColorDef.XCLASSNAME, ColorDefCustomController);
		super.register(XTimeUnit.XCLASSNAME, TimeUnitCustomController);
		super.register(XUnitSpec.XCLASSNAME, UnitSpecCustomController);
		super.register(XNumberDef.XCLASSNAME, NumberDefCustomController);
		super.register(XBooleanDef.XCLASSNAME, BooleanDefCustomController);
		super.register(XFacetFieldDef.XCLASSNAME, FacetFieldDefCustomController);
		super.register(XFacetedUnitSpec.XCLASSNAME, FacetedUnitSpecCustomController);
		super.register(XPositionFieldDef.XCLASSNAME, PositionFieldDefCustomController);
		super.register(XPositionDatumDef.XCLASSNAME, PositionDatumDefCustomController);
		super.register(XTopLevelUnitSpec.XCLASSNAME, TopLevelUnitSpecCustomController);
		super.register(XTopLevelUnitSpec.XCLASSNAME, TopLevelUnitSpecCustomController);
		super.register(XTopLevelLayerSpec.XCLASSNAME, TopLevelLayerSpecCustomController);
		super.register(XTopLevelFacetSpec.XCLASSNAME, TopLevelFacetSpecCustomController);
		super.register(XTopLevelVConcatSpec.XCLASSNAME, TopLevelVConcatSpecCustomController);
		super.register(XTopLevelHConcatSpec.XCLASSNAME, TopLevelHConcatSpecCustomController);
		super.register(XFacetEncodingFieldDef.XCLASSNAME, FacetEncodingFieldDefCustomController);
		super.register(XRowColumnEncodingFieldDef.XCLASSNAME, RowColumnEncodingFieldDefCustomController);

		super.register(ViceReference.LEAN_NAME, ViceReferenceCustomController);
	}

}