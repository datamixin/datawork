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
package com.andia.mixin.plan;

import com.andia.mixin.value.MixinType;

public class PlanUtils {

	private PlanUtils() {

	}

	public static TextPlan createTextPlan() {
		return new TextPlan();
	}

	public static TextPlan createTextPlan(String defaultValue) {
		return new TextPlan(defaultValue);
	}

	public static NumberPlan createNumberPlan() {
		return new NumberPlan();
	}

	public static NumberPlan createNumberPlan(Number defaultValue) {
		return new NumberPlan(defaultValue);
	}

	public static LogicalPlan createLogicalPlan() {
		return new LogicalPlan();
	}

	public static LogicalPlan createLogicalPlan(Boolean defaultValue) {
		return new LogicalPlan(defaultValue);
	}

	public static PointerPlan createPointerPlan() {
		return new PointerPlan();
	}

	public static ListPlan createListPlan(SpecifiedPlan elementPlan) {
		return new ListPlan(elementPlan);
	}

	public static ForeachPlan createForeachPlan(SpecifiedPlan expressionPlan) {
		return new ForeachPlan(expressionPlan);
	}

	public static MapPlan createMapPlan(SpecifiedPlan keyPlan, SpecifiedPlan valuePlan) {
		return new MapPlan(keyPlan, valuePlan);
	}

	public static EntityPlan createEntityPlan() {
		return new EntityPlan();
	}

	public static SwitchPlan createSwitchPlan() {
		return new SwitchPlan();
	}

	public static AnyPlan createValuePlan(MixinType type) {
		return new AnyPlan(type);
	}

	public static AnyPlan createTableValuePlan() {
		return new AnyPlan(MixinType.MIXINTABLE);
	}

}
