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
package com.andia.mixin.model;

public class MValue extends BasicEObject {

	public static String XCLASSNAME = Mock.getEClassName("MValue");

	public static EAttribute FEATURE_EXPRESSION = new EAttribute("expression", EAttribute.STRING);
	public static EReference FEATURE_FLAG = new EReference("flag", MFlag.class);

	private String expression = null;
	private MFlag flag = null;

	public MValue() {
		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_EXPRESSION,
				FEATURE_FLAG
		});
	}

	public String getExpression() {
		return expression;
	}

	public void setExpression(String newExpression) {
		String oldExpression = this.expression;
		this.expression = newExpression;
		this.eSetNotify(FEATURE_EXPRESSION, oldExpression, newExpression);
	}

	public MFlag getFlag() {
		return flag;
	}

	public void setFlag(MFlag newFlag) {
		MFlag oldFlag = this.flag;
		this.flag = newFlag;
		this.eSetNotify(FEATURE_FLAG, oldFlag, newFlag);
	}

}
