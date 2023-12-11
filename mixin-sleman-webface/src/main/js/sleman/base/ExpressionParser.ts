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
import { expressionHelper } from "sleman/ExpressionHelper";
import { expressionFactory } from "sleman/ExpressionFactory";

import SLet from "sleman/SLet";
import SCall from "sleman/SCall";
import SList from "sleman/SList";
import SText from "sleman/SText";
import SAlias from "sleman/SAlias";
import SBinary from "sleman/SBinary";
import SMember from "sleman/SMember";
import SNumber from "sleman/SNumber";
import SObject from "sleman/SObject";
import SLambda from "sleman/SLambda";
import SForeach from "sleman/SForeach";
import SArgument from "sleman/SArgument";
import SReference from "sleman/SReference";
import SIdentifier from "sleman/SIdentifier";
import SExpression from "sleman/SExpression";
import SAssignment from "sleman/SAssignment";
import SConditional from "sleman/SConditional";
import XExpression from "sleman/model/XExpression";

// =============================================================
// Symbols
// =============================================================
let LET = "let";
let IN = "in";

let IF = "if";
let THEN = "then";
let ELSE = "else";

let LAMBDA_OP = "->";

let FOREACH = "foreach";

let TAB = 9;
let NEW_LINE = 10;
let LINE_FEED = 13;
let SPACE = 32;
let SLASH = 47;
let DOLLAR = 36;
let ATSIGN = 35;
let DOUBLE_QUOTE = 34;
let SINGLE_QUOTE = 39;
let LEFT_PARENT_THESIS = 40;
let RIGHT_PARENT_THESIS = 41;
let PLUS = 43;
let COMMA = 44;
let MINUS = 45;
let PERIOD = 46;
let COLON = 58;
let EQUALS = 61;
let LEFT_SQUARE_BRACKET = 91;
let RIGHT_SQUARE_BRACKET = 93;
let BACK_TICK = 96;
let LEFT_CURLY_BRACKET = 123;
let RIGHT_CURLY_BRACKET = 125;
let SMALL_E = 101;
let LARGE_E = 69;

let START = "start";
let END = "end";

export default class ExpressionParser {


	// ==============================================================
	// Daftar Constants
	// ==============================================================
	private literals = (function() {
		let literals: { [name: string]: () => SExpression } = {};
		literals["true"] = () => expressionFactory.createLogical(true);
		literals["false"] = () => expressionFactory.createLogical(false);
		literals["null"] = () => expressionFactory.createNull();
		return literals;
	})();

	public static UNARY_OPS = (function() {
		let ops: string[] = [];
		ops.push("-");
		ops.push("!");
		ops.push("+");
		return ops;
	})();

	public static UNARY_WORDS = (function() {
		let words: string[] = [];
		words.push("not");
		return words;
	})();

	public static BINARY_OPS = (function() {
		let ops: { [name: string]: any } = {};
		ops["||"] = 1;
		ops["or"] = 1;
		ops["&&"] = 2;
		ops["and"] = 2;
		ops["|"] = 3;
		ops["^"] = 4;
		ops["&"] = 5;
		ops["=="] = 6;
		ops["!="] = 6;
		ops["<"] = 7;
		ops[">"] = 7;
		ops["=~"] = 7;
		ops["<="] = 7;
		ops[">="] = 7;
		ops["<>"] = 7;
		ops["<<"] = 8;
		ops[">>"] = 8;
		ops[">>>"] = 8;
		ops["+"] = 9;
		ops["-"] = 9;
		ops["*"] = 10;
		ops["/"] = 10;
		ops["%"] = 10;
		return ops;
	})();

	public static BINARY_WORDS = (function() {
		let words: { [name: string]: any } = {};
		words["or"] = 1;
		words["and"] = 2;
		return words;
	})();

	public static getMaxKeyLen(collection: string[]): number {
		let maxLength = 0;
		for (let i = 0; i < collection.length; i++) {
			let key = collection[i];
			let length = key.length;
			if (length > maxLength) {
				maxLength = length;
			}
		}
		return maxLength;
	}

	public static maxUnaryOperationLength = ExpressionParser.getMaxKeyLen(ExpressionParser.UNARY_OPS);
	public static maxUnaryWordLength = ExpressionParser.getMaxKeyLen(ExpressionParser.UNARY_WORDS);
	public static maxBinaryOperationLength = ExpressionParser.getMaxKeyLen(Object.keys(ExpressionParser.BINARY_OPS));
	public static maxBinaryWordLength = ExpressionParser.getMaxKeyLen(Object.keys(ExpressionParser.BINARY_WORDS));

