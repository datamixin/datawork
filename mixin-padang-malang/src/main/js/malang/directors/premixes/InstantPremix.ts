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
import Premix from "malang/directors/premixes/Premix";
import PremixRegistry from "malang/directors/premixes/PremixRegistry";

import XInstantResult from "malang/model/XInstantResult";
import MalangCreator from "malang/model/MalangCreator";

import InstantResultPlan from "malang/plan/InstantResultPlan";

export default class InstantPremix extends Premix {

	public createResult(plan: InstantResultPlan): XInstantResult {
		let creator = MalangCreator.eINSTANCE;
		let preload = plan.getPreload();
		let width = plan.getRequiredWidth();
		let height = plan.getRequiredHeight();
		let result = creator.createInstantResult(preload, width, height);
		return result;

	}

}

let registry = PremixRegistry.getInstance();
registry.register(InstantResultPlan.LEAN_NAME, new InstantPremix())