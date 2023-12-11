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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

import XText from "sleman/model/XText";
import XUnary from "sleman/model/XUnary";
import XNumber from "sleman/model/XNumber";
import XLogical from "sleman/model/XLogical";
import XExpression from "sleman/model/XExpression";

export default class LiteralFormula extends Lean {

	public static LEAN_NAME = "LiteralFormula";

	private text: string = "";

	constructor(source?: string | XExpression) {
		super(LiteralFormula.LEAN_NAME);
		if (source !== undefined) {
			if (source instanceof XExpression) {
				if (source instanceof XText) {
					this.text = source.toValue();
				} else if (source instanceof XLogical || source instanceof XNumber) {
					this.text = source.toLiteral();
				} else if (source instanceof XUnary) {
					let argument = source.getArgument();
					if (argument instanceof XNumber) {
						let operator = source.getOperator();
						this.text = operator + argument.getValue();
					} else {
						this.equalize(source);
					}
				} else {
					this.equalize(source);
				}
			} else if (source !== null) {
				let formula = (<string>source).replace(/^\s+/g, '');
				if (formula.charAt(0) === "=") {
					this.text = formula;
				} else {
					this.text = source;
				}
			}
		}
	}

	private equalize(source: XExpression): void {
		this.text = "=" + source.toLiteral();
	}

	public get literal(): string {
		return this.text;
	}

	public set literal(text: string) {
		this.text = (text == null || text === undefined) ? "" : text;
	}

	public get evaluation(): string {
		if (this.isEvaluation) {
			return this.text.substring(1);
		} else {
			return this.text;
		}
	}

	public isConstant(): boolean {
		return !this.isEvaluation();
	}

	public isEvaluation(): boolean {
		return this.text.startsWith("=");
	}

	public copy(): LiteralFormula {
		return new LiteralFormula(this.text);
	}

}

jsonLeanFactory.register(LiteralFormula.LEAN_NAME, LiteralFormula);
