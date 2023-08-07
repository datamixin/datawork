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
import XLet from "sleman/model/XLet";

import HistogramQuery from "padang/query/HistogramQuery";

import QueryBuilder from "padang/query/QueryBuilder";
import DisplayQuery from "padang/query/DisplayQuery";
import DisplayBuilder from "padang/query/DisplayBuilder";
import HistogramBuilder from "padang/query/HistogramBuilder";

export default class HistogramDisplayBuilder implements HistogramQuery, DisplayQuery {

	private queryBuilder: QueryBuilder = null;
	private displayBuilder: DisplayBuilder = null;
	private histogramBuilder: HistogramBuilder = null;

	constructor(display?: boolean) {
		this.prepareQueryBuilder();
		this.prepareDisplayBuilder(display);
		this.prepareHistogramBuilder();
	}

	private prepareQueryBuilder(): void {
		this.queryBuilder = new QueryBuilder();
		this.queryBuilder.prepareFromRowsColumns();
	}

	private prepareDisplayBuilder(display?: boolean): void {
		this.displayBuilder = new DisplayBuilder(this.queryBuilder, display);
	}

	private prepareHistogramBuilder(): void {
		this.histogramBuilder = new HistogramBuilder(this.queryBuilder);
		this.histogramBuilder.prepareHistogram();
		this.histogramBuilder.setResult(HistogramBuilder.HISTOGRAM);
	}

	public prepareHistogram(): void {
		this.histogramBuilder.prepareHistogram();
	}

	public fromDataset(name: string): void {
		this.displayBuilder.fromDataset(name);
	}

	public fromPreparation(index: number): void {
		this.displayBuilder.fromPreparation(index);
	}

	public selectColumn(column: string): void {
		this.queryBuilder.selectColumn(column);
	}

	public buildLet(): XLet {
		return this.displayBuilder.build();
	}

}
