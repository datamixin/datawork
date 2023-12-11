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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.andia.mixin.sleman.ParserException;
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

public class ExpressionParserTest {

	private BaseExpressionFactory factory = new BaseExpressionFactory();

	@Test
	public void testBlank() throws ParserException {
		assertNull(factory.parse(""));
	}

	@Test
	public void testInvalidStartChar() throws ParserException {
		String literal = "#1";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Fail parsing #", exception.getMessage());
		assertEquals(0, exception.getIndex());
		assertEquals("#1", exception.getLiteral());
	}

	@Test
	public void testNull() throws ParserException {
		String literal = "null";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SNull);
		SNull xnull = (SNull) parsed;
		assertEquals(literal, xnull.toLiteral());
	}

	@Test
	public void testTextClosedSingleQuote() throws ParserException {
		String value = "STRING";
		assertText(value, "'" + value + "'");
	}

	@Test
	public void testTextClosedDoubleQuote() throws ParserException {
		String value = "STRING";
		assertText(value, "\"" + value + "\"");
	}

	@Test
	public void testTextEscapeDoubleQuote() throws ParserException {
		String value = "\"";
		assertText(value, "\"\\\"\"");
	}

	@Test
	public void testTextNewLineEscapes() throws ParserException {
		String value = "\\n";
		assertText("\\n", "'" + value + "'");
	}

	private void assertText(String value, String literal) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertText(value, parsed);
	}

	@Test
	void testTextUnclosedSingleQuote() {
		String value = "'STR";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(value));
		assertEquals("Unclosed quote after 'STR", exception.getMessage());
	}

	@Test
	void testTextUnclosedDoubleQuote() {
		String value = "\"STR";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(value));
		assertEquals("Unclosed quote after \"STR", exception.getMessage());
	}

	private void assertText(String value, SExpression parsed) {
		assertTrue(parsed instanceof SText);
		SText text = (SText) parsed;
		assertEquals(value, text.getValue());
	}

	@Test
	public void testNumberLong() throws ParserException {
		assertNumber("10", 10);
	}

	@Test
	public void testNumberDouble() throws ParserException {
		assertNumber("1.5", 1.5D);
	}

	@Test
	public void testNumberFract() throws ParserException {
		assertNumber(".9", .9D);
	}

	@Test
	public void testNumberExpSmall() throws ParserException {
		assertNumber("1e3", 1e3);
	}

	@Test
	public void testNumberExpLarge() throws ParserException {
		assertNumber("1E3", 1E3);
	}

	@Test
	public void testNumberExpPlus() throws ParserException {
		assertNumber("1e+3", 1e+3);
	}

	@Test
	public void testNumberExpMinus() throws ParserException {
		assertNumber("1e-3", 1e-3);
	}

	private void assertNumber(String literal, Object value) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertNumber(value, parsed);
	}

	private void assertNumber(Object value, SExpression parsed) {
		assertTrue(parsed instanceof SNumber);
		SNumber number = (SNumber) parsed;
		assertEquals(value, number.getValue());
	}

	@Test
	public void testNumberExpMissing() throws ParserException {
		String number = "1e";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(number));
		assertEquals("Expected exponent " + number, exception.getMessage());
	}

	@Test
	public void testNumberExpInvalid() throws ParserException {
		String number = "1a";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(number));
		assertEquals("Number cannot contains 'a'", exception.getMessage());
	}

	@Test
	public void testLogicalTrue() throws ParserException {
		assertLogical("true", true);
	}

	@Test
	public void testLogicalFalse() throws ParserException {
		assertLogical("false", false);
	}

	private void assertLogical(String literal, boolean value) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SLogical);
		SLogical logical = (SLogical) parsed;
		assertEquals(value, logical.getValue());
	}

	@Test
	public void testAlias() throws ParserException {
		assertAlias("$name", "name");
	}

	@Test
	public void testAliasBacktick() throws ParserException {
		assertAlias("$`firstname lastname`", "firstname lastname");
	}

	private void assertAlias(String literal, String value) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertAlias(value, parsed);
	}

	private void assertAlias(String value, SExpression parsed) {
		assertTrue(parsed instanceof SAlias);
		SAlias alias = (SAlias) parsed;
		String name = alias.getName();
		assertEquals(value, name);
	}

	@Test
	public void testReferenceSimple() throws ParserException {
		assertReference("name", "name");
	}

	@Test
	public void testReferenceWithSpaceBacktick() throws ParserException {
		assertReference("`first name`", "first name");
	}

	@Test
	public void testReferenceWithMinusBacktick() throws ParserException {
		assertReference("`first-name`", "first-name");
	}

	@Test
	public void testReferenceWithSlashBacktick() throws ParserException {
		assertReference("`first/name`", "first/name");
	}

	@Test
	public void testReferenceWithPeriodBacktick() throws ParserException {
		assertReference("`first.name`", "first.name");
	}

	private void assertReference(String literal, String value) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertReference(value, parsed);
	}

	private void assertReference(String name, SExpression parsed) {
		assertTrue(parsed instanceof SReference);
		SReference reference = (SReference) parsed;
		assertEquals(name, reference.getName());
	}

	@Test
	public void testReferenceWithBacktickInvalid() throws ParserException {
		String literal = "`var 5?`";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected close backtick after `var 5", exception.getMessage());
	}

	@Test
	public void testListEmpty() throws ParserException {
		assertList("[]", Arrays.asList());
	}

	@Test
	public void testListSingleElelement() throws ParserException {
		assertList("[1]", Arrays.asList(1));
	}

	@Test
	public void testListMultiElelement() throws ParserException {
		assertList("[1, 2, 3]", Arrays.asList(1, 2, 3));
	}

	private void assertList(String literal, List<Object> input) throws ParserException {
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SList);
		SList list = (SList) parsed;
		assertEquals(input.size(), list.size());
	}

	@Test
	public void testListUnclosed() {
		String literal = "[1";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected termination character ']'", exception.getMessage());
	}

	@Test
	public void testListNullItem() {
		String literal = "[1,]";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected expression after ','", exception.getMessage());
	}

	@Test
	public void testObjectEmpty() throws ParserException {

		String literal = "{}";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SObject);
		SObject object = (SObject) parsed;

		assertFieldNames(object);

	}

	@Test
	public void testObjectSingleField() throws ParserException {

		String literal = "{name: 'Jon'}";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SObject);
		SObject object = (SObject) parsed;

		assertFieldNames(object, "name");

		SExpression nameField = object.getField("name");
		assertText("Jon", nameField);

	}

	private void assertFieldNames(SObject object, String... names) {
		Collection<String> fieldNames = object.fieldNames();
		assertEquals(names.length, fieldNames.size());
		for (String name : names) {
			assertTrue(fieldNames.contains(name));
		}
	}

	@Test
	public void testObjectMultiField() throws ParserException {

		String literal = "{name: 'Jon', age: 30}";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SObject);
		SObject object = (SObject) parsed;

		assertFieldNames(object, "name", "age");

		SExpression nameField = object.getField("name");
		assertText("Jon", nameField);

		SExpression ageField = object.getField("age");
		assertNumber(30, ageField);

	}

	@Test
	public void testObjectErrorFieldNoValue() {

		String literal = "{age :";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected expression after ':' for field", exception.getMessage());

	}

	@Test
	public void testLetErrorFieldNoColon() {

		String literal = "{age";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected ':' after field name", exception.getMessage());

	}

	@Test
	public void testMemberNoSpace() throws ParserException {

		String literal = "object.property";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);
		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertReference("object", pointer);

		SExpression property = member.getProperty();
		assertReference("property", property);

	}

	@Test
	public void testMemberWithSpace() throws ParserException {

		String literal = "`object name`.`property name`";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);

		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertReference("object name", pointer);

		SExpression property = member.getProperty();
		assertReference("property name", property);

	}

	@Test
	public void testMemberBracketsReference() throws ParserException {

		String literal = "object[property]";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);

		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertReference("object", pointer);

		SExpression property = member.getProperty();
		assertReference("property", property);

	}

	@Test
	public void testMemberReferenceBracketsNumber() throws ParserException {

		String literal = "object[0]";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);

		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertReference("object", pointer);

		SExpression property = member.getProperty();
		assertNumber(0, property);

	}

	@Test
	public void testMemberAliasBracketsNumber() throws ParserException {

		String literal = "$alias[0]";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);

		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertAlias("alias", pointer);

		SExpression property = member.getProperty();
		assertNumber(0, property);

	}

	@Test
	public void testMemberBracketsText() throws ParserException {

		String literal = "object['property']";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SMember);

		SMember member = (SMember) parsed;

		SPointer pointer = member.getObject();
		assertReference("object", pointer);

		SExpression property = member.getProperty();
		assertText("property", property);

	}

	@Test
	public void testMemberSquareBracketsInvalid() {

		String literal = "object[[]]";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected constant or reference inside square brackets", exception.getMessage());
	}

	@Test
	public void testMemberSquareBracketsUnClosed() {

		String literal = "object[property";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected character ']'", exception.getMessage());
	}

	@Test
	public void testConditional() throws ParserException {

		String literal = "if logical then consequent else alternate";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SConditional);
		SConditional conditional = (SConditional) parsed;

		SExpression logical = conditional.getLogical();
		assertReference("logical", logical);

		SExpression consequent = conditional.getConsequent();
		assertReference("consequent", consequent);

		SExpression alternate = conditional.getAlternate();
		assertReference("alternate", alternate);

	}

	@Test
	public void testConditionalNoThen() {
		String literal = "if logical";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected 'then' token for 'if' expression", exception.getMessage());
	}

	@Test
	public void testConditionalNoElse() {
		String literal = "if logical then consequent";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected 'else' token for 'if' expression", exception.getMessage());
	}

	@Test
	public void testUnaryExclamation() throws ParserException {

		String literal = "!object";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SUnary);
		SUnary unary = (SUnary) parsed;

		SExpression parameter = unary.getArgument();
		assertReference("object", parameter);

		assertEquals("!", unary.getOperator());
	}

	@Test
	public void testUnaryNot() throws ParserException {

		String literal = "not object";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SUnary);
		SUnary unary = (SUnary) parsed;

		SExpression parameter = unary.getArgument();
		assertReference("object", parameter);

		assertEquals("not", unary.getOperator());
	}

	@Test
	public void testBinaryStar() throws ParserException {

		String a = "a";
		String star = "*";
		String b = "b";
		String literal = a + star + b;
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SBinary);

		assertBinary(a, star, b, parsed);

	}

	@Test
	public void testBinaryOr() throws ParserException {

		String a = "a";
		String or = "or";
		String b = "b";
		String literal = a + " " + or + " " + b;
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SBinary);

		assertBinary(a, or, b, parsed);

	}

	@Test
	public void testBinaryPrecedence() throws ParserException {

		String a = "a";
		String star = "*";
		String b = "b";
		String plus = "+";
		String c = "c";
		String literal = a + star + b + plus + c;
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SBinary);
		SBinary binary = (SBinary) parsed;

		SExpression left = binary.getLeft();
		assertBinary(a, star, b, left);

		assertEquals(plus, binary.getOperator());

		SExpression right = binary.getRight();
		assertReference(c, right);

	}

	@Test
	public void testBinaryPrecedentByGroup() throws ParserException {

		String a = "a";
		String star = "*";
		String b = "b";
		String plus = "+";
		String c = "c";
		String literal = a + star + '(' + b + plus + c + ')';
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SBinary);
		SBinary binary = (SBinary) parsed;

		SExpression left = binary.getLeft();
		assertReference(a, left);

		assertEquals(star, binary.getOperator());

		SExpression right = binary.getRight();
		assertBinary(b, plus, c, right);

	}

	private void assertBinary(String a, String op, String b, SExpression parsed) {

		SBinary binary = (SBinary) parsed;

		SExpression left = binary.getLeft();
		assertReference(a, left);

		assertEquals(op, binary.getOperator());

		SExpression right = binary.getRight();
		assertReference(b, right);
	}

	@Test
	public void testBinaryMissingRight() {
		String literal = "a+";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected expression after '+'", exception.getMessage());
	}

	@Test
	public void testBinaryPrecedentMissingRight() {
		String literal = "a*b+";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected expression after '+'", exception.getMessage());
	}

	@Test
	public void testLambdaNoParameter() throws ParserException {

		String literal = "() -> 5";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SLambda);
		SLambda lambda = (SLambda) parsed;

		assertParameterNames(lambda);

		SExpression expression = lambda.getExpression();
		assertNumber(5, expression);
	}

	@Test
	public void testLambdaSingleParameter() throws ParserException {

		String literal = "(x) -> x";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SLambda);
		SLambda lambda = (SLambda) parsed;

		assertParameterNames(lambda, "x");

		SExpression expression = lambda.getExpression();
		assertReference("x", expression);
	}

	@Test
	public void testLambdaMultipeParameter() throws ParserException {

		String literal = "(x, y) -> x + y";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SLambda);
		SLambda lambda = (SLambda) parsed;

		assertParameterNames(lambda, "x", "y");

		SExpression expression = lambda.getExpression();
		assertBinary("x", "+", "y", expression);
	}

	private void assertParameterNames(SLambda lambda, String... names) {
		for (int i = 0; i < lambda.parameterSize(); i++) {
			assertEquals(names[i], lambda.getParameter(i));
		}
	}

	@Test
	public void testLambdaNoArrow() {

		String literal = "(x, y)";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected '->' token for lambda expression", exception.getMessage());
	}

	@Test
	public void testImplicit() throws ParserException {

		String literal = "foreach 5";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SForeach);
		SForeach simplex = (SForeach) parsed;

		SExpression expression = simplex.getExpression();
		assertNumber(5, expression);
	}

	@Test
	public void testCallMultiArgument() throws ParserException {

		String literal = "function(x, y)";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SCall);
		SCall call = (SCall) parsed;

		SPointer callee = call.getCallee();
		assertReference("function", callee);

		assertEquals(2, call.argumentSize());
		assertReferenceArgument("x", call.getArgument(0));
		assertReferenceArgument("y", call.getArgument(1));

	}

	@Test
	public void testCallAssignment() throws ParserException {

		String literal = "function(second=y)";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SCall);
		SCall call = (SCall) parsed;

		SPointer callee = call.getCallee();
		assertReference("function", callee);

		assertEquals(1, call.argumentSize());
		assertAssignmentArgument("second", "y", call.getArgument(0));

	}

	@Test
	public void testCallArgumentAssignment() throws ParserException {

		String literal = "function(x, second=y)";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SCall);
		SCall call = (SCall) parsed;

		SPointer callee = call.getCallee();
		assertReference("function", callee);

		assertEquals(2, call.argumentSize());
		assertReferenceArgument("x", call.getArgument(0));
		assertAssignmentArgument("second", "y", call.getArgument(1));

	}

	private void assertReferenceArgument(String name, SArgument parsed) {
		SExpression expression = parsed.getExpression();
		assertTrue(expression instanceof SReference);
		SReference reference = (SReference) expression;
		assertEquals(name, reference.getName());
	}

	private void assertAssignmentArgument(String name, String value, SArgument parsed) {
		assertTrue(parsed instanceof SAssignment);
		SAssignment assignment = (SAssignment) parsed;
		assertAssignmentIdentifier(name, assignment);
		SExpression expression = parsed.getExpression();
		assertReference(value, expression);
	}

	private void assertAssignmentIdentifier(String name, SAssignment parsed) {
		assertTrue(parsed instanceof SAssignment);
		SAssignment assignment = (SAssignment) parsed;
		SIdentifier identifier = assignment.getName();
		assertEquals(name, identifier.getName());
	}

	@Test
	public void testLetMultiVariable() throws ParserException {

		String literal = "let x = object, y = x in y";
		SExpression parsed = factory.parse(literal);
		assertTrue(parsed instanceof SLet);
		SLet let = (SLet) parsed;

		SExpression outout = let.getResult();
		assertReference("y", outout);

		Collection<String> names = let.assignmentNames();
		assertEquals(2, names.size());

		assertTrue(names.contains("x"));
		assertTrue(names.contains("y"));

		assertReference("object", let.getAssignment("x"));
		assertReference("x", let.getAssignment("y"));

	}

	@Test
	public void testLetErrorAssigmentNoValue() {

		String literal = "let x =";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected expression after '=' for assignment", exception.getMessage());

	}

	@Test
	public void testLetErrorAssigmentNoEquals() {

		String literal = "let x";
		ParserException exception = assertThrows(ParserException.class, () -> factory.parse(literal));
		assertEquals("Expected '=' after assignment name", exception.getMessage());

	}
}