	// ==============================================================
	// Instance Fields
	// ==============================================================
	private index = 0;
	private length = 0;
	private expr: string;
	private expressions: SExpression[] = [];

	constructor(expr: string) {
		this.expr = expr;
		this.length = expr.length;
		while (this.index < this.length) {
			let expression = this.gobble(this.index);
			if (expression === null) {
				break;
			} else {
				this.expressions.push(expression);
			}
		}
		if (this.index < this.length) {
			let message = "Fail parsing " + this.exprChar(this.index);
			throw new ParserError(message, this.index);
		}
	}

	// ==============================================================
	// Rutin Parser
	// ==============================================================
	private gobble(start: number): SExpression {
		return this.gobbleExpression(start);
	}

	/**
	 * Melakukan proses parsing satuan expression.<br>
	 * Contoh: `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
	 * 
	 * @return Expression
	 */
	private gobbleExpression(start: number): SExpression {

		let left = this.gobbleToken();
		let biop = this.gobbleBinaryOp();

		// Jika tidak ada binary operator maka kembalikan yang left.
		if (biop === null) {
			return left;
		}

		// Jika ada binary operator maka kita mulai menyusun untuk menempatkan
		// binary operation sesuai precedence structure-n ya.
		let biopInfo = new OperationInfo(biop, this.binaryPrecedence(biop));

		let right = this.gobbleToken();
		if (right === null) {
			throw new ParserError("Expected expression after '" + biop + "'", this.index);
		}
		let leftInfo = new ExpressionInfo(left);
		let rightInfo = new ExpressionInfo(right);
		let stack: BinaryInfo[] = [];
		stack.push(leftInfo);
		stack.push(biopInfo);
		stack.push(rightInfo);

		// Pengaturan precedence secara recursive [recursive descent]:
		// http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
		while ((biop = this.gobbleBinaryOp()) != null) {
			let prec = this.binaryPrecedence(biop);

			if (prec === 0) {
				break;
			}
			biopInfo = new OperationInfo(biop, prec);

			// Reduce: buat sebuah binary expression dari tiga anggota teratas.
			while ((stack.length > 2)
				&& (prec <= stack[stack.length - 2].getPrecedence())) {
				right = (<ExpressionInfo>stack.pop()).getExpression();
				biop = (<OperationInfo>stack.pop()).getOperation();
				left = (<ExpressionInfo>stack.pop()).getExpression();
				let binary = this.createBinary(start, left, biop, right);
				stack.push(new ExpressionInfo(binary));
			}

			let node = this.gobbleToken();
			if (node === null) {
				throw new ParserError("Expected expression after '" + biop + "'", this.index);
			}
			stack.push(biopInfo);
			stack.push(new ExpressionInfo(node));
		}

		let i = stack.length - 1;
		let node = (<ExpressionInfo>stack[i]).getExpression();
		while (i > 1) {
			left = (<ExpressionInfo>stack[i - 2]).getExpression();
			biop = (<OperationInfo>stack[i - 1]).getOperation();
			node = this.createBinary(start, left, biop, node);
			i -= 2;
		}
		return node;
	}

	/**
	 * Kembalikan precedence dari binary operator tersebut atau `0` jika bukan
	 * binary operator.
	 * 
	 * @param opExpression
	 * @return
	 */
	private binaryPrecedence(opExpression: string): number {
		let normalizedOpExpression: string = opExpression.toLowerCase();
		if (ExpressionParser.BINARY_OPS[normalizedOpExpression] !== undefined) {
			return ExpressionParser.BINARY_OPS[normalizedOpExpression];
		} else {
			return ExpressionParser.BINARY_WORDS[normalizedOpExpression];
		}
	}

	/**
	 * Cari operator untuk unary operation. Pencarian dilakukan dari yang
	 * terpanjang seperti `not` sampai dengan yang terpendek.
	 */
	private gobbleUnaryOp(): string {
		let operator = this.gobbleOp(ExpressionParser.UNARY_OPS, ExpressionParser.maxUnaryOperationLength);
		if (operator == null) {
			return this.gobbleWord(ExpressionParser.UNARY_WORDS, ExpressionParser.maxUnaryWordLength);
		}
		return operator;
	}

	/**
	 * Cari operator untuk binary operation. Pencarian dilakukan dari yang
	 * terpanjang seperti `===` sampai dengan yang terpendek.
	 */
	private gobbleBinaryOp(): string {
		let operator = this.gobbleOp(Object.keys(ExpressionParser.BINARY_OPS), ExpressionParser.maxBinaryOperationLength);
		if (operator == null) {
			return this.gobbleWord(Object.keys(ExpressionParser.BINARY_WORDS), ExpressionParser.maxBinaryWordLength);
		}
		return operator;
	}

