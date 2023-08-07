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
import AnyPlan from "webface/plan/AnyPlan";
import MapPlan from "webface/plan/MapPlan";
import ListPlan from "webface/plan/ListPlan";
import TextPlan from "webface/plan/TextPlan";
import NumberPlan from "webface/plan/NumberPlan";
import SwitchPlan from "webface/plan/SwitchPlan";
import EntityPlan from "webface/plan/EntityPlan";
import LogicalPlan from "webface/plan/LogicalPlan";
import PointerPlan from "webface/plan/PointerPlan";
import AssignedPlan from "webface/plan/AssignedPlan";
import QualifiedPlan from "webface/plan/QualifiedPlan";

import ObjectMap from "webface/util/ObjectMap";

import Creator from "sleman/creator/Creator";
import MapCreator from "sleman/creator/MapCreator";
import ListCreator from "sleman/creator/ListCreator";
import TextCreator from "sleman/creator/TextCreator";
import NumberCreator from "sleman/creator/NumberCreator";
import SwitchCreator from "sleman/creator/SwitchCreator";
import EntityCreator from "sleman/creator/EntityCreator";
import LogicalCreator from "sleman/creator/LogicalCreator";
import PointerCreator from "sleman/creator/PointerCreator";
import QualifiedCreator from "sleman/creator/QualifiedCreator";

import { setInstance } from "sleman/creator/CreatorFactory";
import { CreatorFactory } from "sleman/creator/CreatorFactory";

import XExpression from "sleman/model/XExpression";

import ExpressionParser from "sleman/base/ExpressionParser";

class BasicCreatorFactory implements CreatorFactory {

	private map = new ObjectMap<any>();

	constructor() {
		this.map.put(MapPlan.LEAN_NAME, MapCreator);
		this.map.put(ListPlan.LEAN_NAME, ListCreator);
		this.map.put(TextPlan.LEAN_NAME, TextCreator);
		this.map.put(NumberPlan.LEAN_NAME, NumberCreator);
		this.map.put(EntityPlan.LEAN_NAME, EntityCreator);
		this.map.put(SwitchPlan.LEAN_NAME, SwitchCreator);
		this.map.put(LogicalPlan.LEAN_NAME, LogicalCreator);
		this.map.put(PointerPlan.LEAN_NAME, PointerCreator);
		this.map.put(QualifiedPlan.LEAN_NAME, QualifiedCreator);
	}

	public getRegistered(plan: AssignedPlan): Creator {
		let beanName = plan.xLeanName();
		let creatorType = this.map.get(beanName);
		let creator = <Creator>(new creatorType(plan));
		return creator;
	}

	public createDefaultValue(plan: AssignedPlan): XExpression {
		if (plan instanceof AnyPlan) {
			let literal = plan.getLiteral();
			let parser = new ExpressionParser(literal);
			return <XExpression>parser.getExpression();
		}
		let creator = this.getRegistered(plan);
		return creator.createDefault();
	}

}

setInstance(new BasicCreatorFactory());
