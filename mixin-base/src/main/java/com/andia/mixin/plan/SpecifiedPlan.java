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

public class SpecifiedPlan extends Plan {

	private String name;
	private String label;
	private String description;
	private AssignedPlan plan;

	public SpecifiedPlan(String name, String label) {
		super(SpecifiedPlan.class);
		this.name = name;
		this.label = label;
	}

	public SpecifiedPlan(String name, String label, AssignedPlan plan) {
		this(name, label);
		this.plan = plan;
	}

	public SpecifiedPlan(String name, AssignedPlan plan) {
		this(name, name, plan);
	}

	public String getName() {
		return name;
	}

	public String getLabel() {
		return label;
	}

	public String getDescription() {
		return description;
	}

	public AssignedPlan getPlan() {
		return plan;
	}

	public SpecifiedPlan setLabel(String label) {
		this.label = label;
		return this;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setAssignable(String assignable) {
		this.plan.setAssignable(assignable);
	}

}