	/**
	 * Cari operator, pencarian dilakukan dari yang terpanjang 
	 * seperti `===` sampai dengan yang terpendek.
	 */
	private gobbleOp(ops: string[], maxOperationLength: number): string {
		this.gobbleSpaces();
		let start = this.index;
		let end = Math.min(this.index + maxOperationLength, this.length);
		let toCheck = this.substr(start, end);
		if (toCheck === null) {
			return null;
		}
		let tcLength = toCheck.length;
		while (tcLength > 0) {
			if (ops.indexOf(toCheck) !== -1) {
				this.index += tcLength;
				return toCheck;
			}
			toCheck = toCheck.substring(0, --tcLength);
		}
		return null;
	}

	/**
	 * Cari word pencarian dilakukan dari yang terpanjang 
	 * seperti `not` sampai dengan yang terpendek.
	 */
	private gobbleWord(words: string[], maxWordLength: number): string {
		this.gobbleSpaces();
		let start = this.index;
		let end = Math.min(this.index + maxWordLength + 1, this.length);
		let toCheck = this.substr(start, end);
		if (toCheck === null) {
			return null;
		}
		let tcLength = toCheck.length;
		while (tcLength > 0) {
			let lastChar = toCheck.charCodeAt(tcLength - 1);
			let word = toCheck.substring(0, tcLength - 1);
			if (words.indexOf(word) !== -1 && this.isWhitespace(lastChar)) {
				this.index += tcLength - 1;
				return word;
			}
			toCheck = toCheck.substring(0, --tcLength);
		}
		return null;
	}

	/**
	 * Satu bagian dari binary expression.
	 * 
	 * @return
	 */
	private gobbleToken(): SExpression {

		this.gobbleSpaces();
		let start = this.index;
		let ch = this.exprCode(this.index);

		if (this.isToken(start, LET)) {

			// Let expression
			return this.gobbleLet();

		} else if (this.isToken(start, FOREACH)) {

			// Foreach expression
			return this.gobbleForeach(start);

		} else if (this.isToken(start, IF)) {

			// If expression
			return this.gobbleIf(start);

		} else if (ch == DOLLAR) {

			// Char dollar '$' yang merupakan alias
			return this.gobbleAlias(start);

		} else if (this.isDecimalDigit(ch) || ch == PERIOD) {

			// Char code PERIOD adalah dot '.' yang merupakan awal numeric literal.
			return this.gobbleNumber(start);

		} else if (ch === SINGLE_QUOTE || ch === DOUBLE_QUOTE) {

			// Single atau double quotes
			return this.gobbleStringLiteral(start);

		} else if (ch === LEFT_SQUARE_BRACKET) {

			// Square brackets [ ]
			return this.gobbleList(start);

		} else if (ch === LEFT_CURLY_BRACKET) {

			// Curly brackets or braces { }
			return this.gobbleObject(start);

		} else if (ch === LEFT_PARENT_THESIS) {

			// Open parentheses
			return this.gobbleGroup(start);

		} else {

			let operator = this.gobbleUnaryOp();
			if (operator != null) {
				let argument = this.gobbleToken();
				if (argument === null) {
					throw new ParserError("Expected unary '" + operator + "' argument", this.index);
				}
				return this.createUnaryExpression(start, operator, argument);
			}

			// Last chance is identifier
			if (this.isIdentifierStart(ch) || this.isBacktickIdentifier(ch)) {

				// `foo`, `bar.baz`
				return this.gobbleVariable(start);
			}


		}

		return null;
	}

