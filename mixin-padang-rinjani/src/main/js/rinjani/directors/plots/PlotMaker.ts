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
import Point from "webface/graphics/Point";

import EFeature from "webface/model/EFeature";

import * as functions from "webface/functions";

import VisageType from "bekasi/visage/VisageType";
import VisageList from "bekasi/visage/VisageList";
import VisageTable from "bekasi/visage/VisageTable";

import XMarkDef from "vegazoo/model/XMarkDef";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XVegalite from "vegazoo/model/XVegalite";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import VegazooCreator from "vegazoo/model/VegazooCreator";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XJoinAggregateTransform from "vegazoo/model/XJoinAggregateTransform";

import * as constants from "vegazoo/constants";

import XLegend from "vegazoo/model/XLegend";
import XFieldDef from "vegazoo/model/XFieldDef";
import XViewSpec from "vegazoo/model/XViewSpec";
import XColorDef from "vegazoo/model/XColorDef";
import XNumberDef from "vegazoo/model/XNumberDef";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XBinParams from "vegazoo/model/XBinParams";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XLegendConfig from "vegazoo/model/XLegendConfig";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionValueDef from "vegazoo/model/XPositionValueDef";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XFieldDefWithoutScale from "vegazoo/model/XFieldDefWithoutScale";

import CSVDataset from "vegazoo/utils/CSVDataset";

import ArcTemplate from "vegazoo/directors/templates/ArcTemplate";
import BarTemplate from "vegazoo/directors/templates/BarTemplate";
import RectTemplate from "vegazoo/directors/templates/RectTemplate";
import LineTemplate from "vegazoo/directors/templates/LineTemplate";
import TextTemplate from "vegazoo/directors/templates/TextTemplate";
import RuleTemplate from "vegazoo/directors/templates/RuleTemplate";
import BoxplotTemplate from "vegazoo/directors/templates/BoxplotTemplate";
import ScatterTemplate from "vegazoo/directors/templates/ScatterTemplate";

import ModelConverter from "vegazoo/directors/converters/ModelConverter";

import BaseMaker from "rinjani/directors/plots/BaseMaker";

export default class PlotMaker extends BaseMaker {

	private creator: VegazooCreator = null;

	constructor() {
		super();
		this.creator = VegazooCreator.eINSTANCE;
	}

	public getEncodedColumn(column: string): string {
		return btoa(column);
	}

	public createBinParams(maxbins: number): XBinParams {
		let creator = VegazooCreator.eINSTANCE;
		return creator.createBinParams(maxbins);
	}

