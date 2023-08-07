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

import Command from "webface/wef/Command";
import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import * as util from "webface/model/util";

import EObject from "webface/model/EObject";

import ListAddCommand from "webface/wef/base/ListAddCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import ListRemoveAllCommand from "webface/wef/base/ListRemoveAllCommand";
import ListRemoveRangeCommand from "webface/wef/base/ListRemoveRangeCommand";

import XExpression from "sleman/model/XExpression";

import FormulaParser from "bekasi/FormulaParser";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XDisplay from "padang/model/XDisplay";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import Interaction from "padang/interactions/Interaction";

import PreparePartViewer from "padang/ui/PreparePartViewer";

import Instruction from "padang/directors/instructions/Instruction";
import InstructionRegistry from "padang/directors/instructions/InstructionRegistry";

import InstoreComposerDialog from "padang/dialogs/InstoreComposerDialog";

import PreparationMutationDirector from "padang/directors/PreparationMutationDirector";

import TabularPrepareController from "padang/controller/prepare/TabularPrepareController";
import DisplayPrepareController from "padang/controller/prepare/DisplayPrepareController";

export default class BasePreparationMutationDirector implements PreparationMutationDirector {

	private viewer: PreparePartViewer = null;

	constructor(viewer: PreparePartViewer) {
		this.viewer = viewer;
	}

	public getInteractionCaption(mutation: XMutation): string {

		let parameters = mutation.getOptions();
		let options: { [name: string]: XExpression } = {};
		for (let i = 0; i < parameters.size; i++) {
			let parameter = parameters.get(i)
			let name = parameter.getName();
			let formula = parameter.getFormula();
			let parser = new FormulaParser();
			let value = parser.parse(formula);
			options[name] = value;
		}

		let name = mutation.getOperation();
		let instruction = this.createInstruction(name);
		let caption = instruction.createCaption(options);
		return caption;

	}

	private createInstruction(name: string): Instruction {
		let registry = InstructionRegistry.getInstance();
		let instruction = registry.get(name);
		return instruction;
	}

	public openInstoreComposer(controller: Controller, mutation: XMutation): void {

		// Copy original
		let original = util.copy(mutation);

		// Mutation composer
		let preparation = <XPreparation>mutation.eContainer();
		let composer = new InstoreComposerDialog(controller, mutation);
		composer.open((result: string) => {

			if (result === InstoreComposerDialog.OK) {

				// Apply preparation result
				let director = directors.getProjectComposerDirector(this.viewer);
				director.inspectValue(preparation, padang.INSPECT_APPLY_RESULT, [], (result: VisageValue) => {

					if (result instanceof VisageError) {

						let message = result.getMessage();
						throw new Error(message);

					} else {

						// Reset preparation display
						let display = preparation.getDisplay();
						let mutations = display.getMutations();
						if (mutations.size > 0) {

							// Reset command
							let command = this.createResetDisplayCommand(display);
							controller.execute(command);

							// Refresh display
							let director = wef.getSynchronizationDirector(controller);
							director.onCommit(() => {
								this.refreshDisplay(display);
							});

						} else {

							this.refreshDisplay(display);

						}

					}
				});

			} else {

				if (!util.isEquals(original, mutation)) {

					// Revert to original
					let command = new ReplaceCommand();
					command.setModel(mutation);
					command.setReplacement(original);
					controller.execute(command);
				}
			}
		});
	}

	public createResetDisplayCommand(display: XDisplay): Command {
		let mutations = display.getMutations();
		let command = new ListRemoveAllCommand();
		command.setList(mutations);
		return command;
	}

	private refreshDisplay(display: XDisplay): void {
		let target = <DisplayPrepareController>this.getController(display);
		target.refreshContent();
	}

	public getController(model: EObject): Controller {
		let controller = this.viewer.getRootController();
		let contents = controller.getContents();
		let target = functions.getFirstDescendantByModel(contents, model);
		return target;
	}

	public getSelectionIndex(): number {
		let director = wef.getSelectionDirector(this.viewer);
		let selection = director.getSelection();
		if (!selection.isEmpty()) {
			let rootController = this.viewer.getRootController();
			let contents = rootController.getContents();
			let preparation = contents.getModel();
			let controller = <Controller>selection.getFirstElement();
			let mutation = controller.getModel();
			let mutations = preparation.getMutations();
			return mutations.indexOf(mutation);
		} else {
			return -1;
		}
	}

	public createMutationCommand(controller: TabularPrepareController,
		preparation: XPreparation, interaction: Interaction, cutoff: boolean): Command {

		let creator = PadangCreator.eINSTANCE;
		let index = this.getSelectionIndex();
		let instruction = this.createInstruction(interaction.interactionName);

		let combinable = false;
		let mutations = preparation.getMutations();
		let previous = mutations.get(index);
		if (index > 0 && mutations.size > 0) {
			let name = previous.getOperation();
			if (instruction.isCombinable(name)) {
				combinable = true;
			}
		}

		let director = directors.getExpressionFormulaDirector(controller);
		let group = new CommandGroup();

		if (cutoff === true) {
			let command = new ListRemoveRangeCommand();
			command.setList(mutations);
			command.setStart(index + 1);
			group.add(command);
		}

		if (combinable === true) {

			// Mutation sebelumn-nya
			let mutation = <XMutation>util.copy(previous);
			let parameters = mutation.getOptions();
			for (let parameter of parameters) {
				let name = parameter.getName();
				let prevFormula = parameter.getFormula();
				let prevValue = director.parseFormula(prevFormula);
				let nextFormula = director.getFormulaFromObject(interaction[name]);
				let nextValue = director.parseFormula(nextFormula);
				let editValue = instruction.combine(name, prevValue, nextValue);
				let editFormula = director.getFormula(editValue);
				parameter.setFormula(editFormula);
			}

			// Replace mutation
			let command = new ReplaceCommand();
			command.setModel(previous);
			command.setReplacement(mutation);
			group.add(command);

		} else {

			// Mutation baru
			let mutation = creator.createMutation(interaction.interactionName);
			let parameters = mutation.getOptions();
			let names = interaction.getOptionNames();
			for (let name of names) {
				let object = interaction[name];
				let formula = "";
				if (typeof (object) === "string" && object.startsWith("=")) {
					formula = object;
				} else {
					formula = director.getFormulaFromObject(object);
				}
				let parameter = creator.createOption(name, formula);
				parameters.add(parameter);
			}

			// Add mutation
			let command = new ListAddCommand();
			command.setElement(mutation);
			command.setList(mutations);
			command.setPosition(index + 1);
			group.add(command);
		}

		// Reset display mutations
		let display = preparation.getDisplay();
		let list = display.getMutations();
		let command = new ListRemoveAllCommand();
		command.setList(list);
		group.add(command);

		return group;

	}

	public computeResult(model: XPreparation, callback?: () => void): void {
		this.inspectValue(model, padang.INSPECT_COMPUTE, [], () => {
			let display = model.getDisplay();
			let controller = <DisplayPrepareController>this.getController(display);
			controller.refreshContent();
			if (callback !== undefined) {
				callback();
			}
		});
	}

	private inspectValue(model: XPreparation, inspect: string, args: any[], callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(model, inspect, args, callback);
	}

}