	/**
	 * Parsing angka sederhana seperti '12', '3.4', '.5'<br>
	 * 
	 * @return
	 */
	private gobbleNumber(start: number): SExpression {

		let numberChars: string[] = [];
		while (this.isDecimalDigit(this.exprCode(this.index))) { // Dimulai dengan digit.
			numberChars.push(this.exprChar(this.index));
			this.index++;
		}

		if (this.exprCode(this.index) === PERIOD) { // Dimulai dengan dot.

			numberChars.push(this.exprChar(this.index++));
			while (this.isDecimalDigit(this.exprCode(this.index))) {
				numberChars.push(this.exprChar(this.index++));
			}
		}

		// Tanda exponent 'e' atau 'E'.
		if (this.exprCode(this.index) === SMALL_E || this.exprCode(this.index) === LARGE_E) {
			numberChars.push(this.exprChar(this.index));
			this.index++;

			// Simbol exponent '+' atau '-'.
			if (this.exprCode(this.index) === PLUS || this.exprCode(this.index) === MINUS) {
				numberChars.push(this.exprChar(this.index++));
			}

			// Nilai exponent.
			while (this.isDecimalDigit(this.exprCode(this.index))) {
				numberChars.push(this.exprChar(this.index));
				this.index++;
			}
			if (!this.isDecimalDigit(this.exprCode(this.index - 1))) {
				let message = "Expected exponent value";
				throw new ParserError(message, this.index);
			}
		}

		// Pastikan ini bukan variable yang dimulai angka berbentuk 123abc.
		if (this.isIdentifierStart(this.exprCode(this.index))) {
			let message = "Variable names cannot start with a number";
			throw new ParserError(message, this.index);
		}

		let literal: any = numberChars.join('');
		return this.createNumber(start, literal * 1);
	}

	/**
	 * Memproses foreach expression dengan bentuk `-> expression`.
	 * 
	 * @return
	 */
	private gobbleAlias(start: number): SExpression {
		this.index++;
		let variable = this.gobbleVariable(start);
		if (expressionHelper.isReference(variable)) {

			let reference = <SReference>variable;
			let name = reference.getName();
			return this.createAlias(start, name);

		} else {
			return this.createAliasFromMember(start, <SMember>variable);
		}
	}

	private createAliasFromMember(start: number, member: SMember): SExpression {

		let object = member.getObject();
		if (expressionHelper.isReference(object)) {

			let reference = <SReference>object;
			let name = reference.getName();
			let alias = this.createAlias(start, name);

			let property = member.getProperty();
			return this.createMember(start, alias, property);

		} else {

			return this.createAliasFromMember(start, <SMember>object);

		}

	}

	/**
	 * Parsing string literal dengan double quote dengan dukungan dasar escape
	 * character.
	 * 
	 * @return
	 */
	private gobbleStringLiteral(start: number): SExpression {

		let stringChars: string[] = [];
		let quote = this.exprCode(this.index++);
		let closed = false;
		let ch: number;

		while (this.index < this.length) {
			ch = this.exprCode(this.index++);
			if (ch === quote) {
				closed = true;
				break;
			} else if (ch === 92) { // '\\'
				let next = this.exprCode(this.index++);
				if (!(next === 34 || next === 92)) {
					stringChars.push('\\');
				}
				stringChars.push(String.fromCharCode(next));
			} else {
				stringChars.push(String.fromCharCode(ch));
			}
		}

		if (!closed) {
			let message = "Unclosed quote after " + this.expr.substring(start, this.index) + "";
			throw new ParserError(message, this.index);
		}

		let literal = stringChars.join('');
		return this.createText(start, literal);
	}

	/**
	 * Parsing hanya untuk `foo`, `_value`, `true`, `false` atau `null`<br>
	 * Dilakukan juga proses pengecekan apakah identifier ini adalah literal: true,
	 * false, null atau this.
	 * 
	 * @return
	 */
	private gobbleLiteralOrIdentifier(start: number): SExpression {
		let identifier = this.gobbleRawLiteral(start);
		if (this.literals[identifier]) {
			return this.literals[identifier]();
		} else {
			return this.createReference(start, identifier);
		}
	}

	/**
	 * Parsing hanya untuk `foo`, `_value`<br>
	 * Dilakukan juga proses pengecekan apakah identifier ini adalah literal: true,
	 * false, null atau this.
	 * 
	 * @return
	 */
	private gobbleIdentifier(start: number): SReference {
		let identifier = this.gobbleRawLiteral(start);
		return this.createReference(start, identifier);
	}


	private gobbleRawLiteral(start: number): string {

		let ch = this.exprCode(this.index);
		let backtick = false;
		let backtickClosed = false;

		if (this.isIdentifierStart(ch)) {
			this.index++;
		} else {
			if (this.isBacktickIdentifier(ch)) {
				this.index++;
				backtick = true;
			} else {
				let char = this.exprChar(this.index);
				throw new ParserError("Unexpected identifier character '" + char + "'", this.index);
			}
		}

		while (this.index < this.length) {
			ch = this.exprCode(this.index);
			if (backtick === false) {
				if (this.isIdentifierPart(ch)) {
					this.index++;
				} else {
					break;
				}
			} else {
				if (this.isIdentifierPart(ch) || ExpressionParser.isBacktickPart(ch)) {
					this.index++;
				} else {
					if (this.isBacktickIdentifier(ch)) {
						backtickClosed = true;
					}
					break;
				}
			}
		}
		let rawLiteral = this.substr(start, this.index);
		if (backtick) {
			if (backtickClosed == true) {
				rawLiteral = this.substr(start + 1, this.index);
				this.index++;
			} else {
				throw new ParserError("Unclosed backtick identifier '" + rawLiteral + "'", this.index);
			}
		}

		return rawLiteral;
	}

