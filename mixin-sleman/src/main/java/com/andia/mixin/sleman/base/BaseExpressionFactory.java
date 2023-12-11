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
package com.andia.mixin.sleman.base;

import java.util.List;

import com.andia.mixin.model.EList;
import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.SAlias;
import com.andia.mixin.sleman.api.SArgument;
import com.andia.mixin.sleman.api.SAssignment;
import com.andia.mixin.sleman.api.SBinary;
import com.andia.mixin.sleman.api.SCall;
import com.andia.mixin.sleman.api.SConditional;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SForeach;
import com.andia.mixin.sleman.api.SIdentifier;
import com.andia.mixin.sleman.api.SLambda;
import com.andia.mixin.sleman.api.SLet;
import com.andia.mixin.sleman.api.SList;
import com.andia.mixin.sleman.api.SLogical;
import com.andia.mixin.sleman.api.SMember;
import com.andia.mixin.sleman.api.SNull;
import com.andia.mixin.sleman.api.SNumber;
import com.andia.mixin.sleman.api.SObject;
import com.andia.mixin.sleman.api.SPointer;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.api.SText;
import com.andia.mixin.sleman.api.SUnary;
import com.andia.mixin.sleman.model.SlemanFactory;
import com.andia.mixin.sleman.model.XAlias;
import com.andia.mixin.sleman.model.XArgument;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XBinary;
import com.andia.mixin.sleman.model.XCall;
import com.andia.mixin.sleman.model.XConditional;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XForeach;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XLambda;
import com.andia.mixin.sleman.model.XLet;
import com.andia.mixin.sleman.model.XList;
import com.andia.mixin.sleman.model.XLogical;
import com.andia.mixin.sleman.model.XMember;
import com.andia.mixin.sleman.model.XNull;
import com.andia.mixin.sleman.model.XNumber;
import com.andia.mixin.sleman.model.XObject;
import com.andia.mixin.sleman.model.XPointer;
import com.andia.mixin.sleman.model.XReference;
import com.andia.mixin.sleman.model.XText;
import com.andia.mixin.sleman.model.XUnary;

public class BaseExpressionFactory implements ExpressionFactory {

	private SlemanFactory factory = SlemanFactory.eINSTANCE;

	@Override
	public SAssignment createAssignment(String name, SExpression expression) {
		XAssignment assignment = factory.createXAssignment();
		XIdentifier identifier = createXIdentifier(name);
		assignment.setName(identifier);
		assignment.setExpression((XExpression) expression);
		return assignment;
	}

	private XIdentifier createXIdentifier(String name) {
		XIdentifier identifier = factory.createXIdentifier();
		identifier.setName(name);
		return identifier;
	}

	@Override
	public SNull createNull() {
		XNull expression = factory.createXNull();
		return expression;
	}

	@Override
	public SCall createCall(SPointer callee, List<SArgument> args) {
		XCall call = factory.createXCall();
		call.setCallee((XPointer) callee);
		EList<XArgument> arguments = call.getArguments();
		for (SArgument argument : args) {
			arguments.add((XArgument) argument);
		}
		return call;
	}

	@Override
	public SCall createCall(String callee, SExpression... args) {
		SPointer pointer = createPointer(callee);
		return createCall(pointer, args);
	}

	@Override
	public SCall createCall(SPointer callee, SExpression... args) {
		XCall call = factory.createXCall();
		call.setCallee((XPointer) callee);
		EList<XArgument> arguments = call.getArguments();
		for (SExpression expression : args) {
			XArgument argument = factory.createXArgument();
			argument.setExpression((XExpression) expression);
			arguments.add(argument);
		}
		return call;
	}

	@Override
	public SCall createCall(SPointer callee, SArgument... args) {
		XCall call = factory.createXCall();
		call.setCallee((XPointer) callee);
		EList<XArgument> arguments = call.getArguments();
		for (SArgument argument : args) {
			arguments.add((XArgument) argument);
		}
		return call;
	}

	@Override
	public SCall createCall(String callee, SArgument... args) {
		SPointer pointer = createPointer(callee);
		return createCall(pointer, args);
	}

	@Override
	public SArgument createArgument(SExpression expression) {
		XArgument argument = factory.createXArgument();
		argument.setExpression((XExpression) expression);
		return argument;
	}

	@Override
	public XReference createReference(String name) {
		XReference reference = factory.createXReference();
		reference.setName(name);
		return reference;
	}

