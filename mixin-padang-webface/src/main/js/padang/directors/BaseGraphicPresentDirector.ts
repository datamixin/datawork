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
import * as wef from "webface/wef";

import Panel from "webface/wef/Panel";
import Command from "webface/wef/Command";
import Controller from "webface/wef/Controller";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import MapRepopulateCommand from "webface/wef/base/MapRepopulateCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import EditDomainMarker from "webface/wef/util/EditDomainMarker";

import * as bekasi from "bekasi/directors";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import XCell from "padang/model/XCell";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XViewset from "padang/model/XViewset";
import XGraphic from "padang/model/XGraphic";
import XProject from "padang/model/XProject";
import XOutlook from "padang/model/XOutlook";
import XMixture from "padang/model/XMixture";
import PadangCreator from "padang/model/PadangCreator";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueMapping from "padang/util/ValueMapping";

import Renderer from "padang/directors/renderers/Renderer";
import RendererRegistry from "padang/directors/renderers/RendererRegistry";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

import BaseGraphicPremise from "padang/directors/BaseGraphicPremise";
import GraphicPresentDirector from "padang/directors/GraphicPresentDirector";

import GraphicFullDeckComposer from "padang/ui/GraphicFullDeckComposer";

import VariableFormulaSetCommand from "padang/commands/VariableFormulaSetCommand";
import GraphicFormationSetCommand from "padang/commands/GraphicFormationSetCommand";

import GraphicPresentController from "padang/controller/present/GraphicPresentController";

