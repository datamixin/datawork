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
import XLet from "sleman/model/XLet";
import XCall from "sleman/model/XCall";
import XReference from "sleman/model/XReference";
import SlemanFactory from "sleman/model/SlemanFactory";

import LetAuxiliary from "sleman/graph/LetAuxiliary";

import FormulaParser from "bekasi/FormulaParser";

import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import FromDataset from "padang/functions/source/FromDataset";

import PreparationFormulator from "padang/ui/PreparationFormulator";

import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

export default class BasePreparationFormulator implements PreparationFormulator {

	public createPreparation(formula: string): XPreparation {

		let parser = new FormulaParser();
		let expression = <XLet>parser.parse(formula);

		let creator = PadangCreator.eINSTANCE;
		let preparation = creator.createPreparation();

		// Let variable > mutation
		let mutations = preparation.getMutations();
		let variables = expression.getVariables();
		for (let variable of variables) {

			// Operation
			let call = <XCall>variable.getExpression();
			let callee = <XReference>call.getCallee();

			if (mutations.size === 0) {

				// Initial mutation
				let args = call.getArguments();
				let arg = args.get(0);
				let dataset = <XReference>arg.getExpression();
				let mutation = creator.createMutation(FromDataset.FUNCTION_NAME);
				mutations.add(mutation);

				// Initial option
				let options = mutation.getOptions();
				let datasetName = dataset.getName();
				let formula = "=" + datasetName;
				let optionName = FromDataset.DATASET_PLAN.getName();
				let option = creator.createOption(optionName, formula);
				options.add(option);
			}

			// Mutation
			let operation = callee.getName();
			let mutation = creator.createMutation(operation);
			mutations.add(mutation);

			// Option
			let registry = InstructionRegistry.getInstance();
			if (registry.has(operation) === true) {
				let instruction = registry.get(operation);
				let args = call.getArguments();
				let list = instruction.createOptions(args);
				let options = mutation.getOptions();
				for (let option of list) {
					options.add(option);
				}
			} else {
				throw new Error("Missing instruction '" + operation + "'");
			}

		}

		return preparation;
	}

	public createFormula(preparation: XPreparation): string {

		let factory = SlemanFactory.eINSTANCE;
		let xLet = factory.createXLet();
		let auxiliary = new LetAuxiliary(xLet);
		let mutations = preparation.getMutations();
		let dataset: string = null;
		for (let mutation of mutations) {
			let operation = mutation.getOperation();
			if (operation === FromDataset.FUNCTION_NAME) {

				// First operation as dataset
				let options = mutation.getOptions();
				let option = options.get(0);
				let formula = option.getFormula();
				let parser = new FormulaParser();
				let reference = <XReference>parser.parse(formula);
				dataset = reference.getName();

			} else {

				let registry = InstructionRegistry.getInstance();
				if (registry.has(operation) === true) {
					let instruction = registry.get(operation);
					let call = instruction.createCall(dataset, mutation);
					dataset = auxiliary.addCallVariable(call);
				} else {
					throw new Error("Missing instruction '" + operation + "'");
				}
			}
		}

		let literal = xLet.toLiteral();
		return "=" + literal;
	}

}