	public createBarTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(BarTemplate.MARK_TYPE);
	}

	public createArcTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(ArcTemplate.MARK_TYPE);
	}

	public createBoxplotTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(BoxplotTemplate.MARK_TYPE);
	}

	public createScatterTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(ScatterTemplate.MARK_TYPE);
	}

	public createRectTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(RectTemplate.MARK_TYPE);
	}

	public createTextTopLevelUnitSpec(): XTopLevelUnitSpec {
		return this.createTopLevelUnitSpec(TextTemplate.MARK_TYPE);
	}

	public createTopLevelUnitSpec(type: string): XTopLevelUnitSpec {
		let outlook = this.creator.createOutlook(type);
		let vegalite = <XVegalite>outlook.getViewlet();
		return <XTopLevelUnitSpec>vegalite.getSpec();
	}

	public createTopLevelLayerSpec(namedData?: boolean): XTopLevelLayerSpec {
		let outlook = this.creator.createOutlookVegaliteTopLevelSpec();
		return this.creator.createTopLevelLayerSpec(outlook, namedData);
	}

	public createTopLevelVConcatSpec(): XTopLevelVConcatSpec {
		let outlook = this.creator.createOutlookVegaliteTopLevelSpec();
		return this.creator.createTopLevelVConcatSpec(outlook);
	}

	public createTopLevelHConcatSpec(): XTopLevelHConcatSpec {
		let outlook = this.creator.createOutlookVegaliteTopLevelSpec();
		return this.creator.createTopLevelHConcatSpec(outlook);
	}

	public adjustSize(spec: XLayerSpec | XFacetedUnitSpec | XTopLevelUnitSpec | XTopLevelLayerSpec,
		size: Point): void {
		if (size.x > 0) {
			let width = new XNumberDef(size.x);
			spec.setWidth(width);
		}
		if (size.y > 0) {
			let height = new XNumberDef(size.y);
			spec.setHeight(height);
		}
	}

	public adjustTopLevelSizeWithSpace(spec: XTopLevelUnitSpec | XTopLevelLayerSpec,
		size: Point, xSpace: number, ySpace: number): void {
		if (size.x > 0) {
			xSpace += ModelConverter.PADDING_LEFT + ModelConverter.PADDING_RIGHT;
			ySpace += ModelConverter.PADDING_TOP + ModelConverter.PADDING_BOTTOM;
			let width = new XNumberDef(size.x - xSpace);
			spec.setWidth(width);
		}
		if (size.y > 0) {
			let height = new XNumberDef(size.y - ySpace);
			spec.setHeight(height);
		}
	}

	public setInlineDataEmpty(spec: XUnitSpec | XTopLevelUnitSpec): void {
		let data = this.creator.createInlineDataEmpty();
		spec.setData(data);
	}

	public addLineUnitSpecLayer(spec: XTopLevelLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, LineTemplate.MARK_TYPE);
	}

	public addScatterUnitSpecLayer(spec: XTopLevelLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, ScatterTemplate.MARK_TYPE);
	}

	public addBarUnitSpecLayer(spec: XLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, BarTemplate.MARK_TYPE);
	}

	public addArcUnitSpecLayer(spec: XLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, ArcTemplate.MARK_TYPE);
	}

	public addTextUnitSpecLayer(spec: XTopLevelLayerSpec | XLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, TextTemplate.MARK_TYPE);
	}

	public addTextUnitSpecVConcat(spec: XTopLevelVConcatSpec): XUnitSpec {
		return this.creator.addUnitSpecVConcat(spec, false, TextTemplate.MARK_TYPE);
	}

	public addBarFacetedUnitSpecHConcat(spec: XTopLevelHConcatSpec): XFacetedUnitSpec {
		return this.creator.addFacetedUnitSpecHConcat(spec, false, BarTemplate.MARK_TYPE);
	}

	public addArcFacetedUnitSpecHConcat(spec: XTopLevelHConcatSpec): XFacetedUnitSpec {
		return this.creator.addFacetedUnitSpecHConcat(spec, false, ArcTemplate.MARK_TYPE);
	}

	public addScatterFacetedUnitSpecHConcat(spec: XTopLevelHConcatSpec): XFacetedUnitSpec {
		return this.creator.addFacetedUnitSpecHConcat(spec, false, ScatterTemplate.MARK_TYPE);
	}

	public addLayerSpecHConcat(spec: XTopLevelHConcatSpec): XLayerSpec {
		return this.creator.addLayerSpecHConcat(spec);
	}

	public addRuleUnitSpecLayer(spec: XTopLevelLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, RuleTemplate.MARK_TYPE);
	}

	public addRectUnitSpecLayer(spec: XTopLevelLayerSpec | XLayerSpec): XUnitSpec {
		return this.creator.addUnitSpecLayer(spec, false, RectTemplate.MARK_TYPE);
	}

	public addHConcatSpecVConcat(spec: XTopLevelVConcatSpec): XHConcatSpec {
		return this.creator.addHConcatSpecVConcat(spec);
	}

	public createLayerSpecHConcat(spec: XTopLevelHConcatSpec | XHConcatSpec): XLayerSpec {
		return this.creator.addLayerSpecHConcat(spec);
	}

	public setWidthEqualHeight(spec: XTopLevelLayerSpec | XTopLevelUnitSpec): void {
		let widthNumber = <XNumberDef>spec.getWidth();
		let heightNumber = <XNumberDef>spec.getHeight();
		let height = heightNumber.getValue();
		widthNumber.setValue(height);
	}

	public setCSVDatasetFromRowList(unitSpec: XUnitSpec, rowList: VisageList, columns: string[]): void {
		let data = this.creator.createCSVFormatData();
		unitSpec.setData(data);
		let dataset = new CSVDataset();
		for (let element of rowList.getValues()) {
			let values = (<VisageList>element).toArray();
			dataset.append(values);
		}
		dataset.setHeaders(columns);
		let values = dataset.toString();
		data.setValues(values);
	}

	public setCSVDatasetFromTable(unitSpec: XViewSpec | XTopLevelSpec, table: VisageTable): void {
		let data = this.creator.createCSVFormatData();
		unitSpec.setData(data);
		let dataset = new CSVDataset();
		for (let i = 0; i < table.recordCount(); i++) {
			let record = table.getRecord(i);
			let values: any[] = [];
			for (let j = 0; j < record.size(); j++) {
				let value = record.getValue(j);
				values.push(value);
			}
			dataset.append(values);
		}

		// Headers
		let names = this.getTableColumnNames(table);
		dataset.setHeaders(names);

		// Values
		let values = dataset.toString();
		data.setValues(values);

		// Types
		let columns = table.getColumns();
		let format = data.getFormat();
		let parse = format.getParse();
		for (let column of columns) {
			let name = column.getKey();
			let type = column.getType();
			if (type !== null && VisageType.isNumeric(type)) {
				parse.put(name, constants.DataType.NUMBER);
			}
		}
	}

	public addXFieldDef(unitSpec: XUnitSpec | XLayerSpec | XTopLevelUnitSpec | XTopLevelLayerSpec, name: string): XPositionFieldDef {
		let field = this.createPositionFieldDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setX(field);
		return field;
	}

	public addYFieldDef(unitSpec: XUnitSpec | XLayerSpec | XTopLevelUnitSpec | XTopLevelLayerSpec, name: string): XPositionFieldDef {
		let field = this.createPositionFieldDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setY(field);
		return field;
	}

	public addColorFieldDef(unitSpec: XUnitSpec | XTopLevelUnitSpec, name: string): XColorDef {
		let field = this.createColorDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setColor(field);
		return field;
	}

	public addTextFieldDef(unitSpec: XUnitSpec | XTopLevelUnitSpec, name: string): XPositionFieldDef {
		let field = this.createPositionFieldDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setText(field);
		return field;
	}

	public addOrderFieldDef(unitSpec: XUnitSpec, name: string): XPositionFieldDef {
		let field = this.createPositionFieldDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setOrder(field);
		return field;
	}

	public addDetailFieldDef(unitSpec: XUnitSpec, name: string): XFieldDefWithoutScale {
		let field = this.createFieldDefWithoutScale(name);
		let encoding = unitSpec.getEncoding();
		encoding.setDetail(field);
		return field;
	}

	public addOpacityFieldDef(unitSpec: XUnitSpec, value: number): XPositionValueDef {
		let field = this.createPositionValueDef(value);
		let encoding = unitSpec.getEncoding();
		encoding.setOpacity(field);
		return field;
	}

	public createPositionFieldDef(name: string): XPositionFieldDef {
		let field = this.creator.createPositionFieldDef();
		field.setField(btoa(name));
		return field;
	}

	public createColorDef(name: string): XColorDef {
		let field = this.creator.createColorDef();
		field.setField(btoa(name));
		return field;
	}

	public createLegendLabelExpr(expr: string): XLegend {
		let legend = this.creator.createLegend();
		legend.setLabelExpr(expr);
		return legend;
	}

	public createFieldDefWithoutScale(name: string): XFieldDefWithoutScale {
		let field = this.creator.createFieldDefWithoutScale();
		field.setField(btoa(name));
		return field;
	}

	public createColorFieldDef(unitSpec: XUnitSpec, name: string): XColorDef {
		let field = this.createColorDef(name);
		let encoding = unitSpec.getEncoding();
		encoding.setColor(field);
		return field;
	}

	public createPositionValueDef(value: number): XPositionValueDef {
		let field = this.creator.createPositionValueDef(value);
		field.setValue(value);
		return field;
	}

	public setFieldSortNull(fieldDef: XPositionFieldDef): void {
		fieldDef.setSort(constants.NULL);
	}

	public setFieldTitleNull(fieldDef: XPositionFieldDef): void {
		fieldDef.setTitle(constants.NULL);
	}

	public setFieldTypeQuantitative(fieldDef: XFieldDef): void {
		fieldDef.setType(constants.StandardType.QUANTITATIVE);
	}

	public setFieldTypeNominal(fieldDef: XFieldDef): void {
		fieldDef.setType(constants.StandardType.NOMINAL);
	}

	public setFieldScaleSchemaDomain(fieldDef: XPositionFieldDef,
		schema: string, min: number, max: number): void {
		let scale = this.creator.createScaleSchemaDomain(schema, min, max);
		fieldDef.setScale(scale);
	}

	public setFieldScaleRangeDomain(fieldDef: XPositionFieldDef | XColorDef,
		range: string[], min: number, max: number): void {
		let scale = this.creator.createScaleRangeDomain(range, min, max);
		fieldDef.setScale(scale);
	}

	public setFieldScaleZero(fieldDef: XPositionFieldDef, zero: boolean): void {
		let scale = this.creator.createScaleZero(zero);
		fieldDef.setScale(scale);
	}

	public setFieldAxisNull(fieldDef: XPositionFieldDef): void {
		fieldDef.setAxis(constants.NULL);
	}

	public setFieldAggregateMin(fieldDef: XPositionFieldDef): void {
		fieldDef.setAggregate(constants.AggregateOp.MIN);
	}

	public setFieldAggregateMax(fieldDef: XPositionFieldDef): void {
		fieldDef.setAggregate(constants.AggregateOp.MAX);
	}

	public addTransformRegression(unit: XUnitSpec | XTopLevelSpec,
		method: string, regression: string, on: string): void {
		let transform = unit.getTransform();
		let step = this.creator.createRegressionTransform(method, regression, on);
		transform.add(step);
	}

	public addTransformCalculate(unit: XUnitSpec | XTopLevelSpec, calculate: string, as: string): void {
		let transform = unit.getTransform();
		let step = this.creator.createCalculateTransform(calculate, as);
		transform.add(step);
	}

	public addTransformWindow(unit: XUnitSpec | XTopLevelSpec, calculate: string, as: string): void {
		let step = this.creator.createWindowTransform(calculate, as);
		let transform = unit.getTransform();
		transform.add(step);
	}

	public addTransformFold(unit: XUnitSpec | XTopLevelSpec, fields: string[]): void {
		let fold = this.creator.createFoldTransform(fields);
		let transform = unit.getTransform();
		transform.add(fold);
	}

	public addTransformJoinAggregate(unit: XUnitSpec | XTopLevelSpec): XJoinAggregateTransform {
		let item = this.creator.createJoinAggregateTransform();
		let transform = unit.getTransform();
		transform.add(item);
		return item;
	}

	public setMarkExprRef(mark: XMarkDef, feature: EFeature, expr: string): void {
		let ref = this.creator.createExrpRef(expr);
		mark.eSet(feature, ref);
	}

	public setMarkAlignExpr(mark: XMarkDef, expr: string): void {
		this.setMarkExprRef(mark, XMarkDef.FEATURE_ALIGN, expr);
	}

	public setMarkDxExpr(mark: XMarkDef, expr: string): void {
		this.setMarkExprRef(mark, XMarkDef.FEATURE_DX, expr);
	}

	public setMarkDyExpr(mark: XMarkDef, expr: string): void {
		this.setMarkExprRef(mark, XMarkDef.FEATURE_DY, expr);
	}

	public createLegendConfigOrient(orient: string): XLegendConfig {
		return this.creator.createLegendConfigOrient(orient);
	}

	public createLegendConfigDisable(): XLegendConfig {
		return this.creator.createLegendConfigDisable();
	}

	public format(value: number, pattern: string): string {
		return functions.formatNumber(value, pattern)
	}

}
