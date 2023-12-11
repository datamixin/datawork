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
import * as functions from "webface/util/functions";

import * as padang from "padang/padang";

import { EMPTY } from "vegazoo/constants";
import * as vegazoo from "vegazoo/vegazoo";
import { Format } from "vegazoo/constants";

import XSort from "vegazoo/model/XSort";
import XScale from "vegazoo/model/XScale";
import XAlign from "vegazoo/model/XAlign";
import XLegend from "vegazoo/model/XLegend";
import XExprRef from "vegazoo/model/XExprRef";
import XOutlook from "vegazoo/model/XOutlook";
import XMarkDef from "vegazoo/model/XMarkDef";
import XColorDef from "vegazoo/model/XColorDef";
import XVegalite from "vegazoo/model/XVegalite";
import XEncoding from "vegazoo/model/XEncoding";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XNumberDef from "vegazoo/model/XNumberDef";
import XNamedData from "vegazoo/model/XNamedData";
import XBinParams from "vegazoo/model/XBinParams";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XInlineData from "vegazoo/model/XInlineData";
import XAxisConfig from "vegazoo/model/XAxisConfig";
import XMarkConfig from "vegazoo/model/XMarkConfig";
import XViewConfig from "vegazoo/model/XViewConfig";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFoldTransform from "vegazoo/model/XFoldTransform";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XSharedEncoding from "vegazoo/model/XSharedEncoding";
import XSequenceParams from "vegazoo/model/XSequenceParams";
import XWindowTransform from "vegazoo/model/XWindowTransform";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionValueDef from "vegazoo/model/XPositionValueDef";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XSequenceGenerator from "vegazoo/model/XSequenceGenerator";
import XCalculateTransform from "vegazoo/model/XCalculateTransform";
import XRegressionTransform from "vegazoo/model/XRegressionTransform";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XFieldDefWithoutScale from "vegazoo/model/XFieldDefWithoutScale";
import XJoinAggregateTransform from "vegazoo/model/XJoinAggregateTransform";

import DesignTemplateRegistry from "vegazoo/directors/templates/DesignTemplateRegistry";

export default class VegazooCreator {

	public static eINSTANCE: VegazooCreator = null;

	public createOutlookVegaliteTopLevelSpec(): XOutlook {

		// Outlook
		let factory = VegazooFactory.eINSTANCE;
		let outlook = factory.createOutlook();

		// Vegalite
		let vegalite = factory.createVegalite();
		outlook.setViewlet(vegalite);

		return outlook;
	}

	public createTopLevelUnitSpec(outlook: XOutlook): XTopLevelUnitSpec {

		let vegalite = <XVegalite>outlook.getViewlet();

		// Unit spce
		let factory = VegazooFactory.eINSTANCE;
		let unitSpec = factory.createTopLevelUnitSpec();
		vegalite.setSpec(unitSpec);

		// Config
		let config = factory.createConfig();
		unitSpec.setConfig(config);

		return unitSpec;

	}

	public createTopLevelLayerSpec(outlook: XOutlook, namedData?: boolean): XTopLevelLayerSpec {

		let vegalite = <XVegalite>outlook.getViewlet();

		// Layer spec
		let factory = VegazooFactory.eINSTANCE;
		let layerSpec = factory.createTopLevelLayerSpec();
		vegalite.setSpec(layerSpec);

		// Data
		if (namedData === true) {
			let data = this.createNamedData(layerSpec);
			layerSpec.setData(data);
		}

		// Encoding
		let encoding = this.createSharedEncoding();
		layerSpec.setEncoding(encoding);

		this.setConfig(layerSpec);
		return layerSpec;

	}

	public createTopLevelVConcatSpec(outlook: XOutlook): XTopLevelVConcatSpec {

		let factory = VegazooFactory.eINSTANCE;
		let concatSpec = factory.createTopLevelVConcatSpec();
		let vegalite = <XVegalite>outlook.getViewlet();
		vegalite.setSpec(concatSpec);

		this.setConfig(concatSpec);
		return concatSpec;

	}

	public createTopLevelHConcatSpec(outlook: XOutlook): XTopLevelHConcatSpec {

		let factory = VegazooFactory.eINSTANCE;
		let concatSpec = factory.createTopLevelHConcatSpec();
		let vegalite = <XVegalite>outlook.getViewlet();
		vegalite.setSpec(concatSpec);

		this.setConfig(concatSpec);
		return concatSpec;

	}

