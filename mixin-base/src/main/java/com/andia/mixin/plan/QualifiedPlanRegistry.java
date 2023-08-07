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

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.Lean;

public class QualifiedPlanRegistry extends Lean {

	private Map<String, QualifiedPlan> planMap = new HashMap<>();

	public QualifiedPlanRegistry() {
		super(QualifiedPlanRegistry.class);
	}

	public Map<String, QualifiedPlan> getPlanMap() {
		return planMap;
	}

	public void register(QualifiedPlan plan) {
		planMap.put(plan.getName(), plan);
	}

	public QualifiedPlan getPlan(String functionName) {
		return planMap.get(functionName);
	}

}
