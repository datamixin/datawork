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
package com.andia.mixin.sleman.api;

import java.util.List;

import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.base.BaseExpressionFactory;

public interface ExpressionFactory {

	public static final ExpressionFactory INSTANCE = new BaseExpressionFactory();

	public SNull createNull();

	public SText createText(String value);

	public SNumber createNumber(Number value);

	public SLogical createLogical(Boolean value);

	public SReference createReference(String name);

	public SAssignment createAssignment(String name, SExpression expression);

	public SBinary createBinary(SExpression left, String operator, SExpression right);

	public SConditional createConditional(SExpression logical, SExpression consequent, SExpression alternate);

	public SUnary createUnary(String operator, SExpression argument);

	public SUnary createUnary(String operator, SExpression argument, boolean prefix);

	public SList createList(SExpression... elements);

	public SList createList(List<SExpression> elements);

	public SCall createCall(SPointer callee, List<SArgument> args);

	public SCall createCall(SPointer callee, SExpression... args);

	public SCall createCall(String callee, SExpression... args);

	public SCall createCall(SPointer callee, SArgument... args);

	public SCall createCall(String callee, SArgument... args);

	public SArgument createArgument(SExpression expression);

	public SMember createMember(SPointer object, SExpression property);

	public SPointer createPointer(String literal);

	public SObject createObject(List<SAssignment> fields);

	public SObject createObject(SAssignment... fields);

	public SLet createLet(List<SAssignment> assignments, SExpression expression);

	public SLambda createLambda(List<SIdentifier> identifiers, SExpression expression);

	public SForeach createForeach(SExpression expression);

	public SAlias createAlias(String name);

	public SIdentifier createIdentifier(String name);

	public SExpression parse(String literal) throws ParserException;

}
