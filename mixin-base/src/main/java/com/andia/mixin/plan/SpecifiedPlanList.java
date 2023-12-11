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
package com.andia.mixin.plan;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import com.andia.mixin.Lean;
import com.andia.mixin.value.MixinType;

public class SpecifiedPlanList extends Lean implements Iterable<SpecifiedPlan> {

	private final List<SpecifiedPlan> plans = new ArrayList<>();

	public SpecifiedPlanList() {
		super(SpecifiedPlanList.class);
	}

	public void addPlan(SpecifiedPlan plan) {
		plans.add(plan);
	}

	public SpecifiedPlan addPlan(String name, AssignedPlan plan) {
		SpecifiedPlan qualifiedPlan = new SpecifiedPlan(name, plan);
		plans.add(qualifiedPlan);
		return qualifiedPlan;
	}

	public SpecifiedPlan addPlan(String name, AssignedPlan plan, String label) {
		SpecifiedPlan qualifiedPlan = new SpecifiedPlan(name, plan);
		qualifiedPlan.setLabel(label);
		plans.add(qualifiedPlan);
		return qualifiedPlan;
	}

	public SpecifiedPlan addTextPlan(String name) {
		TextPlan plan = new TextPlan();
		return addPlan(name, plan);
	}

	public SpecifiedPlan addTextPlan(String name, String defaultValue) {
		TextPlan plan = new TextPlan(defaultValue);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addLogicalPlan(String name) {
		LogicalPlan plan = new LogicalPlan();
		return addPlan(name, plan);
	}

	public SpecifiedPlan addLogicalPlan(String name, boolean defaultValue) {
		LogicalPlan plan = new LogicalPlan(defaultValue);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addNumberPlan(String name) {
		NumberPlan plan = new NumberPlan();
		return addPlan(name, plan);
	}

	public SpecifiedPlan addNumberPlan(String name, Number defaultValue) {
		NumberPlan plan = new NumberPlan(defaultValue);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addPointerPlan(String name) {
		PointerPlan plan = new PointerPlan();
		return addPlan(name, plan);
	}

	public SpecifiedPlan addListPlan(String name, SpecifiedPlan element) {
		ListPlan plan = new ListPlan(element);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addDataTypeTextPlan(String name, String defaultValue) {

		StringBuffer buffer = new StringBuffer();
		buffer.append("=[");
		MixinType[] values = MixinType.values();
		for (int i = 0; i < values.length; i++) {
			MixinType type = values[i];
			buffer.append("'" + type.name() + "'");
			if (i < values.length - 1) {
				buffer.append(", ");
			}
		}
		buffer.append("]");

		TextPlan plan = new TextPlan(defaultValue);
		plan.setAssignable("=['" + MixinType.STRING.name() + "']");
		return addPlan(name, plan);
	}

	public SpecifiedPlan addListValuePlan(String name) {
		AnyPlan plan = new AnyPlan(MixinType.MIXINLIST);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addObjectValuePlan(String name) {
		AnyPlan plan = new AnyPlan(MixinType.MIXINOBJECT);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addBytesValuePlan(String name) {
		AnyPlan plan = new AnyPlan(MixinType.MIXINBYTES);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addTableValuePlan(String name) {
		AnyPlan plan = new AnyPlan(MixinType.MIXINTABLE);
		return addPlan(name, plan);
	}

	public SpecifiedPlan addFunctionValuePlan(String name) {
		AnyPlan plan = new AnyPlan(MixinType.MIXINFUNCTION);
		return addPlan(name, plan);
	}

	public SpecifiedPlan getPlan(String name) {
		for (SpecifiedPlan plan : plans) {
			if (plan.getName().equals(name)) {
				return plan;
			}
		}
		return null;
	}

	public int getPlanIndex(String name) {
		for (int i = 0; i < plans.size(); i++) {
			SpecifiedPlan plan = plans.get(i);
			if (plan.getName().equals(name)) {
				return i;
			}
		}
		return -1;
	}

	public int size() {
		return plans.size();
	}

	public Collection<SpecifiedPlan> getPlans() {
		return Collections.unmodifiableList(plans);
	}

	public SpecifiedPlan get(int index) {
		return plans.get(index);
	}

	@Override
	public Iterator<SpecifiedPlan> iterator() {
		return plans.iterator();
	}

	public String[] getPlanNames() {
		List<String> names = new ArrayList<>();
		for (SpecifiedPlan plan : plans) {
			names.add(plan.getName());
		}
		return names.toArray(new String[0]);
	}

	public String toString() {
		StringBuffer buffer = new StringBuffer();
		buffer.append('[');
		for (int i = 0; i < plans.size(); i++) {
			SpecifiedPlan plan = plans.get(i);
			String name = plan.getName();
			buffer.append(name);
			if (i < plans.size() - 1) {
				buffer.append(", ");
			}
		}
		buffer.append(']');
		return buffer.toString();
	}

}
