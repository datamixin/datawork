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
package com.andia.mixin.sleman.base;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.ExpressionHelper;
import com.andia.mixin.sleman.api.SAlias;
import com.andia.mixin.sleman.api.SArgument;
import com.andia.mixin.sleman.api.SAssignment;
import com.andia.mixin.sleman.api.SBinary;
import com.andia.mixin.sleman.api.SCall;
import com.andia.mixin.sleman.api.SConditional;
import com.andia.mixin.sleman.api.SConstant;
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
import com.andia.mixin.sleman.model.XExpression;

public class ExpressionParser {

	// =============================================================
	// Symbols
	// =============================================================
	private static String LET = "let";
	private static String IN = "in";

	private static String IF = "if";
	private static String THEN = "then";
	private static String ELSE = "else";

	private static String LAMBDA_OP = "->";

	private static String FOREACH = "foreach";

	private static char TAB = 9;
	private static char NEW_LINE = 10;
	private static char LINE_FEED = 13;
	private static char SPACE = 32;
	private static char DOLLAR = 36;
	private static char ATSIGN = 35;
	private static char SLASH = 47;
	private static char DOUBLE_QUOTE = 34;
	private static char SINGLE_QUOTE = 39;
	private static char LEFT_PARENT_THESIS = 40;
	private static char RIGHT_PARENT_THESIS = 41;
	private static char PLUS = 43;
	private static char COMMA = 44;
	private static char MINUS = 45;
	private static char PERIOD = 46;
	private static char COLON = 58;
	private static char EQUALS = 61;
	private static char LEFT_SQUARE_BRACKET = 91;
	private static char RIGHT_SQUARE_BRACKET = 93;
	private static char BACK_TICK = 96;
	private static char LEFT_CURLY_BRACKET = 123;
	private static char RIGHT_CURLY_BRACKET = 125;
	private static char SMALL_E = 101;
	private static char LARGE_E = 69;

	// ==============================================================
	// Daftar Constanta
	// ==============================================================
	private final static Map<String, Object> LITERALS = new HashMap<>();
	static {
		LITERALS.put("true", new Boolean(true));
		LITERALS.put("false", new Boolean(false));
		LITERALS.put("null", null);
	}

	private final static Set<String> UNARY_OPS = new HashSet<>();
	static {
		UNARY_OPS.add("-");
		UNARY_OPS.add("!");
		UNARY_OPS.add("+");
	}

	private final static Set<String> UNARY_WORDS = new HashSet<>();
	static {
		UNARY_WORDS.add("not");
	}

	private final static Map<String, Integer> BINARY_OPS = new HashMap<>();
	static {
		BINARY_OPS.put("||", 1);
		BINARY_OPS.put("&&", 2);
		BINARY_OPS.put("|", 3);
		BINARY_OPS.put("^", 4);
		BINARY_OPS.put("&", 5);
		BINARY_OPS.put("==", 6);
		BINARY_OPS.put("!=", 6);
		BINARY_OPS.put("<", 7);
		BINARY_OPS.put(">", 7);
		BINARY_OPS.put("=~", 7);
		BINARY_OPS.put("<=", 7);
		BINARY_OPS.put(">=", 7);
		BINARY_OPS.put("<>", 7);
		BINARY_OPS.put("<<", 8);
		BINARY_OPS.put(">>", 8);
		BINARY_OPS.put(">>>", 8);
		BINARY_OPS.put("+", 9);
		BINARY_OPS.put("-", 9);
		BINARY_OPS.put("*", 10);
		BINARY_OPS.put("/", 10);
		BINARY_OPS.put("%", 10);
	}

	private final static Map<String, Integer> BINARY_WORDS = new HashMap<>();
	static {
		BINARY_WORDS.put("or", 1);
		BINARY_WORDS.put("and", 2);
	}

	private static int maxUnaryOperationLength = getMaxKeyLen(UNARY_OPS);
	private static int maxUnaryWordLength = getMaxKeyLen(UNARY_WORDS);
	private static int maxBinaryOperationLength = getMaxKeyLen(BINARY_OPS.keySet());
	private static int maxBinaryWordLength = getMaxKeyLen(BINARY_WORDS.keySet());

	// ==============================================================
	// Object Pembantu
	// ==============================================================
	private static abstract class BinaryInfo {

		private int precedence;

