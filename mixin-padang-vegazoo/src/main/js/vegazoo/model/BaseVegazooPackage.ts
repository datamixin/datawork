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
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";
import ModelNamespace from "webface/model/ModelNamespace";

import XConfig from "vegazoo/model/XConfig";

import XOutlook from "vegazoo/model/XOutlook";
import XTabular from "vegazoo/model/XTabular";
import XVegalite from "vegazoo/model/XVegalite";

import XAxis from "vegazoo/model/XAxis";
import XSort from "vegazoo/model/XSort";
import XScale from "vegazoo/model/XScale";
import XAlign from "vegazoo/model/XAlign";
import XLegend from "vegazoo/model/XLegend";
import XMarkDef from "vegazoo/model/XMarkDef";
import XExprRef from "vegazoo/model/XExprRef";
import XTimeUnit from "vegazoo/model/XTimeUnit";
import XColorDef from "vegazoo/model/XColorDef";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XEncoding from "vegazoo/model/XEncoding";
import XNamedData from "vegazoo/model/XNamedData";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XBinParams from "vegazoo/model/XBinParams";
import XNumberDef from "vegazoo/model/XNumberDef";
import XInlineData from "vegazoo/model/XInlineData";
import XBooleanDef from "vegazoo/model/XBooleanDef";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFacetFieldDef from "vegazoo/model/XFacetFieldDef";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionDatumDef from "vegazoo/model/XPositionDatumDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XFacetEncodingFieldDef from "vegazoo/model/XFacetEncodingFieldDef";
import XRowColumnEncodingFieldDef from "vegazoo/model/XRowColumnEncodingFieldDef";

import { NAMESPACE } from "vegazoo/model/model";
import VegazooPackage from "vegazoo/model/VegazooPackage";
import VegazooFactory from "vegazoo/model/VegazooFactory";

export default class BasicVegazooPackage implements VegazooPackage {

	private map: { [xClass: string]: typeof EObject } = {};

	constructor() {

		this.map[XOutlook.XCLASSNAME] = XOutlook;
		this.map[XTabular.XCLASSNAME] = XTabular;
		this.map[XVegalite.XCLASSNAME] = XVegalite;

		this.map[XAxis.XCLASSNAME] = XAxis;
		this.map[XSort.XCLASSNAME] = XSort;
		this.map[XAlign.XCLASSNAME] = XAlign;
		this.map[XScale.XCLASSNAME] = XScale;
		this.map[XAlign.XCLASSNAME] = XAlign;
		this.map[XConfig.XCLASSNAME] = XConfig;
		this.map[XLegend.XCLASSNAME] = XLegend;
		this.map[XMarkDef.XCLASSNAME] = XMarkDef;
		this.map[XExprRef.XCLASSNAME] = XExprRef;
		this.map[XTimeUnit.XCLASSNAME] = XTimeUnit;
		this.map[XColorDef.XCLASSNAME] = XColorDef;
		this.map[XUnitSpec.XCLASSNAME] = XUnitSpec;
		this.map[XEncoding.XCLASSNAME] = XEncoding;
		this.map[XNamedData.XCLASSNAME] = XNamedData;
		this.map[XNumberDef.XCLASSNAME] = XNumberDef;
		this.map[XLayerSpec.XCLASSNAME] = XLayerSpec;
		this.map[XBinParams.XCLASSNAME] = XBinParams;
		this.map[XInlineData.XCLASSNAME] = XInlineData;
		this.map[XBooleanDef.XCLASSNAME] = XBooleanDef;
		this.map[XHConcatSpec.XCLASSNAME] = XHConcatSpec;
		this.map[XVConcatSpec.XCLASSNAME] = XVConcatSpec;
		this.map[XLegendConfig.XCLASSNAME] = XLegendConfig;
		this.map[XFacetFieldDef.XCLASSNAME] = XFacetFieldDef;
		this.map[XFacetedEncoding.XCLASSNAME] = XFacetedEncoding;
		this.map[XFacetedUnitSpec.XCLASSNAME] = XFacetedUnitSpec;
		this.map[XPositionDatumDef.XCLASSNAME] = XPositionDatumDef;
		this.map[XPositionFieldDef.XCLASSNAME] = XPositionFieldDef;
		this.map[XTopLevelUnitSpec.XCLASSNAME] = XTopLevelUnitSpec;
		this.map[XTopLevelLayerSpec.XCLASSNAME] = XTopLevelLayerSpec;
		this.map[XTopLevelFacetSpec.XCLASSNAME] = XTopLevelFacetSpec;
		this.map[XTopLevelHConcatSpec.XCLASSNAME] = XTopLevelHConcatSpec;
		this.map[XTopLevelVConcatSpec.XCLASSNAME] = XTopLevelVConcatSpec;
		this.map[XFacetEncodingFieldDef.XCLASSNAME] = XFacetEncodingFieldDef;
		this.map[XRowColumnEncodingFieldDef.XCLASSNAME] = XRowColumnEncodingFieldDef;
	}

	public getNamespaces(): ModelNamespace[] {
		return [NAMESPACE];
	}

	public getDefinedEClass(eClassName: string): typeof EObject {
		return this.map[eClassName] || null;
	}

	public getEClass(eClassName: string): typeof EObject {
		return this.getDefinedEClass(eClassName);
	}

	public getEFactoryInstance(): EFactory {
		return VegazooFactory.eINSTANCE;
	}

	public listEClasses(): typeof EObject[] {
		let classes: any[] = [];
		let keys = Object.keys(this.map);
		for (let name of keys) {
			let eClassType = this.map[name];
			classes.push(eClassType);
		}
		return classes;
	}

}

VegazooPackage.eINSTANCE = new BasicVegazooPackage();

