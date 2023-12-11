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
import Command from "webface/wef/Command";

import { AggregateOp } from "vegazoo/constants";
import XFieldDef from "vegazoo/model/XFieldDef";

export default class FieldDefAggregateSetCommand extends Command {

	private positionFieldDef: XFieldDef = null;
	private oldAggregate: AggregateOp = null;
	private newAggregate: AggregateOp = null;

	public setFieldDef(positionFieldDef: XFieldDef): void {
		this.positionFieldDef = positionFieldDef;
	}

	public setAggregate(type: AggregateOp): void {
		this.newAggregate = type;
	}

	public execute(): void {
		this.oldAggregate = this.positionFieldDef.getAggregate();
		this.positionFieldDef.setAggregate(this.newAggregate);
	}

	public undo(): void {
		this.positionFieldDef.setAggregate(this.oldAggregate);
	}

	public redo(): void {
		this.positionFieldDef.setAggregate(this.newAggregate);
	}

}