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

import XConfig from "vegazoo/model/XConfig";

import XTabular from "vegazoo/model/XTabular";
import XOutlook from "vegazoo/model/XOutlook";
import XExplain from "vegazoo/model/XExplain";
import XVegalite from "vegazoo/model/XVegalite";

import XSort from "vegazoo/model/XSort";
import XScale from "vegazoo/model/XScale";
import XAlign from "vegazoo/model/XAlign";
import XLegend from "vegazoo/model/XLegend";
import XExprRef from "vegazoo/model/XExprRef";
import XMarkDef from "vegazoo/model/XMarkDef";
import XColorDef from "vegazoo/model/XColorDef";
import XEncoding from "vegazoo/model/XEncoding";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XNamedData from "vegazoo/model/XNamedData";
import XFieldName from "vegazoo/model/XFieldName";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XNumberDef from "vegazoo/model/XNumberDef";
import XBinParams from "vegazoo/model/XBinParams";
import XInlineData from "vegazoo/model/XInlineData";
import XBooleanDef from "vegazoo/model/XBooleanDef";
import XDataFormat from "vegazoo/model/XDataFormat";
import XMarkConfig from "vegazoo/model/XMarkConfig";
import XViewConfig from "vegazoo/model/XViewConfig";
import XAxisConfig from "vegazoo/model/XAxisConfig";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XFoldTransform from "vegazoo/model/XFoldTransform";
import XSharedEncoding from "vegazoo/model/XSharedEncoding";
import XSequenceParams from "vegazoo/model/XSequenceParams";
import XWindowFieldDef from "vegazoo/model/XWindowFieldDef";
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

import VegazooFactory from "vegazoo/model/VegazooFactory";
import VegazooPackage from "vegazoo/model/VegazooPackage";

export default class BaseVegazooFactory extends VegazooFactory {

	public create(eClass: EClass): EObject {
		let name = eClass.getName();
		let ePackage = VegazooPackage.eINSTANCE;
		let eObject: any = ePackage.getEClass(name);
		try {
			return new eObject();
		} catch (e) {
			throw new Error("Fail create model from " + eClass);
		}
	}

	public createOutlook(): XOutlook {
		return new XOutlook();
	}

	public createExplain(): XExplain {
		return new XExplain();
	}

	public createVegalite(): XVegalite {
		return new XVegalite();
	}

	public createTabular(): XTabular {
		return new XTabular();
	}

	public createNamedData(): XNamedData {
		return new XNamedData();
	}

	public createInlineData(): XInlineData {
		return new XInlineData();
	}

	public createDataFormat(): XDataFormat {
		return new XDataFormat();
	}

	public createConfig(): XConfig {
		return new XConfig();
	}

	public createViewConfig(): XViewConfig {
		return new XViewConfig();
	}

	public createMarkConfig(): XMarkConfig {
		return new XMarkConfig();
	}

	public createAxisConfig(): XAxisConfig {
		return new XAxisConfig();
	}

	public createLegendConfig(): XLegendConfig {
		return new XLegendConfig();
	}

	public createLegend(): XLegend {
		return new XLegend();
	}

	public createMarkDef(): XMarkDef {
		return new XMarkDef();
	}

	public createColorDef(): XColorDef {
		return new XColorDef();
	}

	public createUnitSpec(): XUnitSpec {
		return new XUnitSpec();
	}

	public createLayerSpec(): XLayerSpec {
		return new XLayerSpec();
	}

	public createHConcatSpec(): XHConcatSpec {
		return new XHConcatSpec();
	}

	public createVConcatSpec(): XVConcatSpec {
		return new XVConcatSpec();
	}

	public createEncoding(): XEncoding {
		return new XEncoding();
	}

	public createSharedEncoding(): XSharedEncoding {
		return new XSharedEncoding();
	}

	public createFacetedEncoding(): XFacetedEncoding {
		return new XFacetedEncoding();
	}

	public createFacetedUnitSpec(): XFacetedUnitSpec {
		return new XFacetedUnitSpec();
	}

	public createPositionDatumDef(): XPositionDatumDef {
		return new XPositionDatumDef();
	}

	public createPositionFieldDef(): XPositionFieldDef {
		return new XPositionFieldDef();
	}

	public createPositionValueDef(): XPositionValueDef {
		return new XPositionValueDef();
	}

	public createFacetFieldDef(): XFacetFieldDef {
		return new XFacetFieldDef();
	}

	public createSequenceParams(): XSequenceParams {
		return new XSequenceParams();
	}

	public createFacetEncodingFieldDef(): XFacetEncodingFieldDef {
		return new XFacetEncodingFieldDef();
	}

	public createRowColumnEncodingFieldDef(): XRowColumnEncodingFieldDef {
		return new XRowColumnEncodingFieldDef();
	}

	public createFieldDefWithoutScale(): XFieldDefWithoutScale {
		return new XFieldDefWithoutScale();
	}

	public createSort(): XSort {
		return new XSort();
	}

	public createScale(): XScale {
		return new XScale();
	}

	public createAlign(): XAlign {
		return new XAlign();
	}

	public createExprRef(): XExprRef {
		return new XExprRef();
	}

	public createBinParams(): XBinParams {
		return new XBinParams();
	}

	public createBooleanDef(): XBooleanDef {
		return new XBooleanDef();
	}

	public createNumberDef(): XNumberDef {
		return new XNumberDef();
	}

	public createTopLevelUnitSpec(): XTopLevelUnitSpec {
		return new XTopLevelUnitSpec();
	}

	public createSequenceGenerator(): XSequenceGenerator {
		return new XSequenceGenerator();
	}

	public createTopLevelLayerSpec(): XTopLevelLayerSpec {
		return new XTopLevelLayerSpec();
	}

	public createTopLevelFacetSpec(): XTopLevelFacetSpec {
		return new XTopLevelFacetSpec();
	}

	public createTopLevelHConcatSpec(): XTopLevelHConcatSpec {
		return new XTopLevelHConcatSpec();
	}

	public createTopLevelVConcatSpec(): XTopLevelVConcatSpec {
		return new XTopLevelVConcatSpec();
	}

	public createCalculateTransform(): XCalculateTransform {
		return new XCalculateTransform();
	}

	public createRegressionTransform(): XRegressionTransform {
		return new XRegressionTransform();
	}

	public createWindowTransform(): XWindowTransform {
		return new XWindowTransform();
	}

	public createWindowFieldDef(): XWindowFieldDef {
		return new XWindowFieldDef();
	}

	public createFoldTransform(): XFoldTransform {
		return new XFoldTransform();
	}

	public createFieldName(): XFieldName {
		return new XFieldName();
	}

	public createJoinAggregateTransform(): XJoinAggregateTransform {
		return new XJoinAggregateTransform();
	}

	public createJoinAggregateFieldDef(): XJoinAggregateFieldDef {
		return new XJoinAggregateFieldDef();
	}

}

VegazooFactory.eINSTANCE = new BaseVegazooFactory();