		public BinaryInfo(int precedence) {
			this.precedence = precedence;
		}

		public int getPrecedence() {
			return precedence;
		}

	}

	private static class OperationInfo extends BinaryInfo {

		private String operation;

		public OperationInfo(String operation, int precedence) {
			super(precedence);
			this.operation = operation;
		}

		public String getOperation() {
			return operation;
		}

	}

	private static class ExpressionInfo extends BinaryInfo {

		private SExpression expression;

		public ExpressionInfo(SExpression expression) {
			super(-1);
			this.expression = expression;
		}

		public SExpression getExpression() {
			return expression;
		}

	}

	// ==============================================================
	// Instance Fields
	// ==============================================================
	private int index = 0;
	private int length = 0;
	private final String literal;
	private List<SExpression> expressions = new ArrayList<>();
	private ExpressionFactory factory = ExpressionFactory.INSTANCE;
	private ExpressionHelper helper = ExpressionHelper.INSTANCE;

	public ExpressionParser(String literal) throws ParserException {
		this.literal = literal;
		length = literal.length();
		while (index < length) {
			SExpression expression = gobble();
			if (expression == null) {
				break;
			} else {
				expressions.add(expression);
			}
		}
		if (index < length) {
			String message = "Fail parsing " + exprCode(index);
			throw new ParserException(message, this.literal, index);
		}
	}

	// ==============================================================
	// Rutin Parser
	// ==============================================================
	private SExpression gobble() throws ParserException {
		return gobbleExpression();

	}

	/**
	 * Melakukan proses parsing satuan expression.<br>
	 * Contoh: `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
	 * 
	 * @return
	 * @throws ParserException
	 */
	private SExpression gobbleExpression() throws ParserException {

		SExpression left = gobbleToken();

		// Jika tidak ada binary operator maka kembalikan yang left.
		String biop = gobbleBinaryOp();
		if (biop == null) {
			return left;
		}

		// Jika ada binary operator maka kita mulai menyusun untuk menempatkan
		// binary operation sesuai precedence structure-nya.
		OperationInfo biopInfo = new OperationInfo(biop, binaryPrecedence(biop));

		SExpression right = gobbleToken();
		if (right == null) {
			String message = "Expected expression after '" + biop + "'";
			throw new ParserException(message, this.literal, index);
		}
		ExpressionInfo leftInfo = new ExpressionInfo(left);
		ExpressionInfo rightInfo = new ExpressionInfo(right);
		LinkedList<BinaryInfo> stack = new LinkedList<>();
		stack.add(leftInfo);
		stack.add(biopInfo);
		stack.add(rightInfo);

		// Pengaturan precedence secara recursive [recursive descent]:
		// http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
		while ((biop = gobbleBinaryOp()) != null) {

			int prec = binaryPrecedence(biop);
			biopInfo = new OperationInfo(biop, prec);

			// Reduce: buat sebuah binary expression dari tiga anggota teratas.
			while ((stack.size() > 2) && (prec <= stack.get(stack.size() - 2).getPrecedence())) {
				right = ((ExpressionInfo) stack.removeLast()).getExpression();
				biop = ((OperationInfo) stack.removeLast()).getOperation();
				left = ((ExpressionInfo) stack.removeLast()).getExpression();
				SExpression node = createBinary(left, biop, right);
				stack.add(new ExpressionInfo(node));
			}

			SExpression node = gobbleToken();
			if (node == null) {
				String message = "Expected expression after '" + biopInfo.operation + "'";
				throw new ParserException(message, this.literal, index);
			}
			stack.add(biopInfo);
			stack.add(new ExpressionInfo(node));
		}

		int i = stack.size() - 1;
		SExpression node = ((ExpressionInfo) stack.get(i)).getExpression();
		while (i > 1) {
			left = ((ExpressionInfo) stack.get(i - 2)).getExpression();
			biop = ((OperationInfo) stack.get(i - 1)).getOperation();
			node = createBinary(left, biop, node);
			i -= 2;
		}
		return node;
	}

	/**
	 * Kembalikan precedence dari binary operator tersebut atau `0` jika bukan
	 * binary operator.
	 * 
	 * @param biop
	 * @return
	 */
	private int binaryPrecedence(String opExpression) {
		String normalizedOpValue = opExpression.toLowerCase();
		if (BINARY_OPS.containsKey(opExpression)) {
			return BINARY_OPS.get(normalizedOpValue);
		} else {
			return BINARY_WORDS.get(opExpression);
		}
	}