	private setConfig(spec: XTopLevelSpec): void {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createConfig();
		spec.setConfig(config);
	}

	public createSharedEncoding(): XSharedEncoding {
		let factory = VegazooFactory.eINSTANCE;
		let encoding = factory.createSharedEncoding();
		return encoding;
	}

	public addUnitSpecLayer(spec: XTopLevelLayerSpec | XLayerSpec, namedData: boolean, markType: string): XUnitSpec {

		// Create unit add to layer
		let unitSpec = this.createUnitSpec(spec, namedData, markType);
		let layer = spec.getLayer();
		layer.add(unitSpec);

		return unitSpec;
	}

	public addUnitSpecVConcat(spec: XTopLevelVConcatSpec, namedData: boolean, markType: string): XUnitSpec {

		// Create unit add to layer
		let unitSpec = this.createUnitSpec(spec, namedData, markType);
		let concat = spec.getVconcat();
		concat.add(unitSpec);

		return unitSpec;
	}

	public addFacetedUnitSpecHConcat(spec: XTopLevelHConcatSpec, namedData: boolean, markType: string): XFacetedUnitSpec {

		// Create unit add to layer
		let unitSpec = this.createFacetedUnitSpec(spec, namedData, markType);
		let concat = spec.getHconcat();
		concat.add(unitSpec);

		return unitSpec;
	}

	public addHConcatSpecVConcat(spec: XTopLevelVConcatSpec): XHConcatSpec {
		let factory = VegazooFactory.eINSTANCE;
		let hconcatSpec = factory.createHConcatSpec();
		let concat = spec.getVconcat();
		concat.add(hconcatSpec);
		return hconcatSpec;
	}

	public addLayerSpecHConcat(spec: XTopLevelHConcatSpec | XHConcatSpec): XLayerSpec {

		// Layer		
		let factory = VegazooFactory.eINSTANCE;
		let layerSpec = factory.createLayerSpec();

		// Encoding
		let encoding = this.createSharedEncoding();
		layerSpec.setEncoding(encoding);

		// Add
		let concat = spec.getHconcat();
		concat.add(layerSpec);
		return layerSpec;
	}

	public createOutlook(markType: string): XOutlook {

		let outlook = this.createOutlookVegaliteTopLevelSpec();
		let unitSpec = this.createTopLevelUnitSpec(outlook);

		// Data
		let data = this.createNamedData(unitSpec);
		unitSpec.setData(data);

		// Mark
		let mark = this.createMark(markType);
		unitSpec.setMark(mark);

		// Encoding
		let preEncoding = this.createFacetedEncoding();
		unitSpec.setEncoding(preEncoding);

		// Template
		let registry = DesignTemplateRegistry.getInstance();
		let template = registry.get(markType);
		let remapper = template.getEncodingRemapper();
		let newEncoding = <XFacetedEncoding>remapper.remap(preEncoding);
		unitSpec.setEncoding(newEncoding);

		return outlook;

	}

	public createFacetedEncoding(): XFacetedEncoding {
		let factory = VegazooFactory.eINSTANCE;
		let encoding = factory.createFacetedEncoding();
		this.setXYChannels(encoding);
		return encoding;
	}

	private setXYChannels(encoding: XEncoding): void {

		// X Channel
		let xFieldDef = this.createPositionFieldDef();
		encoding.setX(xFieldDef);

		// X Channel
		let yFieldDef = this.createPositionFieldDef();
		encoding.setY(yFieldDef);

	}

