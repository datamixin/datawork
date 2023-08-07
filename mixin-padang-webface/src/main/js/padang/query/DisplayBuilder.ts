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
import XCall from "sleman/model/XCall";

import QueryBuilder from "padang/query/QueryBuilder";

import FromPreparation from "padang/functions/source/FromPreparation";

export default class DisplayBuilder {

	private display: boolean = false;
	private builder: QueryBuilder = null;

	constructor(builder: QueryBuilder, display?: boolean) {
		this.builder = builder;
		this.display = display === undefined ? false : display;
	}

	public setLet(expression: XLet): void {
		this.builder.setLet(expression);
	}

	public fromDataset(name: string): void {
		this.builder.fromDataset(name);
		let call = this.builder.getVariableCall(QueryBuilder.DATASET);
		this.builder.addLogicalArgument(call, this.display);
	}

	public fromPreparation(index: number): void {
		let call = this.builder.getVariableCall(QueryBuilder.DATASET);
		this.changeToPreparation(call, index);
	}

	public changeToPreparation(call: XCall, index: number): void {
		this.builder.setCallee(call, FromPreparation.FUNCTION_NAME);
		this.builder.setFirstNumberArgument(call, index);
		this.builder.addLogicalArgument(call, this.display);
	}

	public selectColumn(column: string): void {
		this.builder.selectColumn(column);
	}

	public build(): XLet {
		this.builder.confirmEliminateRows(QueryBuilder.COLUMNS);
		return this.builder.build();
	}

}