	/**
	 * Cari operator untuk unary operation.
	 */
	private String gobbleUnaryOp() {
		String operator = gobbleOp(UNARY_OPS, maxUnaryOperationLength);
		if (operator == null) {
			return gobbleWord(UNARY_WORDS, maxUnaryWordLength);
		}
		return operator;
	};

	/**
	 * Cari operator untuk binary operation.
	 */
	private String gobbleBinaryOp() {
		String operator = gobbleOp(BINARY_OPS.keySet(), maxBinaryOperationLength);
		if (operator == null) {
			return gobbleWord(BINARY_WORDS.keySet(), maxBinaryWordLength);
		}
		return operator;
	};

	/**
	 * Cari operator apakah operator. Pencarian dilakukan dari yang terpanjang
	 * seperti `===` sampai dengan yang terpendek.
	 */
	private String gobbleOp(Set<String> operators, int maxLength) {
		gobbleSpaces();
		int start = this.index;
		int end = Math.min(length, this.index + maxLength);
		String toCheck = substr(start, end);
		if (toCheck == null) {
			return null;
		}
		int tcLength = toCheck.length();
		while (tcLength > 0) {
			if (operators.contains(toCheck)) {
				index += tcLength;
				return toCheck;
			}
			toCheck = toCheck.substring(0, --tcLength);
		}
		return null;
	};

	/**
	 * Cari operator apakah word. Pencarian dilakukan dari yang terpanjang seperti
	 * `and` sampai dengan yang terpendek.
	 */
	private String gobbleWord(Set<String> words, int maxLength) {
		gobbleSpaces();
		int start = this.index;
		int end = Math.min(length, this.index + maxLength + 1);
		String toCheck = substr(start, end);
		if (toCheck == null) {
			return null;
		}
		int tcLength = toCheck.length();
		while (tcLength > 0) {
			char lastChar = toCheck.charAt(tcLength - 1);
			String word = toCheck.substring(0, tcLength - 1);
			if (words.contains(word) && isWhitespace(lastChar)) {
				index += tcLength - 1;
				return word;
			}
			toCheck = toCheck.substring(0, --tcLength);
		}
		return null;
	};

	/**
	 * Satu bagian dari binary expression.
	 * 
	 * @return
	 */
	private SExpression gobbleToken() throws ParserException {

		gobbleSpaces();
		char ch = exprCode(index);
		if (ch == 0) {
			return null;
		}

		if (isToken(this.index, LET)) {

			// Let expression
			return gobbleLet();

		} else if (isToken(this.index, FOREACH)) {

			// Foreach expression
			return gobbleForeach();

		} else if (isToken(this.index, IF)) {

			// If expression
			return gobbleIf();

		} else if (ch == DOLLAR) {

			// Char dollar '$' yang merupakan alias
			return gobbleAlias();

		} else if (isDecimalDigit(ch) || ch == PERIOD) {

			// Char code 46 adalah dot '.' yang merupakan awal numeric literal.
			return gobbleNumber();

		} else if (ch == SINGLE_QUOTE || ch == DOUBLE_QUOTE) {

			// Single atau double quotes
			return gobbleString();

		} else if (ch == LEFT_SQUARE_BRACKET) {

			// Square brackets [ ]
			return gobbleList();

		} else if (ch == LEFT_CURLY_BRACKET) {

			// Curly brackets { }
			return gobbleObject();

		} else if (ch == LEFT_PARENT_THESIS) {

			// Parentheses ()
			return gobbleGroup();

		} else {

			// Consider unary operator
			String operator = gobbleUnaryOp();
			if (operator != null) {
				SExpression argument = gobbleToken();
				return createUnary(operator, argument);
			}

			// Last chance is identifier
			if (isIdentifierStart(ch) || isBacktickIdentifier(ch)) {

				// foo_, bar_.baz, `test space`
				return gobbleVariable();
			}

		}

		return null;
	}

