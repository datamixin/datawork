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
import XList from "sleman/model/XList";
import XCall from "sleman/model/XCall";
import XReference from "sleman/model/XReference";
import SlemanCreator from "sleman/model/SlemanCreator";
import SlemanInspector from "sleman/model/SlemanInspector";

import FormulaParser from "bekasi/FormulaParser";

import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import Transmute from "padang/functions/model/Transmute";
import Preprocessing from "padang/functions/model/Preprocessing";

import PreparationFormulator from "padang/ui/PreparationFormulator";

import TransmapperRegistry from "malang/directors/transmappers/TransmapperRegistry";

export default class ModelPreparationFormulator implements PreparationFormulator {

	public createPreparation(formula: string): XPreparation {

		let parser = new FormulaParser();
		let proprocessing = <XCall>parser.parse(formula);

		let creator = PadangCreator.eINSTANCE;
		let preparation = creator.createPreparation();

		let inspector = SlemanInspector.eINSTANCE;
		let list = <XList>inspector.getArgumentExpression(proprocessing, 0);

		// Transmute -> mutation
		let mutations = preparation.getMutations();
		let elements = list.getElements()
		for (let element of elements) {

			// Transmute
			let transmute = <XCall>element;
			let reference = <XReference>inspector.getArgumentExpression(transmute, 0);

			// Mutation
			let operation = reference.getName();
			let mutation = creator.createMutation(operation);
			mutations.add(mutation);

			// Option
			let options = mutation.getOptions();
			let inputs = <XList>inspector.getArgumentExpression(transmute, 1);
			let registry = TransmapperRegistry.getInstance();
			let transmapper = registry.getTransmapper(transmute);
			let plan = transmapper.getPlan();
			let parameters = plan.getParameters();
			for (let i = 0; i < inputs.getElementCount(); i++) {
				let expression = inputs.getElementAt(i);
				let formula = "=" + expression.toLiteral();
				let start = transmapper.getOptionStarted();
				let parameter = parameters[start + i];
				let name = parameter.getName();
				let option = creator.createOption(name, formula);
				options.add(option);
			}

		}

		return preparation;
	}

	public createFormula(preparation: XPreparation): string {

		// Preprocessing
		let creator = SlemanCreator.eINSTANCE;
		let preprocessing = creator.createCall(Preprocessing.FUNCTION_NAME);

		let transmutes = creator.createList();
		creator.addArgument(preprocessing, transmutes);

		let parser = new FormulaParser();
		let mutations = preparation.getMutations();
		for (let mutation of mutations) {

			let transmute = creator.createCall(Transmute.FUNCTION_NAME);

			let name = mutation.getOperation();
			let reference = creator.createReference(name);
			creator.addArgument(transmute, reference);

			let list = creator.createList();
			let options = mutation.getOptions();
			for (let option of options) {
				let formula = option.getFormula();
				let expression = parser.parse(formula);
				list.addElement(expression);
			}
			creator.addArgument(transmute, list);

			transmutes.addElement(transmute);

		}

		let literal = preprocessing.toLiteral();
		return "=" + literal;
	}

} 