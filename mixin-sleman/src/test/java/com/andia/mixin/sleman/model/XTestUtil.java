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
package com.andia.mixin.sleman.model;

public class XTestUtil {

	public final static XReference createReference(String identifier) {
		XReference reference = new XReference();
		reference.setName(identifier);
		return reference;
	}

	public final static XArgument createArgument(XExpression expression) {
		XArgument argument = new XArgument();
		argument.setExpression(expression);
		return argument;
	}

	public final static XIdentifier createIdentifier(String name) {
		XIdentifier identifier = new XIdentifier();
		identifier.setName(name);
		return identifier;
	}

	public final static XAssignment createAssignment(String name, XExpression expression) {
		XAssignment assignment = new XAssignment();
		XIdentifier identifier = createIdentifier(name);
		assignment.setName(identifier);
		assignment.setExpression(expression);
		return assignment;
	}

	public final static XText createText(String value) {
		XText text = new XText();
		text.setValue(value);
		return text;
	}

	public final static XNumber createNumber(Number value) {
		XNumber number = new XNumber();
		number.setValue(value);
		return number;
	}

	public final static XUnary createUnary(String operator, XExpression argument) {
		XUnary unary = new XUnary();
		unary.setOperator(operator);
		unary.setArgument(argument);
		return unary;
	}

}