	/**
	 * Parsing angka sederhana seperti '12', '3.4', '.5'<br>
	 * 
	 * @return
	 */
	private SNumber gobbleNumber() throws ParserException {
		StringBuilder number = new StringBuilder();

		while (isDecimalDigit(exprCode(index))) { // Dimulai dengan digit.
			number.append(exprCode(index++));
		}

		if (exprCode(index) == PERIOD) { // Dimulai dengan dot.
			number.append(exprCode(index++));

			while (isDecimalDigit(exprCode(index))) {
				number.append(exprCode(index++));
			}
		}

		// Tanda exponent.
		if (exprCode(index) == SMALL_E || exprCode(index) == LARGE_E) {
			number.append(exprCode(index++));

			// Simbol exponent.
			if (exprCode(index) == PLUS || exprCode(index) == MINUS) {
				number.append(exprCode(index++));
			}

			// Nilai exponent.
			while (isDecimalDigit(exprCode(index))) { //
				number.append(exprCode(index++));
			}
			if (!isDecimalDigit(exprCode(index - 1))) {
				String message = "Expected exponent " + number;
				throw new ParserException(message, this.literal, index);
			}
		}

		// Pastikan ini bukan variable yang dimulai angka berbentuk 123abc.
		char c = exprCode(index);
		if (isIdentifierStart(c)) {
			String message = "Number cannot contains '" + c + "'";
			throw new ParserException(message, this.literal, index);
		}

		String string = number.toString();
		try {

			long longValue = Long.parseLong(string);
			int intValue = Integer.parseInt(string);
			if (longValue == intValue) {
				return createNumber(intValue, string);
			} else {
				return createNumber(longValue, string);
			}

		} catch (NumberFormatException e) {

			double parseDouble = Double.parseDouble(string);
			return createNumber(parseDouble, string);

		}
	}

	/**
	 * Memproses simplex expression dengan bentuk `-> expression`.
	 * 
	 * @return
	 */
	private SExpression gobbleAlias() throws ParserException {
		index++;
		SExpression variable = gobbleVariable();
		if (variable instanceof SReference) {

			SReference reference = (SReference) variable;
			String name = reference.getName();
			return createAlias(name);

		} else {
			return createAlias((SMember) variable);
		}
	}

	private SExpression createAlias(SMember member) throws ParserException {

		SPointer object = member.getObject();
		if (object instanceof SReference) {

			SReference reference = (SReference) object;
			String name = reference.getName();
			SAlias alias = createAlias(name);

			SExpression property = member.getProperty();
			return createMember(alias, property);

		} else {

			return createAlias((SMember) object);

		}

	}

	/**
	 * Parsing string literal dengan double quote dengan dukungan dasar escape
	 * character.
	 * 
	 * @return
	 */
	private SText gobbleString() throws ParserException {

		StringBuilder str = new StringBuilder();
		char quote = exprCode(index++);
		boolean closed = false;
		char ch;

		while (index < length) {
			ch = exprCode(index++);
			if (ch == quote) {
				closed = true;
				break;
			} else if (ch == '\\') {
				char next = exprCode(index++);
				if (!(next == '\"' || next == '\\')) {
					str.append(ch);
				}
				str.append(next);
			} else {
				str.append(ch);
			}
		}

		if (!closed) {
			String message = "Unclosed quote after " + quote + str;
			throw new ParserException(message, this.literal, index);
		}

		String string = str.toString();
		return createString(string, quote + string + quote);
	}

	/**
	 * Parsing hanya untuk `foo`, `_value`, `true`, `false` atau `null`<br>
	 * Dilakukan juga proses pengecekan apakah identifier ini adalah literal: true,
	 * false, null atau this.
	 * 
	 * @return
	 */
	private Object gobbleLiteralOrIdentifier() throws ParserException {

		String literal = gobbleRawLiteral();
		if (LITERALS.containsKey(literal)) {
			Object object = LITERALS.get(literal);
			if (object instanceof Boolean) {
				Boolean value = (Boolean) object;
				return createLogical(value, literal);
			} else {
				return createNull(literal);
			}
		} else {
			return createReference(literal);
		}
	}

	/**
	 * Parsing hanya untuk `foo`, `_value`<br>
	 * Dilakukan juga proses pengecekan apakah identifier ini adalah literal: true,
	 * false, null atau this.
	 * 
	 * @return
	 */
	private SReference gobbleIdentifier() throws ParserException {
		String name = gobbleRawLiteral();
		return createReference(name);
	}

