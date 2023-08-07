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

import Panel from "webface/wef/Panel";
import Command from "webface/wef/Command";
import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import EditDomainMarker from "webface/wef/util/EditDomainMarker";

import * as bekasi from "bekasi/directors";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import XSheet from "padang/model/XSheet";
import XBuilder from "padang/model/XBuilder";
import XProject from "padang/model/XProject";
import PadangCreator from "padang/model/PadangCreator";

import * as padang from "padang/padang";

import ValueMapping from "padang/util/ValueMapping";

import BuilderComposer from "padang/ui/BuilderComposer";

import Structure from "padang/directors/structures/Structure";
import StructureRegistry from "padang/directors/structures/StructureRegistry";

import BuilderWizardDialog from "padang/dialogs/BuilderWizardDialog";

import BaseBuilderPremise from "padang/directors/BaseBuilderPremise";
import BuilderPresentDirector from "padang/directors/BuilderPresentDirector";

import VariableFormulaSetCommand from "padang/commands/VariableFormulaSetCommand";
import BuilderExplanationSetCommand from "padang/commands/BuilderExplanationSetCommand";

import BuilderPresentController from "padang/controller/present/BuilderPresentController";

export default class BaseBuilderPresentDirector implements BuilderPresentDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	private addBuilder(controller: Controller, structure: string,
		dataset: string, callback: (builder: XBuilder) => void): void {

		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		let sheet = <XSheet>contents.getModel();
		let project = <XProject>sheet.eContainer();

		let creator = PadangCreator.eINSTANCE;
		let newSheet = creator.createBuilderSheet(project, structure);
		let builder = <XBuilder>newSheet.getForesee();

		let source = "Source";
		let formula = "=`" + dataset + "`";
		let variables = builder.getVariables();
		let variable = creator.createVariableUnder(variables, formula, source);
		variables.add(variable);

		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(() => {
			callback(builder);
		});

		let sheets = project.getSheets();
		let command = new ListAddCommand();
		command.setList(sheets);
		command.setElement(newSheet);
		controller.execute(command);
	}

	public addBuilderCompose(controller: Controller, structure: string, formula: string): void {
		this.addBuilder(controller, structure, formula, (builder: XBuilder) => {
			let mapping = new ValueMapping();
			this.openBuilderComposer(builder, mapping, (ok: boolean) => {
				if (ok === false) {
				}
			});
		});
	}

	private getBuilderPresentControler(descendant: Controller): BuilderPresentController {
		let controller = functions.getFirstDescendantByModelClass(descendant, XBuilder);
		return <BuilderPresentController>controller;
	}

	public openBuilderComposerFrom(descendant: Controller, _callback: () => void): void {
		let controller = this.getBuilderPresentControler(descendant);
		let viewer = controller.getViewer();
		let marker = new EditDomainMarker(viewer);
		let mapping = controller.getMapping();
		let model = controller.getModel();
		this.openBuilderComposer(model, mapping, (ok: boolean) => {
			if (ok === false) {
				marker.reset();
			}
		});
	}

	public openBuilderComposer(builder: XBuilder, mapping: ValueMapping, callback: (ok: boolean) => void): void {

		// Figure composer
		let premise = new BaseBuilderPremise(this.viewer, builder, mapping);
		let composer = new BuilderComposer(premise);
		let viewer = this.viewer.getRootViewer();
		composer.setParent(viewer);

		// Open composer
		let director = bekasi.getConsoleDirector(this.viewer);
		director.openFullDeck(composer, (result: string) => {

			if (result === FullDeckPanel.OK) {
				this.applyBuilder(builder, mapping);
			}
			callback(result === FullDeckPanel.OK);
		});
	}

	public applyBuilder(builder: XBuilder, mapping: ValueMapping): void {

		let formulaKeys = mapping.getFormulaKeys();

		// Evaluate
		let evaluateMap: { [key: string]: string } = {};
		for (let formulaKey of formulaKeys) {
			if (formulaKey.startsWith(padang.CLIENT) || formulaKey.startsWith(padang.SERVER)) {
				evaluateMap[formulaKey] = mapping.getFormula(formulaKey);
			}
		}
		// Structure
		let explanation = mapping.getFormula(padang.EXPLANATION);
		let command = new BuilderExplanationSetCommand();
		command.setBuilder(builder);
		command.setExplanation(explanation);
		this.executeCommand(command);
	}

	private executeCommand(command: Command): void {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		contents.execute(command);
	}

	public refreshBuilder(descendant: Controller): void {
		let controller = this.getBuilderPresentControler(descendant);
		controller.refreshComplete();
	}

	public updateVariables(controller: BuilderPresentController, mapping: ValueMapping): void {

		let group = new CommandGroup();

		let keys = mapping.getFormulaKeys();
		let builder = <XBuilder>controller.getModel();
		let variables = builder.getVariables();

		// Looping ke semua key untuk daftar formula
		for (let key of keys) {

			let match = false;
			let newFormula = mapping.getFormula(key);

			// Cari di aspect berdasarkan key 
			for (let aspect of variables) {
				if (aspect.getName() === key) {

					// Jika ada dan formula berbeda maka update
					let oldFormula = aspect.getFormula();
					if (oldFormula !== newFormula) {
						let command = new VariableFormulaSetCommand();
						command.setFormula(newFormula);
						command.setVariable(aspect);
						group.add(command);
					}
					match = true;
					break;
				}
			}

			// Jika key tidak ada maka buat variable baru
			if (match === false) {
				let command = new ListAddCommand();
				let creator = PadangCreator.eINSTANCE;
				let variable = creator.createVariable(key, newFormula);
				command.setList(variables);
				command.setElement(variable);
				group.add(command);
			}
		}

		// Looping ke semua acpect untuk cari formula key yang sudah tidak ada 
		for (let variable of variables) {

			let name = variable.getName();
			if (keys.indexOf(name) === -1) {

				// Buat command untuk hapus aspect variable
				let command = new RemoveCommand();
				command.setModel(variable);
				group.add(command);
			}
		}

		// Execute update
		controller.execute(group);
	}

	public createPresentPanel(controller: BuilderPresentController): Panel {
		let model = controller.getModel();
		let name = model.getStructure();
		let structure = this.getStructure(name);
		let mapping = controller.getMapping();
		let premise = new BaseBuilderPremise(this.viewer, model, mapping);
		return structure.createPresentPanel(controller, premise);
	}

	private getStructure(name: string): Structure {
		let registry = StructureRegistry.getInstance();
		let structure = registry.get(name);
		return structure;
	}

	public createTryoutPanel(controller: BuilderPresentController, mapping?: ValueMapping): Panel {
		let current = mapping;
		if (current === undefined) {
			current = controller.getMapping();
		}
		let model = controller.getModel();
		let name = model.getStructure();
		let structure = this.getStructure(name);
		let premise = new BaseBuilderPremise(this.viewer, model, current);
		return structure.createTryoutPanel(controller, premise);
	}

	public createWizard(controller: Controller, name: string, dataset: string,
		callback: (dialog: BuilderWizardDialog) => void): void {
		this.addBuilder(controller, name, dataset, (builder: XBuilder) => {
			let mapping = new ValueMapping();
			let premise = new BaseBuilderPremise(this.viewer, builder, mapping);
			let structure = this.getStructure(name);
			let dialog = structure.createWizard(controller, premise);
			callback(dialog);
		});
	}

	public createWizardWithDataset(controller: Controller, name: string, dataset: string,
		callback: (dialog: BuilderWizardDialog) => void): void {
		this.addBuilder(controller, name, dataset, (builder: XBuilder) => {
			let mapping = new ValueMapping();
			let premise = new BaseBuilderPremise(this.viewer, builder, mapping);
			let structure = this.getStructure(name);
			let dialog = structure.createWizardWithDataset(controller, dataset, premise);
			callback(dialog);
		});
	}

}