	/**
	 * Parse argument dalam context function list expression.<br>
	 * Di asumsikan karakter '(' atau '[' sudah dibaca dan akan dilakukan
	 * pembacaan daftar expression yang dibatasi oleh comma dan proses akan
	 * berakhir jika ')' atau ']' ditemukan.<br>
	 * Contoh: '[bar, baz]'
	 * 
	 * @return
	 */
	private gobbleElements(termination: number): SExpression[] {
		let args: SExpression[] = [];
		while (this.index < this.length) {
			this.gobbleSpaces();
			let ch = this.exprCode(this.index);
			if (ch === termination) { // parsing selesai.
				this.index++;
				break;
			} else if (ch === COMMA) { // antara expressions.
				this.index++;
			} else {
				let node = this.gobble(this.index);
				if (node === null) {
					throw new ParserError("Expected expression after comma", this.index);
				}
				args.push(node);
			}
		}
		return args;
	}

	/**
	 * Parse argument dalam context function call expression.<br>
	 * Di asumsikan karakter '(' sudah dibaca dan akan dilakukan
	 * pembacaan daftar expression yang dibatasi oleh comma dan proses akan
	 * berakhir jika ')' ditemukan.<br>
	 * Contoh: 'call(bar, baz)' atau 'call(bar, baz)'  
	 * 
	 * @return
	 */
	private gobbleArguments(): SArgument[] {
		let args: SArgument[] = [];
		while (this.index < this.length) {
			this.gobbleSpaces();
			let ch = this.exprCode(this.index);
			if (ch === RIGHT_PARENT_THESIS) { // parsing selesai.
				this.index++;
				break;
			} else if (ch === COMMA) { // antara expressions.
				this.index++;
			} else {
				let node = this.gobble(this.index);
				if (node === null) {
					throw new ParserError("Expected expression after comma", this.index);
				}
				if (this.exprCode(this.index) == EQUALS) {

					// Assignment
					let reference = <SReference>node;
					let name = reference.getName();
					this.index++;
					let value = this.gobbleExpression(this.index);
					if (value == null) {
						let message = "Expected expression after '" + EQUALS + "'";
						throw new ParserError(message, this.index);
					}
					let argument = expressionFactory.createAssignment(name, value);
					args.push(argument);

				} else {

					// Argument
					let argument = expressionFactory.createArgument(node);
					args.push(argument);
				}
			}
		}
		return args;
	}

	/**
	 * Proses sebuah nama variable.<br>
	 * Nama variable juga turut serta parameters seperti `foo`, `bar.baz`,
	 * `foo['bar'].baz`. Proses ini juga mengerjakan function call seperti
	 * `Math.acos(obj.angle)`
	 */
	private gobbleVariable(start: number): SExpression {

		let node = this.gobbleLiteralOrIdentifier(this.index);
		this.gobbleSpaces();

		let ch = this.exprCode(this.index);

		// While '.' or '[' or '('
		while (ch === PERIOD || ch === LEFT_SQUARE_BRACKET || ch === LEFT_PARENT_THESIS) {

			if (ch === PERIOD) {

				this.index++;
				this.gobbleSpaces();
				let property = <SReference>this.gobbleLiteralOrIdentifier(this.index);
				node = this.createMember(start, node, property);

			} else if (ch === LEFT_SQUARE_BRACKET) {

				this.index++;
				let property = <SExpression>this.gobbleToken();
				if (!expressionHelper.isConstant(property)) {
					let message = "Expected constant inside square brackets";
					throw new ParserError(message, this.index);
				}
				node = this.createMember(start, node, property);
				this.gobbleSpaces();
				ch = this.exprCode(this.index);
				if (ch !== RIGHT_SQUARE_BRACKET) {
					throw new ParserError("Unclosed '[' character", this.index);
				}
				this.index++;
				this.gobbleSpaces();

			} else if (ch === LEFT_PARENT_THESIS) {

				// Sebuah function call di buat, proses semua arguments.
				this.index++;
				let callee = <SExpression>node;
				node = this.createCall(start, callee, this.gobbleArguments());
			}

			this.gobbleSpaces();
			ch = this.exprCode(this.index);
		}
		return node;
	}

