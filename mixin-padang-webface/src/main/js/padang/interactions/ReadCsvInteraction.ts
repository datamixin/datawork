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
import ReadCsv from "padang/functions/source/ReadCsv";

import Interaction from "padang/interactions/Interaction";

import InteractionPlan from "padang/plan/InteractionPlan";
import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

export default class ReadCsvInteraction extends Interaction {

	constructor(
		public path: string,
		public delimiter: string,
		public firstRowHeader: boolean,
		public quoteCharacter: string,
	) {
		super(ReadCsv.FUNCTION_NAME);
	}

	public static getPlan(): InteractionPlan {
		let plan = new InteractionPlan(ReadCsv.getPlan(), 1);
		let list = plan.getParameterList();
		list.add(ReadCsv.PATH_PLAN);
		list.add(ReadCsv.DELIMITER_PLAN);
		list.add(ReadCsv.FIRST_ROW_HEADER_PLAN);
		list.add(ReadCsv.QUOTE_CHARACTER_PLAN);
		list.add(ReadCsv.PARSE_DATES_PLAN);
		return plan;
	}

}

let registry = InteractionPlanRegistry.getInstance();
registry.registerStarter(ReadCsvInteraction.getPlan());