	private String gobbleRawLiteral() throws ParserException {

		int start = index;
		boolean backtick = false;
		boolean backtickClosed = false;
		char ch = exprCode(index);

		if (isIdentifierStart(ch)) {
			index++;
		} else {
			index++;
			backtick = true;
		}

		while (index < length) {
			ch = exprCode(index);
			if (!backtick) {
				if (isIdentifierPart(ch)) {
					index++;
				} else {
					break;
				}
			} else {
				if (isIdentifierPart(ch) || isBacktickPart(ch)) {
					index++;
				} else {
					if (isBacktickIdentifier(ch)) {
						backtickClosed = true;
					}
					break;
				}
			}
		}
		String rawLiteral = substr(start, index);
		if (backtick) {
			if (backtickClosed == true) {
				rawLiteral = substr(start + 1, index);
				index++;
			} else {
				String message = "Expected close backtick after " + rawLiteral;
				throw new ParserException(message, this.literal, index);
			}
		}
		return rawLiteral;
	}

	/**
	 * Parse items dalam context array expression.<br>
	 * Di asumsikan karakter '(' atau '[' sudah dibaca dan akan dilakukan pembacaan
	 * daftar expression yang dibatasi oleh comma dan proses akan berakhir jika '('
	 * atau '[' ditemukan.<br>
	 * Contoh: '[bar, baz]'
	 * 
	 * @return
	 * @throws Exception
	 */
	private List<SExpression> gobbleItems(char termination) throws ParserException {
		List<SExpression> items = new ArrayList<>();
		boolean terminated = false;
		boolean expectItem = false;
		while (index < length) {
			gobbleSpaces();
			char ch = exprCode(index);
			if (ch == termination && !expectItem) { // parsing selesai.
				index++;
				terminated = true;
				break;
			} else if (ch == COMMA) { // antara expressions.
				index++;
				expectItem = true;
			} else {
				SExpression node = gobble();
				if (node == null) {
					String message = "Expected expression after '" + COMMA + "'";
					throw new ParserException(message, this.literal, index);
				}
				items.add(node);
				expectItem = false;
			}
		}
		if (!terminated) {
			String message = "Expected termination character '" + termination + "'";
			throw new ParserException(message, this.literal, index);
		}
		return items;
	}

	/**
	 * Parse argument dalam context call.<br>
	 * Di asumsikan karakter '(' atau '[' sudah dibaca dan akan dilakukan pembacaan
	 * daftar expression yang dibatasi oleh comma dan proses akan berakhir jika '('
	 * atau '[' ditemukan.<br>
	 * Contoh: 'call(bar, baz) atau call(bar, var=baz)'
	 * 
	 * @return
	 * @throws Exception
	 */
	private List<SArgument> gobbleArguments() throws ParserException {
		List<SArgument> args = new ArrayList<>();
		boolean terminated = false;
		boolean expectItem = false;
		while (index < length) {
			gobbleSpaces();
			char ch = exprCode(index);
			if (ch == RIGHT_PARENT_THESIS && !expectItem) { // parsing selesai.
				index++;
				terminated = true;
				break;
			} else if (ch == COMMA) { // antara argument.
				index++;
				expectItem = true;
			} else {
				SExpression node = gobbleExpression();
				if (node == null) {
					String message = "Expected expression after '" + COMMA + "'";
					throw new ParserException(message, this.literal, index);
				}
				if (exprCode(index) == EQUALS) {

					// Assignment
					SReference reference = (SReference) node;
					String name = reference.getName();
					index++;
					SExpression value = gobbleExpression();
					if (value == null) {
						String message = "Expected expression after '" + EQUALS + "'";
						throw new ParserException(message, this.literal, index);
					}
					SAssignment argument = factory.createAssignment(name, value);
					args.add(argument);

				} else {

					// Argument
					SArgument argument = factory.createArgument(node);
					args.add(argument);
				}
				expectItem = false;
			}
		}
		if (!terminated) {
			String message = "Expected termination character '" + RIGHT_PARENT_THESIS + "'";
			throw new ParserException(message, this.literal, index);
		}
		return args;
	}

