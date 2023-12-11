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
import FormulaParser from "bekasi/FormulaParser";

import XConstant from "sleman/model/XConstant";
import XExpression from "sleman/model/XExpression";

export default class ExpressionFormula {

	public getFormula(value: XExpression): string {
		if (value instanceof XConstant) {
			let object = value.toValue();
			if (object === null) {
				return null;
			} else {
				return object.toString();
			}
		} else {
			let literal = value.toLiteral();
			return "=" + literal;
		}
	}

	public parseFormula(formula: string): XExpression {
		let parser = new FormulaParser();
		return parser.parse(formula);
	}

}