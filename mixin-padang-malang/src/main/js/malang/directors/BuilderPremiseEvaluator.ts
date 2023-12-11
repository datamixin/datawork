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
import XCall from "sleman/model/XCall";
import XNumber from "sleman/model/XNumber";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageList from "bekasi/visage/VisageList";
import VisageBrief from "bekasi/visage/VisageBrief";
import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

import Example from "padang/functions/system/Example";
import BriefValue from "padang/functions/system/BriefValue";
import BriefValueList from "padang/functions/system/BriefValueList";

import InputPlan from "rinjani/plan/InputPlan";

export default class BuilderPremiseEvaluator {

	private premise: BuilderPremise = null;

	constructor(premise: BuilderPremise) {
		this.premise = premise;
	}

	public getPremise(): BuilderPremise {
		return this.premise;
	}

	public getResultExample(formula: string, count: number, callback: (value: VisageValue) => void): void {
		let expression = this.premise.parse(formula);
		let limit = this.createNumber(count);
		let call = this.createCall(Example.FUNCTION_NAME, expression, [limit]);
		this.premise.evaluate(call, callback);
	}

	public getResultBrief(formula: string, callback: (brief: VisageBrief) => void): void {
		let expression = this.premise.parse(formula);
		let call = this.createCall(BriefValue.FUNCTION_NAME, expression);
		this.premise.evaluate(call, callback);
	}

	public getResultBriefType(formula: string, callback: (type: string) => void): void {
		this.getResultBrief(formula, (brief: VisageBrief) => {
			let inputType = this.getInputType(brief);
			callback(inputType);
		});
	}

	public getResultBriefListTypes(source: string | XExpression,
		callback: (types: Map<string, string>) => void): void {

		let expression: XExpression = null;
		if (source instanceof XExpression) {
			expression = <XExpression>source;
		} else {
			expression = this.premise.parse(<string>source);
		}

		let call = this.createCall(BriefValueList.FUNCTION_NAME, expression);
		this.premise.evaluate(call, (list: VisageList) => {
			let values = list.getValues();
			let types = new Map<string, string>();
			for (let value of values) {
				let brief = <VisageBrief>value;
				let name = brief.getKey();
				let type = this.getInputType(brief);
				types.set(name, type);
			}
			callback(types);
		});
	}

	private getInputType(brief: VisageBrief): string {
		let dataType = brief.getType();
		return InputPlan.convertType(dataType);
	}

	private createNumber(value: number): XNumber {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXNumber(value);
	}

	public createCall(callee: string, expression: XExpression, args?: XExpression[]): XCall {
		let factory = SlemanFactory.eINSTANCE;
		let call = factory.createXCall(callee, expression);
		if (args !== undefined) {
			let inputs = call.getArguments();
			for (let arg of args) {
				let argument = factory.createXArgument(arg);
				inputs.add(argument);
			}
		}
		return call;
	}

	public evaluate(expression: XExpression, callback: (value: VisageValue) => void): void {
		this.premise.evaluate(expression, callback);
	}

}
