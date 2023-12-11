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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";

import XOutlook from "vegazoo/model/XOutlook";
import XExplain from "vegazoo/model/XExplain";
import XVegalite from "vegazoo/model/XVegalite";
import XTabular from "vegazoo/model/XTabular";

import XSort from "vegazoo/model/XSort";
import XAlign from "vegazoo/model/XAlign";
import XScale from "vegazoo/model/XScale";
import XConfig from "vegazoo/model/XConfig";
import XLegend from "vegazoo/model/XLegend";
import XMarkDef from "vegazoo/model/XMarkDef";
import XExprRef from "vegazoo/model/XExprRef";
import XColorDef from "vegazoo/model/XColorDef";
import XEncoding from "vegazoo/model/XEncoding";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XFieldName from "vegazoo/model/XFieldName";
import XNamedData from "vegazoo/model/XNamedData";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XBinParams from "vegazoo/model/XBinParams";
import XNumberDef from "vegazoo/model/XNumberDef";
import XAxisConfig from "vegazoo/model/XAxisConfig";
import XMarkConfig from "vegazoo/model/XMarkConfig";
import XViewConfig from "vegazoo/model/XViewConfig";
import XInlineData from "vegazoo/model/XInlineData";
import XDataFormat from "vegazoo/model/XDataFormat";
import XBooleanDef from "vegazoo/model/XBooleanDef";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XFoldTransform from "vegazoo/model/XFoldTransform";
import XSequenceParams from "vegazoo/model/XSequenceParams";
import XWindowFieldDef from "vegazoo/model/XWindowFieldDef";
import XSharedEncoding from "vegazoo/model/XSharedEncoding";
import XWindowTransform from "vegazoo/model/XWindowTransform";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XPositionValueDef from "vegazoo/model/XPositionValueDef";
import XSequenceGenerator from "vegazoo/model/XSequenceGenerator";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
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

export abstract class VegazooFactory implements EFactory {

	public static eINSTANCE: VegazooFactory = null;

	abstract create(xClass: EClass): EObject;


	abstract createOutlook(): XOutlook;

	abstract createExplain(): XExplain;

	abstract createVegalite(): XVegalite;

	abstract createTabular(): XTabular;

	abstract createNamedData(): XNamedData;

	abstract createInlineData(): XInlineData;

	abstract createDataFormat(): XDataFormat;

	abstract createConfig(): XConfig;

	abstract createAxisConfig(): XAxisConfig;

	abstract createViewConfig(): XViewConfig;

	abstract createMarkConfig(): XMarkConfig;

	abstract createLegendConfig(): XLegendConfig;

	abstract createMarkDef(): XMarkDef;

	abstract createColorDef(): XColorDef;

	abstract createLegend(): XLegend;

	abstract createUnitSpec(): XUnitSpec;

	abstract createLayerSpec(): XLayerSpec;

	abstract createHConcatSpec(): XHConcatSpec;

	abstract createVConcatSpec(): XVConcatSpec;

	abstract createEncoding(): XEncoding;

	abstract createSharedEncoding(): XSharedEncoding;

	abstract createFacetedEncoding(): XFacetedEncoding;

	abstract createFacetedUnitSpec(): XFacetedUnitSpec;

	abstract createPositionDatumDef(): XPositionDatumDef;

	abstract createPositionFieldDef(): XPositionFieldDef;

	abstract createPositionValueDef(): XPositionValueDef;

	abstract createFacetFieldDef(): XFacetFieldDef;

	abstract createFacetFieldDef(): XFacetFieldDef;

	abstract createFacetEncodingFieldDef(): XFacetEncodingFieldDef;

	abstract createRowColumnEncodingFieldDef(): XRowColumnEncodingFieldDef;

	abstract createFieldDefWithoutScale(): XFieldDefWithoutScale;

	abstract createSort(): XSort;

	abstract createScale(): XScale;

	abstract createAlign(): XAlign;

	abstract createExprRef(): XExprRef;

	abstract createBinParams(): XBinParams;

	abstract createBooleanDef(): XBooleanDef;

	abstract createNumberDef(): XNumberDef;

	abstract createSequenceParams(): XSequenceParams;

	abstract createTopLevelUnitSpec(): XTopLevelUnitSpec;

	abstract createSequenceGenerator(): XSequenceGenerator;

	abstract createTopLevelLayerSpec(): XTopLevelLayerSpec;

	abstract createTopLevelFacetSpec(): XTopLevelFacetSpec;

	abstract createTopLevelHConcatSpec(): XTopLevelHConcatSpec;

	abstract createTopLevelVConcatSpec(): XTopLevelVConcatSpec;

	abstract createCalculateTransform(): XCalculateTransform;

	abstract createRegressionTransform(): XRegressionTransform;

	abstract createWindowTransform(): XWindowTransform;

	abstract createWindowFieldDef(): XWindowFieldDef;

	abstract createFoldTransform(): XFoldTransform;

	abstract createFieldName(): XFieldName;

	abstract createJoinAggregateTransform(): XJoinAggregateTransform;

	abstract createJoinAggregateFieldDef(): XJoinAggregateFieldDef;

}

export default VegazooFactory;
