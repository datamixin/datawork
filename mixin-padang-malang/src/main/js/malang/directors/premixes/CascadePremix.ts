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
import Premix from "malang/directors/premixes/Premix";
import PremixRegistry from "malang/directors/premixes/PremixRegistry";

import XCascadeResult from "malang/model/XCascadeResult";
import MalangCreator from "malang/model/MalangCreator";

import CascadeResultPlan from "malang/plan/CascadeResultPlan";

export default class CascadePremix extends Premix {

	public createResult(plan: CascadeResultPlan): XCascadeResult {

		let creator = MalangCreator.eINSTANCE;
		let result = creator.createCascadeResult();

		let layout = plan.getLayout();
		result.setLayout(layout);

		let children = plan.getResults();
		let results = result.getResults();
		for (let child of children) {
			let leanName = child.xLeanName();
			let premix = registry.get(leanName);
			let nested = premix.createResult(child);
			results.add(nested);
		}

		return result;
	}

}

let registry = PremixRegistry.getInstance();
registry.register(CascadeResultPlan.LEAN_NAME, new CascadePremix())