	/**
	 * Untuk menproses statement `it test then consequent else alternate`
	 */
	private gobbleIf(start: number): SConditional {

		this.passToken(IF);
		let logical = this.gobbleExpression(start);
		this.gobbleSpaces();

		if (this.isToken(this.index, THEN)) {

			this.passToken(THEN);
			let consequent = this.gobbleExpression(start);
			this.gobbleSpaces();

			if (this.isToken(this.index, ELSE)) {

				this.passToken(ELSE);
				let alternate = this.gobbleExpression(start);

				return this.createConditional(start, logical, consequent, alternate);

			} else {

				let message = "Expected '" + ELSE + "' token for '" + IF + "' expression";
				throw new ParserError(message, this.index);

			}

		} else {

			let message = "Expected '" + THEN + "' token for '" + IF + "' expression";
			throw new ParserError(message, this.index);

		}
	}

	/**
	 * Untuk memproses group yang berada didalam tanda (...).<br>
	 * Proses ini berasumsi tanda pembuka '(' sudah dibaca dan berikutnya adalah
	 * membangun expression di dalam nya sampai ditemukan tanda ')'
	 * 
	 * @return
	 */
	private gobbleGroup(start: number): any {
		this.index++;
		let node = this.gobble(start);
		if (node != null) {
			let model = <XExpression>node;
			model.setGroup(true);
		}
		this.gobbleSpaces();
		if (this.exprCode(this.index) === RIGHT_PARENT_THESIS) {
			this.index++;
			let passes = this.gobbleSpaces();
			if (this.isToken(this.index, LAMBDA_OP)) {
				this.index -= passes + 1; // Mundur karena group untuk function parameter
			} else {
				return node; // Return hanya jika berikutnya bukan lamba operator
			}
		}

		// Daftar identifier untuk function        
		let identifiers: SIdentifier[] = [];
		if (node !== null) {
			let reference = <SReference>node;
			let name = reference.getName();
			let identifier = expressionFactory.createIdentifier(name);
			identifiers.push(identifier);
		}

		// Looping untuk baca semua parameter sampai dengan close parent thesis
		while (this.index < this.length) {

			this.gobbleSpaces();

			let ch = this.exprCode(this.index);
			if (ch == RIGHT_PARENT_THESIS) { // parsing selesai.
				this.index++;
				break;
			} else if (ch == COMMA) { // antara parameter.
				this.index++;
			} else {
				let parameter = this.gobbleIdentifier(this.index);
				this.gobbleSpaces();
				let name = parameter.getName();
				let identifier = expressionFactory.createIdentifier(name);
				identifiers.push(identifier);
			}
		}

		this.gobbleSpaces();
		if (this.isToken(this.index, LAMBDA_OP)) {
			this.passToken(LAMBDA_OP);
			this.gobbleSpaces();
			let expression = this.gobbleExpression(this.index);
			return this.createLambda(start, identifiers, expression);
		} else {
			let message = "Expected '" + LAMBDA_OP + "' token for function expression";
			throw new ParserError(message, this.index);
		}

	}

	/**
	 * Memproses array literal berbentuk [1, 2, 3].<br>
	 * Proses ini berasumsi tanda pembuka sudah di baca kemudia membaca isi-nya
	 * sebagai argument.
	 * 
	 * @return
	 */
	private gobbleList(start: number): SExpression {
		this.index++;
		return this.createList(start, this.gobbleElements(RIGHT_SQUARE_BRACKET));
	}

	/**
	 * Memproses object literal dengan bentuk `{a: 1, b: [4], c: {x: 5}}`.
	 * Proses berasumsi tanda pembuka sudah di baca dan akan selanjutnya
	 * dilakukan proses pembacaan parameters.
	 * 
	 * @return
	 */
	private gobbleObject(start: number): SExpression {
		this.index++;
		let parameters = this.gobbleFields(RIGHT_CURLY_BRACKET);
		return this.createObject(start, parameters);
	}