	/**
	 * Proses sebuah nama variable.<br>
	 * Nama variable juga turut serta parameters seperti `foo`, `bar.baz`,
	 * `foo['bar'].baz`. Proses ini juga mengerjakan call seperti
	 * `Math.acos(obj.angle)`
	 */
	private SExpression gobbleVariable() throws ParserException {

		SExpression node = (SExpression) gobbleLiteralOrIdentifier();
		gobbleSpaces();
		char ch = exprCode(index);
		while (ch == PERIOD || ch == LEFT_SQUARE_BRACKET || ch == LEFT_PARENT_THESIS) {

			if (ch == PERIOD) {

				index++;
				gobbleSpaces();
				SPointer object = (SPointer) node;
				SReference property = (SReference) gobbleIdentifier();
				node = createMember(object, property);

			} else if (ch == LEFT_SQUARE_BRACKET) {

				index++;
				SPointer object = (SPointer) node;
				SExpression property = (SExpression) gobbleToken();
				if (!(property instanceof SConstant || property instanceof SReference)) {
					String message = "Expected constant or reference inside square brackets";
					throw new ParserException(message, this.literal, index);
				}
				node = createMember(object, property);
				gobbleSpaces();
				ch = exprCode(index);
				if (ch != RIGHT_SQUARE_BRACKET) {
					String message = "Expected character '" + RIGHT_SQUARE_BRACKET + "'";
					throw new ParserException(message, this.literal, index);
				}
				index++;
				gobbleSpaces();

			} else if (ch == LEFT_PARENT_THESIS) {

				index++;
				SPointer callee = (SPointer) node;
				node = createCall(callee, gobbleArguments());

			}
			gobbleSpaces();
			ch = exprCode(index);
		}
		return node;
	}

	/**
	 * Untuk memproses statement `it test then consequent else alternate`
	 */
	private SConditional gobbleIf() throws ParserException {

		passToken(IF);
		SExpression logical = gobbleExpression();
		gobbleSpaces();

		if (isToken(index, THEN)) {

			passToken(THEN);
			SExpression consequent = gobbleExpression();
			gobbleSpaces();

			if (isToken(index, ELSE)) {

				passToken(ELSE);
				SExpression alternate = gobbleExpression();

				return createConditional(logical, consequent, alternate);

			} else {

				String message = "Expected '" + ELSE + "' token for '" + IF + "' expression";
				throw new ParserException(message, literal, index);

			}

		} else {

			String message = "Expected '" + THEN + "' token for '" + IF + "' expression";
			throw new ParserException(message, literal, index);

		}
	}

	/**
	 * Untuk memproses group yang berada didalam tanda (...).<br>
	 * Proses ini berasumsi tanda pembuka '(' sudah dibaca dan berikutnya adalah
	 * membangun expression di dalam nya sampai ditemukan tanda ')'
	 * 
	 * @return
	 */
	private SExpression gobbleGroup() throws ParserException {

		index++;
		SExpression node = gobble();
		if (node != null) {
			XExpression model = (XExpression) node;
			model.setGroup(true);
		}
		gobbleSpaces();

		if (exprCode(index) == RIGHT_PARENT_THESIS) {

			// Parent thesis untuk membungkus expression
			index++;

			int passes = gobbleSpaces();
			if (isToken(index, LAMBDA_OP)) {
				index -= passes + 1; // Mundur karena group untuk lambda parameter
			} else {
				return node; // Return hanya jika berikutnya bukan lamba operator
			}

		}

		// Daftar identifier untuk lambda
		List<SIdentifier> identifiers = new ArrayList<>();
		if (node != null) {
			SReference reference = (SReference) node;
			identifiers.add(helper.asIdentifier(reference));
		}

		// Looping untuk baca semua parameter sampai dengan close parent thesis
		while (index < length) {

			gobbleSpaces();

			char ch = exprCode(index);
			if (ch == RIGHT_PARENT_THESIS) { // parsing selesai.
				index++;
				break;
			} else if (ch == COMMA) { // antara parameter.
				index++;
			} else {
				SReference reference = gobbleIdentifier();
				gobbleSpaces();
				identifiers.add(helper.asIdentifier(reference));
			}
		}

		gobbleSpaces();
		if (isToken(index, LAMBDA_OP)) {
			passToken(LAMBDA_OP);
			gobbleSpaces();
			SExpression expression = gobbleExpression();
			return createLambda(identifiers, expression);
		} else {
			String message = "Expected '" + LAMBDA_OP + "' token for lambda expression";
			throw new ParserException(message, literal, index);
		}

	}

