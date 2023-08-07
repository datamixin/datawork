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
import EList from "webface/model/EList";

import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XObject from "sleman/model/XObject";
import XConstant from "sleman/model/XConstant";
import XArgument from "sleman/model/XArgument";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import FormulaParser from "bekasi/FormulaParser";

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";
import PadangCreator from "padang/model/PadangCreator";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export abstract class Instruction {

	private plan: FunctionPlan = null;

	constructor(plan: FunctionPlan) {
		this.plan = plan;
	}

	public abstract createCaption(options: { [name: string]: XExpression }): string;

	public isCombinable(_name: string): boolean {
		return false;
	}

	public combine(_name: string, _prevValue: XExpression, _nextValue: XExpression): XExpression {
		throw new Error("Instruction not combinable");
	}

	public createOptions(args: EList<XArgument> | XList): XOption[] {

		// Expressions
		let expressions: XExpression[] = [];
		if (args instanceof XList) {
			let elements = args.getElements();
			for (let i = 0; i < elements.size; i++) {
				let expression = elements.get(i);
				expressions.push(expression);
			}
		} else {
			for (let i = 0; i < args.size; i++) {
				let expression = args.get(i).getExpression();
				expressions.push(expression);
			}
		}

		// Dataset
		let start = 0;
		let parameters = this.plan.getParameters();
		if (parameters.length > 1) {
			let parameter = parameters[0];
			let name = parameter.getName();
			if (name === DatasetFunction.DATASET_PLAN.getName()) {
				start = 1;
			}
		}

		// Options
		let options: XOption[] = [];
		for (let i = start; i < expressions.length; i++) {
			let parameter = parameters[i];
			let name = parameter.getName();
			let option = this.createOption(name, expressions, i);
			options.push(option);
		}
		return options;
	}

	protected createOption(name: string, expressions: XExpression[], index: number): XOption {
		let expression = expressions[index];
		let creator = PadangCreator.eINSTANCE;
		let literal = expression.toLiteral();
		return creator.createOption(name, "=" + literal);
	}

	public createCall(dataset: string, mutation: XMutation): XCall {

		// Buat call
		let operation = mutation.getOperation();
		let factory = SlemanFactory.eINSTANCE;
		let call = factory.createXCall(operation);
		let args = call.getArguments();

		// Argument pertama adalah dataset
		let reference = factory.createXReference(dataset);
		let argument = factory.createXArgument(reference);
		args.add(argument);

		// Sisanya adalah dari option
		let options = mutation.getOptions();
		let parameters = this.plan.getParameters();
		for (let i = 1; i < parameters.length; i++) {
			let optionIndex = i - 1;
			let option = options.get(optionIndex);
			let formula = option.getFormula();
			let parser = new FormulaParser();
			let expression = parser.parse(formula);
			let factory = SlemanFactory.eINSTANCE;
			let arg = factory.createXArgument();
			arg.setExpression(expression);
			args.add(arg);
		}

		return call;
	}

	protected combineXObject(prevObject: XObject, nextObject: XObject): void {
		let prevFields = prevObject.getFields();
		let nextFields = nextObject.getFields();
		for (let i = 0; i < nextFields.size; i++) {
			let nextField = nextFields.get(i);
			let identifier = nextField.getName();
			let nextName = identifier.getName();
			let absent = true;
			for (let j = 0; j < prevFields.size; j++) {
				let prevField = prevFields.get(j);
				let identifier = prevField.getName();
				let prevName = identifier.getName();
				if (nextName === prevName) {
					let expression = nextField.getExpression();
					prevField.setExpression(expression);
					absent = false;
					break;
				}
			}
			if (absent === true) {
				prevFields.add(nextField);
			}
		}
	}

	protected hasOption(options: { [name: string]: XExpression }, plan: ParameterPlan): boolean {
		let name = plan.getName();
		return options[name] !== undefined;
	}

	protected getValueOption(options: { [name: string]: XConstant }, plan: ParameterPlan): string {
		let name = plan.getName();
		return options[name].toValue();
	}

}

export default Instruction;