	public createPositionFieldDef(): XPositionFieldDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createPositionFieldDef();
	}

	public createColorDef(): XColorDef {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createColorDef();
	}

	public createLegend(): XLegend {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createLegend();
	}

	public createPositionValueDef(value: number): XPositionValueDef {
		let factory = VegazooFactory.eINSTANCE;
		let def = factory.createPositionValueDef();
		def.setValue(value);
		return def;
	}

	public createFieldDefWithoutScale(): XFieldDefWithoutScale {
		let factory = VegazooFactory.eINSTANCE;
		return factory.createFieldDefWithoutScale();
	}

	public createScaleSchemaDomain(scheme: string, min: number, max: number): XScale {
		let factory = VegazooFactory.eINSTANCE;
		let scale = factory.createScale();
		scale.setScheme(scheme);
		scale.setDomainMin(min);
		scale.setDomainMax(max);
		return scale;
	}

	public createScaleRangeDomain(range: string[], min: number, max: number): XScale {
		let factory = VegazooFactory.eINSTANCE;
		let scale = factory.createScale();
		scale.setDomainMin(min);
		scale.setDomainMax(max);
		let ranges = scale.getRange();
		for (let value of range) {
			ranges.add(value);
		}
		return scale;
	}

	public createScaleZero(zero: boolean): XScale {
		let factory = VegazooFactory.eINSTANCE;
		let scale = factory.createScale();
		scale.setZero(zero);
		return scale;
	}

	public createUnitSpec(topLevelSpec: XTopLevelSpec | XLayerSpec,
		namedData: boolean, markType: string): XUnitSpec {
		let factory = VegazooFactory.eINSTANCE;
		let unitSpec = factory.createUnitSpec();
		this.setDataMarkEncoding(topLevelSpec, unitSpec, namedData, markType);
		return unitSpec;
	}

	public createFacetedUnitSpec(topLevelSpec: XTopLevelSpec | XLayerSpec,
		namedData: boolean, markType: string): XFacetedUnitSpec {
		let factory = VegazooFactory.eINSTANCE;
		let unitSpec = factory.createFacetedUnitSpec();
		this.setDataMarkEncoding(topLevelSpec, unitSpec, namedData, markType);
		return unitSpec;
	}

	private setDataMarkEncoding(topLevelSpec: XTopLevelSpec | XLayerSpec,
		unitSpec: XUnitSpec, namedData: boolean, markType: string): void {

		// Data
		if (namedData === true) {
			let data = this.createNamedData(topLevelSpec);
			unitSpec.setData(data);
		}

		// Mark
		let mark = this.createMark(markType);
		unitSpec.setMark(mark);

		// Encoding
		let encoding = this.createEncoding();
		unitSpec.setEncoding(encoding);

	}

	public createNamedData(instance: XTopLevelSpec | XLayerSpec): XNamedData {
		let names: string[] = [];
		if (instance instanceof XTopLevelUnitSpec) {
			let data = instance.getData();
			if (data instanceof XNamedData) {
				let name = data.getName();
				names.push(name);
			}
		} else if (instance instanceof XTopLevelLayerSpec || instance instanceof XLayerSpec) {
			let layer = instance.getLayer();
			for (let spec of layer) {
				let data = spec.getData();
				if (data instanceof XNamedData) {
					let name = data.getName();
					names.push(name);
				}
			}
		} else if (instance instanceof XTopLevelHConcatSpec || instance instanceof XHConcatSpec) {
			let concat = instance.getHconcat();
			for (let spec of concat) {
				let data = spec.getData();
				if (data instanceof XNamedData) {
					let name = data.getName();
					names.push(name);
				}
			}
		} else if (instance instanceof XTopLevelVConcatSpec || instance instanceof XVConcatSpec) {
			let concat = instance.getVconcat();
			for (let spec of concat) {
				let data = spec.getData();
				if (data instanceof XNamedData) {
					let name = data.getName();
					names.push(name);
				}
			}
		}
		let name = functions.getIncrementedName(padang.SERVER + vegazoo.DATASET, names);
		let factory = VegazooFactory.eINSTANCE;
		let data = factory.createNamedData();
		data.setName(name);
		return data;
	}

	public createCSVFormatData(): XInlineData {
		let factory = VegazooFactory.eINSTANCE;
		let data = factory.createInlineData();
		let format = factory.createDataFormat();
		format.setType(Format.CSV);
		data.setFormat(format)
		return data;
	}

	public createInlineDataEmpty(): XInlineData {
		let factory = VegazooFactory.eINSTANCE;
		let data = factory.createInlineData();
		data.setValues(EMPTY);
		return data;
	}

	public createExrpRef(expr: string): XExprRef {
		let factory = VegazooFactory.eINSTANCE;
		let ref = factory.createExprRef();
		ref.setExpr(expr);
		return ref;
	}

	public createEncoding(): XEncoding {
		let factory = VegazooFactory.eINSTANCE;
		let encoding = factory.createEncoding();
		this.setXYChannels(encoding);
		return encoding;
	}

	public createMark(markType: string): XMarkDef {
		let factory = VegazooFactory.eINSTANCE;
		let mark = factory.createMarkDef();
		mark.setType(markType);
		return mark;
	}

	public createBinParams(maxbins: number): XBinParams {
		let factory = VegazooFactory.eINSTANCE;
		let params = factory.createBinParams();
		params.setMaxbins(maxbins);
		return params;
	}

	public createSort(value: string): XSort {
		let factory = VegazooFactory.eINSTANCE;
		let sort = factory.createSort();
		sort.setValue(value);
		return sort;
	}

	public createViewConfig(stroke: string): XViewConfig {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createViewConfig();
		config.setStroke(stroke);
		return config;
	}

	public createMarkConfig(baseline: string): XMarkConfig {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createMarkConfig();
		config.setBaseline(baseline);
		return config;
	}

	public createAxisConfig(domain: boolean, title: string): XAxisConfig {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createAxisConfig();
		config.setTitle(title);
		config.setDomain(domain);
		return config;
	}

	public createLegendConfigOrient(orient: string): XLegendConfig {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createLegendConfig();
		config.setOrient(orient);
		return config;
	}

	public createLegendConfigDisable(): XLegendConfig {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createLegendConfig();
		config.setDisable(true);
		return config;
	}

	public createAlign(value: string): XAlign {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createAlign();
		config.setValue(value);
		return config;
	}

	public createNumber(value: number): XNumberDef {
		let factory = VegazooFactory.eINSTANCE;
		let config = factory.createNumberDef();
		config.setValue(value);
		return config;
	}

	public createSequenceGenerator(start: number, stop: number, step: number, as: string): XSequenceGenerator {
		let factory = VegazooFactory.eINSTANCE;
		let generator = factory.createSequenceGenerator();
		let params = this.createSequenceParams(start, stop, step, as);
		generator.setSequence(params);
		return generator;
	}

	public createSequenceParams(start: number, stop: number, step: number, as: string): XSequenceParams {
		let factory = VegazooFactory.eINSTANCE;
		let params = factory.createSequenceParams();
		params.setStart(start);
		params.setStop(stop);
		params.setStep(step);
		params.setAs(as);
		return params;
	}

	public createCalculateTransform(calculate: string, as: string): XCalculateTransform {
		let factory = VegazooFactory.eINSTANCE;
		let transform = factory.createCalculateTransform();
		transform.setCalculate(calculate);
		transform.setAs(as);
		return transform;
	}

	public createRegressionTransform(method: string, regression: string, on: string): XRegressionTransform {
		let factory = VegazooFactory.eINSTANCE;
		let transform = factory.createRegressionTransform();
		transform.setMethod(method);
		transform.setRegression(regression);
		transform.setOn(on);
		return transform;
	}

	public createWindowTransform(op: string, as: string): XWindowTransform {
		let factory = VegazooFactory.eINSTANCE;
		let transform = factory.createWindowTransform();
		let list = transform.getWindow();
		let fieldDef = factory.createWindowFieldDef();
		fieldDef.setOp(op);
		fieldDef.setAs(as);
		list.add(fieldDef);
		return transform;
	}

	public createFoldTransform(names: string[]): XFoldTransform {
		let factory = VegazooFactory.eINSTANCE;
		let transform = factory.createFoldTransform();
		let fold = transform.getFold();
		for (let name of names) {
			let fieldName = factory.createFieldName();
			fieldName.setValue(name);
			fold.add(fieldName);
		}
		return transform;
	}

	public createJoinAggregateTransform(): XJoinAggregateTransform {
		let factory = VegazooFactory.eINSTANCE;
		let transform = factory.createJoinAggregateTransform();
		return transform;
	}

	public addJoinAggregateFieldDef(transform: XJoinAggregateTransform, op: string, field: string, as: string): void {
		let factory = VegazooFactory.eINSTANCE;
		let fieldDef = factory.createJoinAggregateFieldDef();
		fieldDef.setOp(op);
		fieldDef.setField(field);
		fieldDef.setAs(as);
		let aggregate = transform.getJoinaggregate();
		aggregate.add(fieldDef);
	}

	public setJoinAggregateGroupBy(transform: XJoinAggregateTransform, names: string[]): void {
		let factory = VegazooFactory.eINSTANCE;
		let group = transform.getGroupby();
		for (let name of names) {
			let fieldName = factory.createFieldName();
			fieldName.setValue(name);
			group.add(fieldName);
		}
	}

}

VegazooCreator.eINSTANCE = new VegazooCreator();
