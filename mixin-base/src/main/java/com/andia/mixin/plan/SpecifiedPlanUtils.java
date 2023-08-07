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

public class SpecifiedPlanUtils {

	private SpecifiedPlanUtils() {

	}

	public static SpecifiedPlan createNumberPlan(String name) {
		NumberPlan plan = new NumberPlan();
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createNumberPlan(String name, Number defaultValue) {
		NumberPlan plan = new NumberPlan(defaultValue);
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createLogicalPlan(String name) {
		LogicalPlan plan = new LogicalPlan();
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createLogicalPlan(String name, Boolean defaultValue) {
		LogicalPlan plan = new LogicalPlan(defaultValue);
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createTextPlan(String name) {
		TextPlan plan = new TextPlan();
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createTextPlan(String name, String defaultValue) {
		TextPlan plan = new TextPlan(defaultValue);
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createPointerPlan(String name) {
		PointerPlan plan = new PointerPlan();
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createPlan(String name, AssignedPlan plan) {
		SpecifiedPlan qualifiedPlan = new SpecifiedPlan(name, plan);
		return qualifiedPlan;
	}

	public static SpecifiedPlan createValuePlan(String name, MixinType type) {
		AnyPlan plan = new AnyPlan(type);
		return createPlan(name, plan);
	}

	public static SpecifiedPlan createListPlan(String name, SpecifiedPlan elementPlan) {
		ListPlan plan = new ListPlan(elementPlan);
		return createPlan(name, plan);
	}

}
