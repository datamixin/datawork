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
package com.andia.mixin.value.function;

import java.io.Serializable;

import com.andia.mixin.plan.QualifiedPlan;
import com.andia.mixin.plan.SpecifiedPlan;
import com.andia.mixin.plan.SpecifiedPlanList;
import com.andia.mixin.value.MixinFunction;

public class ModuleFunction implements MixinFunction, Serializable {

	private static final long serialVersionUID = -6639601420311285402L;

	private String literal;

	private QualifiedPlan plan;

	public ModuleFunction(QualifiedPlan plan) {
		this.plan = plan;
		readLiteral(plan);
	}

	public QualifiedPlan getPlan() {
		return plan;
	}

	private void readLiteral(QualifiedPlan plan) {
		StringBuffer buffer = new StringBuffer();
		String name = plan.getName();
		buffer.append(name);
		SpecifiedPlanList parameters = plan.getParameters();
		buffer.append('(');
		for (int i = 0; i < parameters.size(); i++) {
			SpecifiedPlan qualifiedPlan = parameters.get(i);
			String argument = qualifiedPlan.getName();
			buffer.append(argument);
			if (i < parameters.size() - 1) {
				buffer.append(", ");
			}
		}
		buffer.append(')');
		literal = buffer.toString();
	}

	@Override
	public Type getType() {
		return Type.MODULE;
	}

	@Override
	public String getLiteral() {
		return literal;
	}

}