	/**
	 * Memproses property seperti bentuk `a: 1` atau`b: [4]` atau `c: {x: 5}}`<br>
	 * Proses berasumsi karakter pembukan'{' telah di baca untuk kemudian proses
	 * pembacaan property dilaukan sampai ditemukan tanda '}'.
	 * 
	 * @param termination
	 * @return
	 */
	private gobbleFields(termination: number): SAssignment[] {
		let ch: number;
		let fields: SAssignment[] = [];
		while (this.index < this.length) {
			this.gobbleSpaces();
			ch = this.exprCode(this.index);
			if (ch === termination) { // parsing selesai.
				this.index++;
				break;
			} else if (ch === COMMA) { // antara parameters.
				this.index++;
			} else {
				let identifier = this.gobbleIdentifier(this.index);
				this.gobbleSpaces();
				if (this.exprCode(this.index) === COLON) {
					this.index++;
					this.gobbleSpaces();
					let expression = this.gobble(this.index);
					if (expression === null) {
						throw new ParserError("Expected expression after comma", this.index);
					}
					let name = identifier.getName();
					let field = expressionFactory.createAssignment(name, expression);
					fields.push(field);
				} else {
					throw new ParserError("Expected colon after key", this.index);
				}
			}
		}
		return fields;
	}

	/**
	 * Memproses let expression dengan bentuk `let assignment+ return expression`.
	 * Proses berasumsi tanda pembuka sudah di baca dan akan selanjutnya dilakukan
	 * proses pembacaan parameters.
	 * 
	 * @return
	 */
	private gobbleLet(): SLet {
		let start = this.index;
		this.passToken(LET);
		let assignments = this.gobbleVariables();
		let expression = this.gobbleExpression(this.index);
		return this.createLet(start, assignments, expression);
	}

	/**
	 * Memproses property seperti bentuk `a= 1` atau`b= [4]` atau `c= {x: 5}`<br>
	 * 
	 * @return
	 */
	private gobbleVariables(): SAssignment[] {
		let assignments: SAssignment[] = [];
		while (this.index < this.length) {
			this.gobbleSpaces();
			let ch = this.exprCode(this.index);
			if (this.isToken(this.index, IN)) { // parsing selesai ketemu `in`.
				this.passToken(IN);
				break;
			} else if (ch == COMMA) { // pemisah assignment.
				this.index++;
			} else {
				let identifier = this.gobbleIdentifier(this.index);
				this.gobbleSpaces();
				if (this.exprCode(this.index) === EQUALS) {
					this.index++;
					this.gobbleSpaces();
					let expression = this.gobble(this.index);
					if (expression === null) {
						let message = "Expected expression after '=' for assignment";
						throw new ParserError(message, this.index);
					}
					let name = identifier.getName();
					let assignment = expressionFactory.createAssignment(name, expression);
					assignments.push(assignment);
				} else {
					let message = "Expected '=' after assignment name";
					throw new ParserError(message, this.index);
				}
			}
		}
		return assignments;
	}

	/**
	 * Memproses foreach expression dengan bentuk `-> expression`.
	 * 
	 * @return
	 */
	private gobbleForeach(start: number): SForeach {
		this.passToken(FOREACH);
		let expression = this.gobbleExpression(start);
		return this.createForeach(start, expression);
	}

	/**
	 * Majukan index sampai bukan white space.
	 */
	private gobbleSpaces(): number {

		let counter = 0;
		if (this.index < this.length) {

			// Character space dan tab
			let ch = this.exprCode(this.index);
			while (this.isWhitespace(ch) && this.index < this.length) {
				ch = this.exprCode(++this.index);
				counter++;
			}
		}

		return counter;
	}

	// ==============================================================
	// Method Pembantu
	// ==============================================================

	private exprCode(index: number): number {
		return this.expr.charCodeAt(index);
	}

	private exprChar(index: number): string {
		return this.expr.charAt(index);
	}

	private substr(start: number, end: number): string {
		if (start < this.length && end <= this.length) {
			return this.expr.substring(start, end);
		}
		return null;
	}

	private isDecimalDigit(ch: number): boolean {
		return ch >= 48 && ch <= 57;
	}

	private isIdentifierStart(ch: number): boolean {
		return (ch === 95) || // `_`
			(ch >= 65 && ch <= 90) || // A...Z
			(ch >= 97 && ch <= 122); // a...z
	}

	private isToken(start: number, token: string): boolean {
		let end = Math.min(start + token.length, this.length);
		let postChar = this.exprCode(end);
		let substr = this.substr(start, end);
		return substr === token && this.isWhitespace(postChar);
	}

	private isWhitespace(ch: number): boolean {
		return ch === SPACE || ch === TAB || ch === NEW_LINE || ch === LINE_FEED;
	}

	private passToken(token: string): void {
		this.index += token.length;
	}

	private isBacktickIdentifier(ch: number): boolean {
		return (ch === BACK_TICK); // "`"
	}