	@Override
	public SAlias createAlias(String name) {
		XAlias alias = factory.createXAlias();
		alias.setName(name);
		return alias;
	}

	@Override
	public SText createText(String value) {
		XText text = factory.createXText();
		text.setValue(value);
		return text;
	}

	@Override
	public SNumber createNumber(Number value) {
		XNumber number = factory.createXNumber();
		number.setValue(value);
		return number;
	}

	@Override
	public SLogical createLogical(Boolean value) {
		XLogical logical = factory.createXLogical();
		logical.setValue(value);
		return logical;
	}

	@Override
	public SList createList(SExpression... elements) {
		XList list = factory.createXList();
		EList<XExpression> expressions = list.getElements();
		for (SExpression expression : elements) {
			expressions.add((XExpression) expression);
		}
		return list;
	}

	@Override
	public SList createList(List<SExpression> elements) {
		XList list = factory.createXList();
		EList<XExpression> expressions = list.getElements();
		for (SExpression expression : elements) {
			expressions.add((XExpression) expression);
		}
		return list;
	}

	@Override
	public SObject createObject(List<SAssignment> fields) {
		XObject object = factory.createXObject();
		EList<XAssignment> assignments = object.getFields();
		for (SAssignment assignment : fields) {
			assignments.add((XAssignment) assignment);
		}
		return object;
	}

	@Override
	public SObject createObject(SAssignment... fields) {
		XObject object = factory.createXObject();
		EList<XAssignment> assignments = object.getFields();
		for (SAssignment assignment : fields) {
			assignments.add((XAssignment) assignment);
		}
		return object;
	}

	@Override
	public SLet createLet(List<SAssignment> variables, SExpression expression) {
		XLet let = factory.createXLet();
		EList<XAssignment> assignments = let.getVariables();
		for (SAssignment assignment : variables) {
			assignments.add((XAssignment) assignment);
		}
		let.setResult((XExpression) expression);
		return let;
	}

	@Override
	public SBinary createBinary(SExpression left, String operator, SExpression right) {
		XBinary binary = factory.createXBinary();
		binary.setLeft((XExpression) left);
		binary.setOperator(operator);
		binary.setRight((XExpression) right);
		return binary;
	}

	@Override
	public SUnary createUnary(String operator, SExpression argument) {
		XUnary unary = factory.createXUnary();
		unary.setOperator(operator);
		unary.setArgument((XExpression) argument);
		return unary;
	}

	@Override
	public SUnary createUnary(String operator, SExpression argument, boolean prefix) {
		XUnary unary = factory.createXUnary();
		unary.setOperator(operator);
		unary.setPrefix(prefix);
		unary.setArgument((XExpression) argument);
		return unary;
	}

	@Override
	public SConditional createConditional(SExpression logical, SExpression consequent,
			SExpression alternate) {
		XConditional conditional = factory.createXConditional();
		conditional.setLogical((XExpression) logical);
		conditional.setConsequent((XExpression) consequent);
		conditional.setAlternate((XExpression) alternate);
		return conditional;
	}

	@Override
	public SLambda createLambda(List<SIdentifier> identifiers, SExpression expression) {
		XLambda lambda = factory.createXLambda();
		EList<XIdentifier> parameters = lambda.getParameters();
		for (SIdentifier identifier : identifiers) {
			parameters.add((XIdentifier) identifier);
		}
		lambda.setExpression((XExpression) expression);
		return lambda;
	}

	@Override
	public SForeach createForeach(SExpression expression) {
		XForeach foreach = factory.createXForeach();
		foreach.setExpression((XExpression) expression);
		return foreach;
	}

	@Override
	public SMember createMember(SPointer object, SExpression property) {
		XMember member = factory.createXMember();
		member.setObject((XPointer) object);
		member.setProperty((XExpression) property);
		return member;
	}

	@Override
	public SPointer createPointer(String literal) {
		String[] names = literal.split("\\.");
		SPointer pointer = this.createReference(names[0]);
		for (int i = 1; i < names.length; i++) {
			String name = names[i];
			SReference property = createReference(name);
			pointer = this.createMember(pointer, property);
		}
		return pointer;
	}

	@Override
	public SIdentifier createIdentifier(String name) {
		XIdentifier identifier = factory.createXIdentifier();
		identifier.setName(name);
		return identifier;
	}

	@Override
	public SExpression parse(String literal) throws ParserException {
		ExpressionParser parser = new ExpressionParser(literal);
		SExpression expression = parser.getExpression();
		return expression;
	}

}
