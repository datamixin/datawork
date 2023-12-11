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
package com.andia.mixin.padang.dumai;

import java.util.regex.Pattern;

import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.SExpression;

public class FormulaParser {

	private static Pattern integerPattern = Pattern.compile("^-?\\d+(e-?\\d+)?");
	private static Pattern decimalPattern = Pattern.compile("^-?\\d+\\.\\d*(e-?\\d+)?");

	public SExpression parse(String formula) throws ParserException {

		ExpressionFactory factory = ExpressionFactory.INSTANCE;
		if (formula == null) {
			return factory.createNull();
		}

		String trim = formula.trim();
		if (trim.startsWith("=")) {

			String literal = trim.substring(1);
			return factory.parse(literal);

		} else {
			if (formula.equalsIgnoreCase(Boolean.TRUE.toString())) {
				return factory.createLogical(Boolean.TRUE);
			} else if (formula.equalsIgnoreCase(Boolean.FALSE.toString())) {
				return factory.createLogical(Boolean.FALSE);
			} else if (integerPattern.matcher(formula).matches()) {
				return factory.createNumber(Integer.parseInt(formula));
			} else if (decimalPattern.matcher(formula).matches()) {
				return factory.createNumber(Float.parseFloat(formula));
			} else {
				return factory.createText(formula);
			}
		}
	}
}