	private isIdentifierPart(ch: number): boolean {
		return (ch === 95) || // `_`
			(ch >= 65 && ch <= 90) || // A...Z
			(ch >= 97 && ch <= 122) || // a...z
			(ch >= 48 && ch <= 57); // 0...9
	}

	private setStartEnd(expression: any, start: number): void {
		expression[START] = start;
		expression[END] = this.index;
	}

	private createNumber(start: number, value: number): SNumber {
		let expression = expressionFactory.createNumber(value);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createText(start: number, value: string): SText {
		let expression = expressionFactory.createText(value);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createAlias(start: number, name: string): SAlias {
		let alias = expressionFactory.createAlias(name);
		this.setStartEnd(alias, start);
		return alias;
	}

	private createReference(start: number, name: string): SReference {
		let expression = expressionFactory.createReference(name);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createBinary(start: number, left: SExpression, operator: string, right: SExpression): SBinary {
		let expression = expressionFactory.createBinary(left, operator, right);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createUnaryExpression(start: number, operator: string, argument: SExpression): SExpression {
		if (operator === "-" && expressionHelper.isNumber(argument)) {
			return this.createNumber(start, (<SNumber><any>argument).toValue() * -1);
		} else {
			let expression = expressionFactory.createUnary(operator, argument);
			this.setStartEnd(expression, start);
			return expression;
		}
	}

	private createConditional(start: number, logical: SExpression, consequent: SExpression,
		alternate: SExpression): SConditional {
		let conditional = expressionFactory.createConditional(logical, consequent, alternate);
		this.setStartEnd(conditional, start);
		return conditional;
	}

	private createList(start: number, elements: SExpression[]): SList {
		let expression = expressionFactory.createList(elements);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createCall(start: number, callee: SExpression, args: SArgument[]): SCall {
		let expression = expressionFactory.createCall(callee, args);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createObject(start: number, fields: SAssignment[]): SObject {
		let expression = expressionFactory.createObject(fields);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createMember(start: number, object: SExpression, property: SExpression): SMember {
		let expression = expressionFactory.createMember(object, property);
		this.setStartEnd(expression, start);
		return expression;
	}

	private createLet(start: number, assignments: SAssignment[], expression: SExpression): SLet {
		let slemanLet = expressionFactory.createLet(assignments, expression);
		this.setStartEnd(slemanLet, start);
		return slemanLet;
	}

	private createForeach(start: number, expression: SExpression): SForeach {
		let foreach = expressionFactory.createForeach(expression);
		this.setStartEnd(foreach, start);
		return foreach;
	}

	private createLambda(start: number, parameters: SIdentifier[], expression: SExpression): SLambda {
		let lambda = expressionFactory.createLambda(parameters, expression);
		this.setStartEnd(lambda, start);
		return lambda;
	}

	private static isBacktickPart(ch: number): boolean {
		return ch === SPACE || ch === MINUS || ch === SLASH || ch === PERIOD || ch === ATSIGN || ch === COMMA
			|| ch === LEFT_PARENT_THESIS || ch === RIGHT_PARENT_THESIS;
	}

	public static promoteBacktick(literal: string): string {
		let backtick = false;
		for (let i = 0; i < literal.length; i++) {
			let ch = literal.charCodeAt(i);
			if (ExpressionParser.isBacktickPart(ch)) {
				backtick = true;
				break;
			}
		}
		if (backtick === true) {
			return '`' + literal + '`';
		} else {
			return literal;
		}
	}

	public getExpression(): SExpression {
		if (this.expressions.length === 0) {
			return null;
		} else {
			return this.expressions[0];
		}
	}
}

// ==============================================================
// Object Pembantu
// ==============================================================
class BinaryInfo {

	private precedence: number;

	constructor(precedence: number) {
		this.precedence = precedence;
	}

	public getPrecedence(): number {
		return this.precedence;
	}
}

class OperationInfo extends BinaryInfo {

	private operation: string;

	constructor(operation: string, precedence: number) {
		super(precedence);
		this.operation = operation;
	}

	public getOperation(): string {
		return this.operation;
	}
}

class ExpressionInfo extends BinaryInfo {

	private expression: SExpression;

	constructor(expression: SExpression) {
		super(-1);
		this.expression = expression;
	}

	public getExpression(): SExpression {
		return this.expression;
	}
}

export class ParserError extends Error {

	private detail: string = null;
	private position: number = null;

	constructor(message: string, position: number) {
		super(message);
		this.detail = message;
		this.position = position;
	}

	public get message(): string {
		return this.detail;
	}

	public get index(): number {
		return this.position;
	}
}

