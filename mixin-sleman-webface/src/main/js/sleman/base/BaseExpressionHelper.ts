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
import SExpression from "sleman/SExpression";
import ExpressionHelper from "sleman/ExpressionHelper";
import { setHelperInstance } from "sleman/ExpressionHelper";

import XNumber from "sleman/model/XNumber";
import XConstant from "sleman/model/XConstant";
import XReference from "sleman/model/XReference";

export default class BaseExpressionHelper implements ExpressionHelper {

	public isNumber(expression: SExpression): boolean {
		return expression instanceof XNumber;
	}

	public isConstant(expression: SExpression): boolean {
		return expression instanceof XConstant;
	}

	public isReference(expression: SExpression): boolean {
		return expression instanceof XReference;
	}

}

setHelperInstance(new BaseExpressionHelper());