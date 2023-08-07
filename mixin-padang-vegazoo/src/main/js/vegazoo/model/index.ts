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
import XOutlook from "vegazoo/model/XOutlook";
import XViewlet from "vegazoo/model/XViewlet";
import XExplain from "vegazoo/model/XExplain";
import XTabular from "vegazoo/model/XTabular";
import XVegalite from "vegazoo/model/XVegalite";

import XData from "vegazoo/model/XData";
import XAxis from "vegazoo/model/XAxis";
import XSort from "vegazoo/model/XSort";
import XScale from "vegazoo/model/XScale";
import XAlign from "vegazoo/model/XAlign";
import XConfig from "vegazoo/model/XConfig";
import XLegend from "vegazoo/model/XLegend";
import XMarkDef from "vegazoo/model/XMarkDef";
import XBaseDef from "vegazoo/model/XBaseDef";
import XExprRef from "vegazoo/model/XExprRef";
import XFieldDef from "vegazoo/model/XFieldDef";
import XTimeUnit from "vegazoo/model/XTimeUnit";
import XViewSpec from "vegazoo/model/XViewSpec";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import XValueDef from "vegazoo/model/XValueDef";
import XPolarDef from "vegazoo/model/XPolarDef";
import XColorDef from "vegazoo/model/XColorDef";
import XEncoding from "vegazoo/model/XEncoding";
import XStringDef from "vegazoo/model/XStringDef";
import XFieldName from "vegazoo/model/XFieldName";
import XGenerator from "vegazoo/model/XGenerator";
import XNamedData from "vegazoo/model/XNamedData";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XNumberDef from "vegazoo/model/XNumberDef";
import XBinParams from "vegazoo/model/XBinParams";
import XTransform from "vegazoo/model/XTransform";
import XMarkConfig from "vegazoo/model/XMarkConfig";
import XViewConfig from "vegazoo/model/XViewConfig";
import XAxisConfig from "vegazoo/model/XAxisConfig";
import XDataFormat from "vegazoo/model/XDataFormat";
import XInlineData from "vegazoo/model/XInlineData";
import XBooleanDef from "vegazoo/model/XBooleanDef";
import XDataSource from "vegazoo/model/XDataSource";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XPositionDef from "vegazoo/model/XPositionDef";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFacetMapping from "vegazoo/model/XFacetMapping";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XAnyMarkConfig from "vegazoo/model/XAnyMarkConfig";
import XFoldTransform from "vegazoo/model/XFoldTransform";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XSequenceParams from "vegazoo/model/XSequenceParams";
import XSharedEncoding from "vegazoo/model/XSharedEncoding";
import XColorStringDef from "vegazoo/model/XColorStringDef";
import XWindowFieldDef from "vegazoo/model/XWindowFieldDef";
import XWindowTransform from "vegazoo/model/XWindowTransform";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionValueDef from "vegazoo/model/XPositionValueDef";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XSequenceGenerator from "vegazoo/model/XSequenceGenerator";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XCalculateTransform from "vegazoo/model/XCalculateTransform";
import XRegressionTransform from "vegazoo/model/XRegressionTransform";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XFieldDefWithoutScale from "vegazoo/model/XFieldDefWithoutScale";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";
import XJoinAggregateFieldDef from "vegazoo/model/XJoinAggregateFieldDef";
import XJoinAggregateTransform from "vegazoo/model/XJoinAggregateTransform";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import ViceReference from "vegazoo/model/ViceReference";

import * as model from "vegazoo/model/model";
import VegazooCreator from "vegazoo/model/VegazooCreator";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import VegazooPackage from "vegazoo/model/VegazooPackage";
import BaseVegazooFactory from "vegazoo/model/BaseVegazooFactory";
import BaseVegazooPackage from "vegazoo/model/BaseVegazooPackage";

export {

	XOutlook,
	XViewlet,
	XExplain,
	XVegalite,
	XTabular,

	XData,
	XAxis,
	XSort,
	XScale,
	XAlign,
	XConfig,
	XLegend,
	XMarkDef,
	XBaseDef,
	XExprRef,
	XFieldDef,
	XTimeUnit,
	XViewSpec,
	XUnitSpec,
	XAnyOfDef,
	XValueDef,
	XColorDef,
	XPolarDef,
	XEncoding,
	XFieldName,
	XTransform,
	XLayerSpec,
	XBinParams,
	XNumberDef,
	XNamedData,
	XGenerator,
	XStringDef,
	XMarkConfig,
	XViewConfig,
	XAxisConfig,
	XDataFormat,
	XInlineData,
	XBooleanDef,
	XDataSource,
	XHConcatSpec,
	XVConcatSpec,
	XPositionDef,
	XLegendConfig,
	XFacetMapping,
	XTopLevelSpec,
	XFoldTransform,
	XAnyMarkConfig,
	XFacetFieldDef,
	XColorStringDef,
	XSequenceParams,
	XSharedEncoding,
	XWindowFieldDef,
	XWindowTransform,
	XFacetedUnitSpec,
	XFacetedEncoding,
	XPositionFieldDef,
	XPositionValueDef,
	XPositionDatumDef,
	XTopLevelUnitSpec,
	XSequenceGenerator,
	XTopLevelLayerSpec,
	XTopLevelFacetSpec,
	XCalculateTransform,
	XRegressionTransform,
	XTopLevelHConcatSpec,
	XTopLevelVConcatSpec,
	XFieldDefWithoutScale,
	XFacetEncodingFieldDef,
	XJoinAggregateFieldDef,
	XJoinAggregateTransform,
	XRowColumnEncodingFieldDef,

	ViceReference,

	model,
	VegazooCreator,
	VegazooFactory,
	VegazooPackage,
	BaseVegazooFactory,
	BaseVegazooPackage,

}