	/**
	 * Memproses array literal berbentuk [1, 2, 3].<br>
	 * Proses ini berasumsi tanda pembuka sudah di baca kemudia membaca isi-nya
	 * sebagai argument.
	 * 
	 * @return
	 */
	private SList gobbleList() throws ParserException {
		index++;
		return createList(gobbleItems(RIGHT_SQUARE_BRACKET));
	}

	/**
	 * Memproses object literal dengan bentuk `{a: 1, b: [4], c: {x: 5}}`. Proses
	 * berasumsi tanda pembuka sudah di baca dan akan selanjutnya dilakukan proses
	 * pembacaan parameters.
	 * 
	 * @return
	 */
	private SObject gobbleObject() throws ParserException {
		index++;
		return createObject(gobbleProperties());
	}

	/**
	 * Memproses field seperti bentuk `a: 1` atau`b: [4]` atau `c: {x: 5}`<br>
	 * Proses berasumsi karakter pembukan'{' telah di baca untuk kemudian proses
	 * pembacaan field dilakukan sampai ditemukan tanda '}'.
	 * 
	 * @param termination
	 * @return
	 */
	private List<SAssignment> gobbleProperties() throws ParserException {
		List<SAssignment> properties = new ArrayList<>();
		while (index < length) {
			gobbleSpaces();
			char ch = exprCode(index);
			if (ch == RIGHT_CURLY_BRACKET) { // parsing selesai.
				index++;
				break;
			} else if (ch == COMMA) { // antara field.
				index++;
			} else {
				SReference identifier = gobbleIdentifier();
				gobbleSpaces();
				if (exprCode(index) == COLON) {
					index++;
					gobbleSpaces();
					SExpression expression = gobble();
					if (expression == null) {
						String message = "Expected expression after '" + COLON + "' for field";
						throw new ParserException(message, this.literal, index);
					}
					String name = identifier.getName();
					SAssignment field = factory.createAssignment(name, expression);
					properties.add(field);
				} else {
					String message = "Expected '" + COLON + "' after field name";
					throw new ParserException(message, this.literal, index);
				}
			}
		}
		return properties;
	}

	/**
	 * Memproses let expression dengan bentuk `let assignment+ return expression`.
	 * Proses berasumsi tanda pembuka sudah di baca dan akan selanjutnya dilakukan
	 * proses pembacaan parameters.
	 * 
	 * @return
	 */
	private SLet gobbleLet() throws ParserException {
		passToken(LET);
		List<SAssignment> assignments = gobbleAssignments();
		SExpression expression = gobbleExpression();
		return createLet(assignments, expression);
	}

	/**
	 * Memproses property seperti bentuk `a= 1` atau`b= [4]` atau `c= {x: 5}`<br>
	 * 
	 * @param termination
	 * @return
	 */
	private List<SAssignment> gobbleAssignments() throws ParserException {
		List<SAssignment> assignments = new ArrayList<>();
		while (index < length) {
			gobbleSpaces();
			char ch = exprCode(index);
			if (isToken(index, IN)) { // parsing selesai ketemu `in`.
				passToken(IN);
				break;
			} else if (ch == COMMA) { // pemisah assignment.
				index++;
			} else {
				SReference identifier = gobbleIdentifier();
				gobbleSpaces();
				if (exprCode(index) == EQUALS) {
					index++;
					gobbleSpaces();
					SExpression expression = gobble();
					if (expression == null) {
						String message = "Expected expression after '" + EQUALS + "' for assignment";
						throw new ParserException(message, this.literal, index);
					}
					String name = identifier.getName();
					SAssignment assignment = factory.createAssignment(name, expression);
					assignments.add(assignment);
				} else {
					String message = "Expected '" + EQUALS + "' after assignment name";
					throw new ParserException(message, this.literal, index);
				}
			}
		}
		return assignments;
	}

	/**
	 * Memproses simplex expression dengan bentuk `-> expression`.
	 * 
	 * @return
	 */
	private SForeach gobbleForeach() throws ParserException {
		passToken(FOREACH);
		SExpression expression = gobbleExpression();
		return createForeach(expression);
	}

	/**
	 * Majukan index sampai bukan white space.
	 */
	private int gobbleSpaces() {

		int counter = 0;
		if (index < length) {

			char ch = exprCode(index);
			while (isWhitespace(ch) && index < length) {
				ch = exprCode(++index);
				counter++;
			}
		}

		return counter;
	}

