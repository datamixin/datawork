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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import FormulaParser from "bekasi/FormulaParser";

import VisageList from "bekasi/visage/VisageList";
import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import XCall from "sleman/model/XCall";
import XReference from "sleman/model/XReference";
import XStructure from "sleman/model/XStructure";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";

import ParameterPlan from "padang/plan/ParameterPlan";

import OptionFormula from "padang/directors/OptionFormula";

import FromPreparation from "padang/functions/source/FromPreparation";

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";
import OptionFormulaDirector from "padang/directors/OptionFormulaDirector";

import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

import AssignableRegistry from "padang/directors/assignables/AssignableRegistry";

import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

export default class BaseOptionFormulaDirector implements OptionFormulaDirector {

	private formula = new OptionFormula();

	constructor(_viewer: BasePartViewer) {
	}

	private parse(formula: string): XExpression {
		let parser = new FormulaParser();
		return parser.parse(formula);
	}

	public evaluateValue(formula: string, callback: (value: VisageValue) => void): void {
		let value = this.parse(formula);
		let factory = ExpressionEvaluatorFactory.getInstance();
		let evaluator = factory.create(value);
		let result = evaluator.evaluate();
		callback(result);
	}

	public evaluateAssignable(context: OptionFormulaContext, literal: string, callback: (value: VisageValue) => void): void {

		let expression = this.parse(literal);
		if (expression instanceof XStructure) {

			this.evaluateValue(literal, callback);

		} else if (expression instanceof XCall) {

			this.replaceArguments(expression, context);

			let callee = <XReference>expression.getCallee();
			let name = callee.getName();
			let registry = AssignableRegistry.getInstance();
			if (registry.has(name)) {

				// Front end assignable
				let assignable = registry.get(name);
				if (assignable.evaluate(context, expression, callback)) {
					return;
				}
			}

			// Assignable evaluated at back-end
			let controller = context.getController();
			let model = <EObject>controller.getModel();
			let preparation = util.getAncestor(model, XPreparation);

			// Change first dataset reference to FromPreparation(selectionIndex)
			let args = expression.getArguments();
			if (args.size > 0) {
				let first = args.get(0);
				let reference = first.getExpression();
				if (reference instanceof XReference) {
					if (reference.getName() === DatasetFunction.DATASET_PLAN.getName()) {
						let director = directors.getPreparationMutationDirector(controller);
						let index = director.getSelectionIndex();
						let factory = SlemanFactory.eINSTANCE;
						let relative = model instanceof XMutation ? 1 : 0;
						let position = factory.createXNumber(index - relative);
						let mutation = factory.createXArgument(position);
						let call = factory.createXCall(FromPreparation.FUNCTION_NAME, mutation);
						let newArg = factory.createXArgument(call);
						util.replace(first, newArg);
					}
				}
			}
			let director = directors.getProjectComposerDirector(controller);
			director.inspectValue(preparation, padang.INSPECT_EVALUATE, [expression],
				(value: VisageValue) => {
					if (value instanceof VisageError) {
						let list = new VisageList();
						list.add(value);
						callback(list);
					} else if (value instanceof VisageList) {
						callback(value);
					} else {
						throw new Error("Expected assignable values to be a list");
					}
				}
			);

		}
	}

	private replaceArguments(call: XCall, context: OptionFormulaContext): void {
		let args = call.getArguments();
		for (let arg of args) {
			let expression = arg.getExpression();
			if (expression instanceof XReference) {
				let name = expression.getName();
				if (context.hasOption(name)) {
					let replacement = context.getOption(name);
					util.replace(expression, replacement);
				}
			}
		}
	}

	public getParameterPlan(parameter: XOption): ParameterPlan {
		let name = parameter.getName();
		let mutation = <XMutation>parameter.eContainer();
		let operation = mutation.getOperation();
		let registry = InteractionPlanRegistry.getInstance();
		let interactionPlan = registry.getPlan(operation);
		let list = interactionPlan.getParameterList();
		let parameterPlan = <ParameterPlan>list.getPlan(name);
		return parameterPlan;
	}

	public getDefaultLiteral(plan: ParameterPlan): string {
		return this.formula.getDefaultLiteral(plan);
	}

	public getDefaultValue(plan: ParameterPlan): any {
		return this.formula.getDefaultValue(plan);
	}

}