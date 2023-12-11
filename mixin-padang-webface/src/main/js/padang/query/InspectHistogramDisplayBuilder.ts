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
import XLet from "sleman/model/XLet";

import QueryBuilder from "padang/query/QueryBuilder";
import DisplayBuilder from "padang/query/DisplayBuilder";
import HistogramQuery from "padang/query/HistogramQuery";
import HistogramBuilder from "padang/query/HistogramBuilder";

import Histogram from "padang/functions/stat/Histogram";

import FromDataset from "padang/functions/source/FromDataset";

import SelectColumns from "padang/functions/dataset/SelectColumns";

export default class InspectHistogramDisplayBuilder implements HistogramQuery {

	private static EDGES = "edges";
	private static DEFAULT_DATASET = "defaultDataset";
	private static DEFAULT_COLUMN = "defaultColumn";
	private static DEFAULT_HISTOGRAM = "defaultHistogram";

	private queryBuilder: QueryBuilder = null;
	private displayBuilder: DisplayBuilder = null;
	private histogramBuilder: HistogramBuilder = null;

	constructor(display?: boolean) {
		this.prepareQueryBuilder();
		this.prepareDefault();
		this.prepareDisplayBuilder(display);
		this.prepareHistogramBuilder();
	}

	private prepareQueryBuilder(): void {
		this.queryBuilder = new QueryBuilder();
		this.queryBuilder.prepareFromRowsColumns();
	}

	private prepareDefault(): void {
		this.prepareDefaultDataset();
		this.prepareDefaultColumn();
		this.prepareDefaultHistogram();
	}

	private prepareDisplayBuilder(display?: boolean): void {
		this.displayBuilder = new DisplayBuilder(this.queryBuilder, display);
	}

	private prepareHistogramBuilder(): void {
		this.histogramBuilder = new HistogramBuilder(this.queryBuilder);
		this.histogramBuilder.prepareHistogram();
		this.extendPrepareHistogram();
		this.histogramBuilder.setResult(HistogramBuilder.HISTOGRAM);
	}

	private prepareDefaultDataset(): void {
		this.queryBuilder.addCallVariable(
			InspectHistogramDisplayBuilder.DEFAULT_DATASET,
			FromDataset.FUNCTION_NAME, 0);
	}

	private prepareDefaultColumn(): void {
		let call = this.queryBuilder.addCallVariable(
			InspectHistogramDisplayBuilder.DEFAULT_COLUMN,
			SelectColumns.FUNCTION_NAME, 1);
		this.queryBuilder.addPointerArgument(call,
			InspectHistogramDisplayBuilder.DEFAULT_DATASET);
		this.queryBuilder.addListArgument(call);
	}

	private prepareDefaultHistogram(): void {
		let call = this.queryBuilder.addCallVariable(
			InspectHistogramDisplayBuilder.DEFAULT_HISTOGRAM,
			Histogram.FUNCTION_NAME, 2);
		this.queryBuilder.addPointerArgument(call,
			InspectHistogramDisplayBuilder.DEFAULT_COLUMN);
	}

	protected extendPrepareHistogram(): void {
		let call = this.queryBuilder.getVariableCall(HistogramBuilder.HISTOGRAM);
		let edges = this.queryBuilder.createMember(
			InspectHistogramDisplayBuilder.DEFAULT_HISTOGRAM,
			InspectHistogramDisplayBuilder.EDGES);
		this.queryBuilder.addArgument(call, [edges]);
	}

	public fromDataset(name: string): void {
		this.displayBuilder.fromDataset(name);
		let call = this.queryBuilder.getVariableCall(InspectHistogramDisplayBuilder.DEFAULT_DATASET);
		this.queryBuilder.setFirstReferenceArgument(call, name);
		this.queryBuilder.addLogicalArgument(call, false);
	}

	public fromPreparation(index: number): void {
		this.displayBuilder.fromPreparation(index);
		let call = this.queryBuilder.getVariableCall(InspectHistogramDisplayBuilder.DEFAULT_DATASET);
		this.displayBuilder.changeToPreparation(call, index);
		let argument = this.queryBuilder.getLogicalArgument(call, 1);
		argument.setValue(false);
	}

	public selectColumn(column: string): void {
		this.queryBuilder.selectColumn(column);
		this.queryBuilder.addColumn(InspectHistogramDisplayBuilder.DEFAULT_COLUMN, column);
	}

	public buildLet(): XLet {
		return this.displayBuilder.build();
	}

}
