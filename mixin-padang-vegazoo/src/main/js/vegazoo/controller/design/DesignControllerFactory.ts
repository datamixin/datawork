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

import XOutlook from "vegazoo/model/XOutlook";
import XVegalite from "vegazoo/model/XVegalite";

import XConfig from "vegazoo/model/XConfig";
import XMarkDef from "vegazoo/model/XMarkDef";
import XColorDef from "vegazoo/model/XColorDef";
import XEncoding from "vegazoo/model/XEncoding";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import OutlookDesignController from "vegazoo/controller/design/OutlookDesignController";
import VegaliteDesignController from "vegazoo/controller/design/VegaliteDesignController";

import ConfigDesignController from "vegazoo/controller/design/ConfigDesignController";
import MarkDefDesignController from "vegazoo/controller/design/MarkDefDesignController";
import ColorDefDesignController from "vegazoo/controller/design/ColorDefDesignController";
import EncodingDesignController from "vegazoo/controller/design/EncodingDesignController";
import UnitSpecDesignController from "vegazoo/controller/design/UnitSpecDesignController";
import LayerSpecDesignController from "vegazoo/controller/design/LayerSpecDesignController";
import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";
import FacetFieldDefDesignController from "vegazoo/controller/design/FacetFieldDefDesignController";
import FacetedEncodingDesignController from "vegazoo/controller/design/FacetedEncodingDesignController";
import FacetedUnitSpecDesignController from "vegazoo/controller/design/FacetedUnitSpecDesignController";
import PositionDatumDefDesignController from "vegazoo/controller/design/PositionDatumDefDesignController";
import PositionFieldDefDesignController from "vegazoo/controller/design/PositionFieldDefDesignController";
import TopLevelUnitSpecDesignController from "vegazoo/controller/design/TopLevelUnitSpecDesignController";
import TopLevelLayerSpecDesignController from "vegazoo/controller/design/TopLevelLayerSpecDesignController";
import TopLevelFacetSpecDesignController from "vegazoo/controller/design/TopLevelFacetSpecDesignController";
import TopLevelHConcatSpecDesignController from "vegazoo/controller/design/TopLevelHConcatSpecDesignController";
import TopLevelVConcatSpecDesignController from "vegazoo/controller/design/TopLevelVConcatSpecDesignController";
import FacetEncodingFieldDefDesignController from "vegazoo/controller/design/FacetEncodingFieldDefDesignController";
import RowColumnEncodingFieldDefDesignController from "vegazoo/controller/design/RowColumnEncodingFieldDefDesignController";

export default class DesignControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		super.register(XOutlook.XCLASSNAME, OutlookDesignController);
		super.register(XVegalite.XCLASSNAME, VegaliteDesignController);

		super.register(XConfig.XCLASSNAME, ConfigDesignController);
		super.register(XMarkDef.XCLASSNAME, MarkDefDesignController);
		super.register(XColorDef.XCLASSNAME, ColorDefDesignController);
		super.register(XEncoding.XCLASSNAME, EncodingDesignController);
		super.register(XUnitSpec.XCLASSNAME, UnitSpecDesignController);
		super.register(XLayerSpec.XCLASSNAME, LayerSpecDesignController);
		super.register(XTopLevelSpec.XCLASSNAME, TopLevelSpecDesignController);
		super.register(XFacetFieldDef.XCLASSNAME, FacetFieldDefDesignController);
		super.register(XFacetedEncoding.XCLASSNAME, FacetedEncodingDesignController);
		super.register(XFacetedUnitSpec.XCLASSNAME, FacetedUnitSpecDesignController);
		super.register(XPositionFieldDef.XCLASSNAME, PositionFieldDefDesignController);
		super.register(XPositionDatumDef.XCLASSNAME, PositionDatumDefDesignController);
		super.register(XTopLevelUnitSpec.XCLASSNAME, TopLevelUnitSpecDesignController);
		super.register(XTopLevelLayerSpec.XCLASSNAME, TopLevelLayerSpecDesignController);
		super.register(XTopLevelFacetSpec.XCLASSNAME, TopLevelFacetSpecDesignController);
		super.register(XTopLevelHConcatSpec.XCLASSNAME, TopLevelHConcatSpecDesignController);
		super.register(XTopLevelVConcatSpec.XCLASSNAME, TopLevelVConcatSpecDesignController);
		super.register(XFacetEncodingFieldDef.XCLASSNAME, FacetEncodingFieldDefDesignController);
		super.register(XRowColumnEncodingFieldDef.XCLASSNAME, RowColumnEncodingFieldDefDesignController);

	}

}