	// ==============================================================
	// Method Pembantu
	// ==============================================================

	private char exprCode(int index) {
		if (index < length) {
			return literal.charAt(index);
		}
		return 0;
	}

	private String substr(int start, int end) {
		if (start < length && end <= length) {
			return literal.substring(start, end);
		}
		return null;
	}

	private static boolean isDecimalDigit(char ch) {
		return Character.isDigit(ch);
	}

	private static int getMaxKeyLen(Collection<String> collection) {
		int maxLength = 0;
		int length = 0;
		for (String key : collection) {
			if ((length = key.length()) > maxLength) {
				maxLength = length;
			}
		}
		return maxLength;
	}

	private boolean isIdentifierStart(char ch) {
		return (ch == 95) || // `_`
				(ch >= 65 && ch <= 90) || // A...Z
				(ch >= 97 && ch <= 122); // a...z
	}

	private boolean isToken(int start, String token) {
		int end = Math.min(start + token.length(), length);
		char postChar = exprCode(end);
		String substr = substr(start, end);
		if (substr == null) {
			return false;
		} else {
			return substr.equals(token) && isWhitespace(postChar);
		}
	}

	private boolean isWhitespace(char ch) {
		return ch == SPACE || ch == TAB || ch == NEW_LINE || ch == LINE_FEED;
	}

	private void passToken(String token) {
		index += token.length();
	}

	public static boolean isIdentifierPart(char ch) {
		return (ch == 95) || // `_`
				(ch >= 65 && ch <= 90) || // A...Z
				(ch >= 97 && ch <= 122) || // a...z
				(ch >= 48 && ch <= 57); // 0...9
	}

	public static boolean isBacktickPart(char ch) {
		return ch == SPACE || ch == MINUS || ch == SLASH || ch == PERIOD || ch == ATSIGN || ch == COMMA
				|| ch == LEFT_PARENT_THESIS || ch == RIGHT_PARENT_THESIS;
	}

	private SText createString(String value, String raw) {
		return factory.createText(value);
	}

	private SNumber createNumber(Number value, String raw) {
		return factory.createNumber(value);
	}

	private SLogical createLogical(Boolean value, String raw) {
		return factory.createLogical(value);
	}

	private SNull createNull(String raw) {
		return factory.createNull();
	}

	private SReference createReference(String name) {
		return factory.createReference(name);
	}

	private SAlias createAlias(String name) {
		return factory.createAlias(name);
	}

	private SBinary createBinary(SExpression left, String operator, SExpression right) {
		return factory.createBinary(left, operator, right);
	}

	private SUnary createUnary(String operator, SExpression argument) {
		return factory.createUnary(operator, argument);
	}

	private SConditional createConditional(SExpression logical, SExpression consequent,
			SExpression alternate) {
		return factory.createConditional(logical, consequent, alternate);
	}

	private SList createList(List<SExpression> elements) {
		return factory.createList(elements);
	}

	private SCall createCall(SPointer callee, List<SArgument> args) {
		return factory.createCall(callee, args);
	}

	private SMember createMember(SPointer object, SExpression property) {
		return factory.createMember(object, property);
	}

	private SObject createObject(List<SAssignment> fields) {
		return factory.createObject(fields);
	}

	private SLet createLet(List<SAssignment> assignments, SExpression expression) {
		return factory.createLet(assignments, expression);
	}

	private SForeach createForeach(SExpression expression) {
		return factory.createForeach(expression);
	}

	private SLambda createLambda(List<SIdentifier> identifiers, SExpression expression) {
		return factory.createLambda(identifiers, expression);
	}

	private boolean isBacktickIdentifier(char ch) {
		return (ch == BACK_TICK);
	}

	public static String promoteBacktick(String literal) {
		boolean backtick = false;
		for (int i = 0; i < literal.length(); i++) {
			char ch = literal.charAt(i);
			if (isBacktickPart(ch)) {
				backtick = true;
				break;
			}
		}
		if (backtick) {
			return '`' + literal + '`';
		} else {
			return literal;
		}

	}

	public SExpression getExpression() {
		if (expressions.size() == 0) {
			return null;
		} else {
			return expressions.get(0);
		}
	}
}
