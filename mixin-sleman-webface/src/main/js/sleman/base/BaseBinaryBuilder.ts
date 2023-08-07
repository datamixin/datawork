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
import * as sleman from "sleman/sleman";

import SExpression from "sleman/SExpression";
import BinaryBuilder from "sleman/BinaryBuilder";
import { expressionFactory as factory } from "sleman/ExpressionFactory";

export default class BaseBinaryBuilder implements BinaryBuilder {

	private expression: SExpression = null;

	public setExpression(expression: SExpression): void {
		if (expression !== undefined) {
			this.expression = expression;
		}
	}

	private apply(operator: string, expression: SExpression): void {
		if (this.expression === null) {
			this.expression = expression;
		} else {
			this.expression = factory.createBinary(this.expression, operator, expression);
		}
	}

	public and(expression: SExpression): void {
		this.apply(sleman.AND, expression);
	}

	public or(expression: SExpression): void {
		this.apply(sleman.OR, expression);
	}

	public operator(operator: string, expression: SExpression): void {
		this.apply(operator, expression);
	}

	public operatorTrue(operator: string): void {
		this.apply(operator, factory.createLogical(true));
	}

	public operatorFalse(operator: string): void {
		this.apply(operator, factory.createLogical(false));
	}

	public equals(expression: SExpression): void {
		this.apply(sleman.EQUALS, expression);
	}

	public equalsTrue(): void {
		this.apply(sleman.EQUALS, factory.createLogical(true));
	}

	public equalsFalse(): void {
		this.apply(sleman.EQUALS, factory.createLogical(false));
	}

	private applyLogicOperator(logic: string, left: SExpression, operator: string, right: SExpression): void {
		let expression = factory.createBinary(left, operator, right);
		this.apply(logic, expression);
	}

	private applyLogicEquals(logic: string, left: SExpression, right: SExpression): void {
		this.applyLogicOperator(logic, left, sleman.EQUALS, right);
	}

	public andEquals(left: SExpression, right: SExpression): void {
		this.applyLogicEquals(sleman.AND, left, right);
	}

	public andEqualsTrue(left: SExpression): void {
		this.applyLogicEquals(sleman.AND, left, factory.createLogical(true));
	}

	public andEqualsFalse(left: SExpression): void {
		this.applyLogicEquals(sleman.AND, left, factory.createLogical(false));
	}

	public orEquals(left: SExpression, right: SExpression): void {
		this.applyLogicEquals(sleman.OR, left, right);
	}

	public andOperator(left: SExpression, operator: string, right: SExpression): void {
		this.applyLogicOperator(sleman.AND, left, operator, right);
	}

	public orOperator(left: SExpression, operator: string, right: SExpression): void {
		this.applyLogicOperator(sleman.OR, left, operator, right);
	}

	public getExpression(): SExpression {
		return this.expression;
	}

}
