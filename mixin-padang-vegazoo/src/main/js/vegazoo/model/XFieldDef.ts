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
import EClass from "webface/model/EClass";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XSort from "vegazoo/model/XSort";
import * as model from "vegazoo/model/model";
import XTimeUnit from "vegazoo/model/XTimeUnit";
import XAnyOfDef from "vegazoo/model/XAnyOfDef";
import { AggregateOp } from "vegazoo/constants";
import { StandardType } from "vegazoo/constants";
import XObjectDef from "vegazoo/model/XObjectDef";
import XBooleanDef from "vegazoo/model/XBooleanDef";

export abstract class XFieldDef extends XObjectDef {

	public static XCLASSNAME: string = model.getEClassName("XFieldDef");

	public static FEATURE_FIELD = new EAttribute("field", EAttribute.STRING);
	public static FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
	public static FEATURE_AGGREGATE = new EAttribute("aggregate", EAttribute.STRING);
	public static FEATURE_SORT = new EReference("sort", XSort);
	public static FEATURE_TITLE = new EAttribute("title", EAttribute.STRING);
	public static FEATURE_FORMAT = new EReference("format", EAttribute.STRING);
	public static FEATURE_BIN = new EReference("bin", XBooleanDef);
	public static FEATURE_TIME_UNIT = new EReference("timeUnit", XTimeUnit);

	private field: string = null;
	private type: StandardType = null;
	private aggregate: AggregateOp = null;
	private sort: XSort = null;
	private title: string = null;
	private format: string = null;
	private bin: XAnyOfDef = null;
	private timeUnit: XTimeUnit = null;

	private static FEATURES = new Array<EFeature>(
		XFieldDef.FEATURE_FIELD,
		XFieldDef.FEATURE_TYPE,
		XFieldDef.FEATURE_AGGREGATE,
		XFieldDef.FEATURE_SORT,
		XFieldDef.FEATURE_TITLE,
		XFieldDef.FEATURE_FORMAT,
		XFieldDef.FEATURE_BIN,
		XFieldDef.FEATURE_TIME_UNIT,
	);

	constructor(xClass?: EClass, features?: EFeature[]) {
		super(
			xClass ? xClass : model.createEClass(XFieldDef.XCLASSNAME),
			features ? XFieldDef.FEATURES.concat(features) : XFieldDef.FEATURES
		);
	}

	public getField(): string {
		return this.field;
	}

	public setField(newField: string): void {
		let oldField = this.field;
		this.field = newField;
		this.eSetNotify(XFieldDef.FEATURE_FIELD, oldField, newField);
	}

	public getType(): StandardType {
		return this.type;
	}

	public setType(newType: StandardType) {
		let oldType = this.type;
		this.type = newType;
		this.eSetNotify(XFieldDef.FEATURE_TYPE, oldType, newType);
	}

	public getAggregate(): AggregateOp {
		return this.aggregate;
	}

	public setAggregate(newAggregate: AggregateOp): void {
		let oldAggregate = this.aggregate;
		this.aggregate = newAggregate;
		this.eSetNotify(XFieldDef.FEATURE_AGGREGATE, oldAggregate, newAggregate);
	}

	public getSort(): XSort {
		return this.sort;
	}

	public setSort(newSort: XSort): void {
		let oldSort = this.sort;
		this.sort = newSort;
		this.eSetNotify(XFieldDef.FEATURE_SORT, oldSort, newSort);
	}

	public getTitle(): string {
		return this.title;
	}

	public setTitle(newTitle: string): void {
		let oldTitle = this.title;
		this.title = newTitle;
		this.eSetNotify(XFieldDef.FEATURE_TITLE, oldTitle, newTitle);
	}

	public getFormat(): string {
		return this.format;
	}

	public setFormat(newFormat: string): void {
		let oldFormat = this.format;
		this.format = newFormat;
		this.eSetNotify(XFieldDef.FEATURE_FORMAT, oldFormat, newFormat);
	}

	public isBin(): XAnyOfDef {
		return this.bin;
	}

	public setBin(newBin: XAnyOfDef): void {
		let oldBin = this.bin;
		this.bin = newBin;
		this.eSetNotify(XFieldDef.FEATURE_BIN, oldBin, newBin);
	}

	public getTimeUnit(): XTimeUnit {
		return this.timeUnit;
	}

	public setTimeUnit(newTimeUnit: XTimeUnit): void {
		let oldTimeUnit = this.timeUnit;
		this.timeUnit = newTimeUnit;
		this.eSetNotify(XFieldDef.FEATURE_TIME_UNIT, oldTimeUnit, newTimeUnit);
	}

}

export default XFieldDef;