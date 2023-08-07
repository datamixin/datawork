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
import AssignedPlan from "webface/plan/AssignedPlan";

import { jsonLeanFactory } from "webface/constants";

export default class AnyPlan extends AssignedPlan {

	public static LEAN_NAME = "AnyPlan";

	private literal: string = null

	constructor(literal?: string) {
		super(AnyPlan.LEAN_NAME);
		this.literal = literal === undefined ? null : literal;
	}

	public getLiteral(): string {
		return this.literal;
	}

}

jsonLeanFactory.register(AnyPlan.LEAN_NAME, AnyPlan);
