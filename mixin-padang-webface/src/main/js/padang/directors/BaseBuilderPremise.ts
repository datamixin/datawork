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
import * as wef from "webface/wef";

import EList from "webface/model/EList";

import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";

import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageValue from "bekasi/visage/VisageValue";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import VariableFormulaSetCommand from "padang/commands/VariableFormulaSetCommand";

import XBuilder from "padang/model/XBuilder";
import XVariable from "padang/model/XVariable";
import PadangCreator from "padang/model/PadangCreator";

import ValueMapping from "padang/util/ValueMapping";

import BuilderPremise from "padang/ui/BuilderPremise";
import PreparationFormulator from "padang/ui/PreparationFormulator";

import BaseGraphicPremise from "padang/directors/BaseGraphicPremise";

export default class BaseBuilderPremise extends BaseGraphicPremise implements BuilderPremise {

	constructor(viewer: BaseControllerViewer, builder: XBuilder, mapping: ValueMapping) {
		super(viewer, builder, mapping);
	}

	private getBuilderController(): Controller {
		let rootController = this.viewer.getRootController();
		return functions.getFirstDescendantByModel(rootController, this.model);
	}

	private getVariables(): EList<XVariable> {
		let builder = <XBuilder>this.getModel();
		return builder.getVariables();
	}

	private getVariable(name: string): XVariable {
		let variables = this.getVariables();
		for (let variable of variables) {
			if (name === variable.getName()) {
				return variable;
			}
		}
		return null;
	}

	private getVariableReference(name: string): XReference {
		let factory = SlemanFactory.eINSTANCE;
		return factory.createXReference(name);
	}

	private createFormula(expression: XExpression | string): string {
		let formula: string = <string>expression;
		if (expression instanceof XExpression) {
			return "=" + expression.toLiteral();
		} else {
			return formula;
		}
	}

	public isVariableExists(name: string): boolean {
		let variable = this.getVariable(name);
		return variable !== null;
	}

	public getVariableExpression(name: string): XExpression {
		let variable = this.getVariable(name);
		if (variable !== null) {
			let formula = variable.getFormula();
			return this.parse(formula);
		}
		return null;
	}

	public getVariableResult(name: string, callback: (value: VisageValue) => void): void {
		let variable = this.getVariable(name);
		if (variable !== null) {
			let expression = this.getVariableReference(name);
			let director = directors.getProjectComposerDirector(this.viewer);
			director.inspectValue(this.model, padang.INSPECT_EVALUATE, [expression], (data: VisageValue) => {
				callback(data);
			});
		}
	}

	public setVariableExpression(name: string, expression: XExpression | string, callback: () => void): void {

		let formula = this.createFormula(expression);
		let variable = this.getVariable(name);
		if (variable !== null) {

			// Sync on commit
			this.onCommit(name, callback);

			// Update formula
			let command = new VariableFormulaSetCommand();
			let controller = this.getBuilderController();
			command.setVariable(variable);
			command.setFormula(formula);
			controller.execute(command);

		}
	}

	private onCommit(_name: string, callback: () => void): void {
		let controller = this.getBuilderController();
		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(callback);
	}

	public addVariable(name: string, expression: XExpression | string, callback: () => void): void {

		this.onCommit(name, callback);

		// Variable baru		
		let formula = this.createFormula(expression);
		let controller = this.getBuilderController();
		let creator = PadangCreator.eINSTANCE;
		let variable = creator.createVariable(name, formula);
		let variables = this.getVariables();

		// Add variable
		let command = new ListAddCommand();
		command.setList(variables);
		command.setElement(variable);
		controller.execute(command);

	}

	public prepareVariable(name: string, formulator: PreparationFormulator,
		callback: (formula: string) => void): void {

		let variable = this.getVariable(name);
		let director = directors.getPresentPartDirector(this.viewer);
		let controller = this.getBuilderController();

		director.prepareVariable(controller, variable, formulator, (formula: string) => {

			// Sync
			let director = wef.getSynchronizationDirector(controller);
			director.onCommit(() => {
				callback(formula);
			});

			// Set formula
			let command = new VariableFormulaSetCommand();
			command.setVariable(variable);
			command.setFormula(formula);
			controller.execute(command);

		});
	}

}