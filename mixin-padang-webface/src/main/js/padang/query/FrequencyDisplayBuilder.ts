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
import XExpression from "sleman/model/XExpression";

import SummaryQuery from "padang/query/SummaryQuery";
import QueryBuilder from "padang/query/QueryBuilder";
import DisplayQuery from "padang/query/DisplayQuery";
import DisplayBuilder from "padang/query/DisplayBuilder";
import SummaryBuilder from "padang/query/SummaryBuilder";

export default class FrequencyDisplayBuilder implements SummaryQuery, DisplayQuery {

	private queryBuilder: QueryBuilder = null;
	private displayBuilder: DisplayBuilder = null;
	private summaryBuilder: SummaryBuilder = null;

	constructor(display?: boolean) {
		this.prepareQueryBuilder();
		this.prepareDisplayBuilder(display);
		this.prepareSummaryBuilder();
	}

	private prepareQueryBuilder(): void {
		this.queryBuilder = new QueryBuilder();
		this.queryBuilder.prepareFromRowsColumns();
	}

	private prepareDisplayBuilder(display?: boolean): void {
		this.displayBuilder = new DisplayBuilder(this.queryBuilder, display);
	}

	private prepareSummaryBuilder(): void {
		this.summaryBuilder = new SummaryBuilder(this.queryBuilder);
		this.summaryBuilder.prepareGroupRows();
		this.summaryBuilder.prepareSortRows();
		this.summaryBuilder.prepareFirstRows();
		this.summaryBuilder.prepareNullsValue();
		this.summaryBuilder.prepareNullsGroup();
		this.summaryBuilder.prepareDistinctCount();
		this.summaryBuilder.prepareDistinctDataset();
		this.summaryBuilder.prepareUnionRows();
		this.summaryBuilder.setResult(SummaryBuilder.UNION);
	}

	public fromDataset(name: string): void {
		this.displayBuilder.fromDataset(name);
	}

	public fromPreparation(index: number): void {
		this.displayBuilder.fromPreparation(index);
	}

	public selectRows(condition: XExpression): void {
		this.summaryBuilder.selectRows(condition);
	}

	public selectColumnValue(value: XExpression, alias: string): void {
		this.summaryBuilder.selectColumnValue(value, alias);
	}

	public groupKeys(keys: string[]): void {
		this.summaryBuilder.groupKeys(keys);
	}

	public groupValue(column: any, aggregate: string): void {
		this.summaryBuilder.groupValue(column, aggregate);
	}

	public groupValueCountAll(): void {
		this.summaryBuilder.groupValueCountAll();
	}

	public sortRows(column: string, ascending?: boolean): void {
		this.summaryBuilder.sortRows(column, ascending);
	}

	public firstRows(count: number): void {
		this.summaryBuilder.firstRows(count);
	}

	public selectNullsValue(column: string): void {
		this.summaryBuilder.selectNullsValue(column);
	}

	public selectNullsGroup(column: string): void {
		this.summaryBuilder.selectNullsGroup(column);
	}

	public createDistinctDataset(column: string): void {
		this.summaryBuilder.createDistinctDataset(column);
	}

	public buildLet(): XLet {
		return this.displayBuilder.build();
	}

}