export default class BaseGraphicPresentDirector implements GraphicPresentDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	private addGraphic(controller: Controller, renderer: string,
		dataset: string, callback: (graphic: XGraphic) => void): void {

		let source = "Source";
		let formula = "=`" + dataset + "`";
		let creator = PadangCreator.eINSTANCE;
		let current = <EObject>controller.getModel();
		let viewset = <XViewset>util.getAncestor(current, XViewset);
		let command: Command = null;
		let cell: XCell = null;

		if (viewset !== null) {

			let director = directors.getViewsetPresentDirector(this.viewer);
			let mixture = director.getFocusedMixture();
			cell = creator.createVariableFigureCell(viewset, renderer, source, formula);
			command = director.createCellAddCommand(mixture, cell);

		} else {

			// Untuk di panggil dari luar viewset
			let rootController = this.viewer.getRootController();
			let contents = rootController.getContents();
			let sheet = <XSheet>contents.getModel();
			let project = <XProject>sheet.eContainer();
			let sheets = project.getSheets();

			let newSheet = creator.createMixtureViewsetSheet(project, false);
			let outlook = <XOutlook>newSheet.getForesee();
			let viewset = outlook.getViewset();
			let mixture = <XMixture>viewset.getMixture();
			let parts = mixture.getParts();

			cell = creator.createVariableFigureCell(viewset, renderer, source, formula);
			parts.add(cell);

			let addCommand = new ListAddCommand();
			addCommand.setList(sheets);
			addCommand.setElement(newSheet);
			command = addCommand;

		}

		let figure = <XFigure>cell.getFacet();
		let graphic = figure.getGraphic();

		let director = wef.getSynchronizationDirector(controller);
		director.onCommit(() => {
			callback(graphic);
		});

		controller.execute(command);
	}

	public addGraphicCompose(controller: Controller, structure: string, formula: string): void {
		this.addGraphic(controller, structure, formula, (graphic: XGraphic) => {
			let mapping = new ValueMapping();
			this.openGraphicComposer(graphic, mapping, (ok: boolean) => {

				if (ok === false) {

					// Hapus figure karena baru dibuat
					let figure = <XFigure>graphic.eContainer();
					let cell = <XCell>figure.eContainer();
					let director = directors.getViewsetPresentDirector(this.viewer);
					let command = director.removeCellCommand(cell, [], true);
					this.executeCommand(command);

				}
			});
		});
	}

	private getGraphicPresentControler(descendant: Controller): GraphicPresentController {
		let controller = functions.getFirstDescendantByModelClass(descendant, XGraphic);
		return <GraphicPresentController>controller;
	}

	public openGraphicComposerFrom(descendant: Controller, _callback: () => void): void {
		let controller = this.getGraphicPresentControler(descendant);
		let viewer = controller.getViewer();
		let marker = new EditDomainMarker(viewer);
		let mapping = controller.getMapping();
		let model = controller.getModel();
		this.openGraphicComposer(model, mapping, (ok: boolean) => {
			if (ok === false) {
				marker.reset();
			}
		});
	}

	public openGraphicComposer(graphic: XGraphic, mapping: ValueMapping, callback: (ok: boolean) => void): void {

		// Figure composer
		let premise = new BaseGraphicPremise(this.viewer, graphic, mapping);
		let composer = new GraphicFullDeckComposer(premise);
		let viewer = this.viewer.getRootViewer();
		composer.setParent(viewer);

		// Open composer
		let director = bekasi.getConsoleDirector(this.viewer);
		director.openFullDeck(composer, (result: string) => {

			if (result === FullDeckPanel.OK) {
				this.applyGraphic(graphic, mapping);
			}
			callback(result === FullDeckPanel.OK);
		});
	}

	public applyGraphic(graphic: XGraphic, mapping: ValueMapping): void {

		let formulaKeys = mapping.getFormulaKeys();

		// Evaluate
		let evaluateMap: { [key: string]: string } = {};
		for (let formulaKey of formulaKeys) {
			if (formulaKey.startsWith(padang.CLIENT) || formulaKey.startsWith(padang.SERVER)) {
				evaluateMap[formulaKey] = mapping.getFormula(formulaKey);
			}
		}
		let evaluates = graphic.getEvaluates();
		let evaluateCommand = new MapRepopulateCommand();
		evaluateCommand.setEntries(evaluateMap);
		evaluateCommand.setMap(evaluates);

		// Formation
		let formation = mapping.getFormula(padang.FORMATION);
		let formationCommand = new GraphicFormationSetCommand();
		formationCommand.setGraphic(graphic);
		formationCommand.setFormation(formation);

		// Command
		let group = new CommandGroup();
		group.add(evaluateCommand);
		group.add(formationCommand);

		this.executeCommand(group);

	}

	private executeCommand(command: Command): void {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		contents.execute(command);
	}

	public refreshGraphic(descendant: Controller): void {
		let controller = this.getGraphicPresentControler(descendant);
		controller.refreshComplete();
	}

	public updateVariables(controller: GraphicPresentController, mapping: ValueMapping): void {

		let group = new CommandGroup();

		let keys = mapping.getFormulaKeys();
		let graphic = <XGraphic>controller.getModel();
		let variables = graphic.getVariables();

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

	public createPresentPanel(controller: GraphicPresentController, mapping: ValueMapping): Panel {
		let model = controller.getModel();
		let name = model.getRenderer();
		let formation = this.getRenderer(name);
		let premise = new BaseGraphicPremise(this.viewer, model, mapping);
		return formation.createPresentPanel(controller, premise);
	}

	private getRenderer(name: string): Renderer {
		let registry = RendererRegistry.getInstance();
		let formation = registry.get(name);
		return formation;
	}

	public createWizard(controller: Controller, name: string, dataset: string,
		callback: (dialog: GraphicWizardDialog) => void): void {
		this.addGraphic(controller, name, dataset, (builder: XGraphic) => {
			let mapping = new ValueMapping();
			let premise = new BaseGraphicPremise(this.viewer, builder, mapping);
			let renderer = this.getRenderer(name);
			let dialog = renderer.createWizard(controller, premise);
			callback(dialog);
		});
	}

	public createWizardWithDataset(controller: Controller, name: string, dataset: string,
		callback: (dialog: GraphicWizardDialog) => void): void {
		this.addGraphic(controller, name, dataset, (builder: XGraphic) => {
			let mapping = new ValueMapping();
			let premise = new BaseGraphicPremise(this.viewer, builder, mapping);
			let renderer = this.getRenderer(name);
			let dialog = renderer.createWizardWithDataset(controller, dataset, premise);
			callback(dialog);
		});
	}

}
